use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
    program::{invoke, invoke_signed},
    system_instruction,
};
use std::convert::TryInto;

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Unpack instruction data
    let instruction = ColabioInstruction::unpack(instruction_data)?;
    
    match instruction {
        ColabioInstruction::InitializeProject {
            title,
            description,
            goal_amount,
            duration,
            milestones,
        } => {
            process_initialize_project(program_id, accounts, title, description, goal_amount, duration, milestones)
        }
        ColabioInstruction::Contribute { amount } => {
            process_contribute(program_id, accounts, amount)
        }
        ColabioInstruction::ValidateMilestone { milestone_index } => {
            process_validate_milestone(program_id, accounts, milestone_index)
        }
        ColabioInstruction::ReleaseFunds { milestone_index } => {
            process_release_funds(program_id, accounts, milestone_index)
        }
        ColabioInstruction::CancelProject {} => {
            process_cancel_project(program_id, accounts)
        }
        ColabioInstruction::Vote { approve } => {
            process_vote(program_id, accounts, approve)
        }
    }
}

// Instructions supported by the program
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum ColabioInstruction {
    /// Initialize a new project
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Project creator
    /// 1. `[writable]` Project account, must be uninitialized
    /// 2. `[]` Rent sysvar
    /// 3. `[]` System program
    InitializeProject {
        title: String,
        description: String,
        goal_amount: u64,
        duration: u64,
        milestones: Vec<Milestone>,
    },
    
    /// Contribute funds to a project
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Contributor
    /// 1. `[writable]` Project account
    /// 2. `[writable]` Contribution account, must be uninitialized
    /// 3. `[]` System program
    Contribute {
        amount: u64,
    },
    
    /// Validate a milestone
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Validator
    /// 1. `[writable]` Project account
    /// 2. `[writable]` Validation account
    /// 3. `[]` System program
    ValidateMilestone {
        milestone_index: u8,
    },
    
    /// Release funds for a completed milestone
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Project creator
    /// 1. `[writable]` Project account
    /// 2. `[]` System program
    ReleaseFunds {
        milestone_index: u8,
    },
    
    /// Cancel a project and refund contributors
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Project creator
    /// 1. `[writable]` Project account
    /// 2. `[]` System program
    CancelProject {},
    
    /// Vote on a project
    /// 
    /// Accounts expected:
    /// 0. `[signer]` Voter
    /// 1. `[writable]` Project account
    /// 2. `[writable]` Vote account
    /// 3. `[]` System program
    Vote {
        approve: bool,
    },
}

impl ColabioInstruction {
    /// Unpacks a byte buffer into a ColabioInstruction
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        
        Ok(match tag {
            0 => {
                let (title, rest) = Self::unpack_string(rest)?;
                let (description, rest) = Self::unpack_string(rest)?;
                let goal_amount = Self::unpack_u64(rest, 0)?;
                let duration = Self::unpack_u64(rest, 8)?;
                
                // Unpack milestones
                let milestones_len = rest[16] as usize;
                let mut milestones = Vec::with_capacity(milestones_len);
                let mut offset = 17;
                
                for _ in 0..milestones_len {
                    let (name, new_rest) = Self::unpack_string(&rest[offset..])?;
                    offset += name.len() + 4; // 4 bytes for string length
                    
                    let (description, _) = Self::unpack_string(&rest[offset..])?;
                    offset += description.len() + 4;
                    
                    let amount = Self::unpack_u64(&rest, offset)?;
                    offset += 8;
                    
                    milestones.push(Milestone {
                        name,
                        description,
                        amount,
                        completed: false,
                        validations: 0,
                    });
                }
                
                Self::InitializeProject {
                    title,
                    description,
                    goal_amount,
                    duration,
                    milestones,
                }
            }
            1 => {
                let amount = Self::unpack_u64(rest, 0)?;
                Self::Contribute { amount }
            }
            2 => {
                let milestone_index = rest[0];
                Self::ValidateMilestone { milestone_index }
            }
            3 => {
                let milestone_index = rest[0];
                Self::ReleaseFunds { milestone_index }
            }
            4 => Self::CancelProject {},
            5 => {
                let approve = rest[0] != 0;
                Self::Vote { approve }
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
    
    fn unpack_string(input: &[u8]) -> Result<(String, &[u8]), ProgramError> {
        let str_len = u32::from_le_bytes(
            input.get(..4)
                .ok_or(ProgramError::InvalidInstructionData)?
                .try_into()
                .unwrap()
        ) as usize;
        
        let str_data = input.get(4..4+str_len)
            .ok_or(ProgramError::InvalidInstructionData)?;
            
        let str_value = String::from_utf8(str_data.to_vec())
            .map_err(|_| ProgramError::InvalidInstructionData)?;
            
        Ok((str_value, &input[4+str_len..]))
    }
    
    fn unpack_u64(input: &[u8], start: usize) -> Result<u64, ProgramError> {
        let bytes = input.get(start..start+8)
            .ok_or(ProgramError::InvalidInstructionData)?
            .try_into()
            .unwrap();
        Ok(u64::from_le_bytes(bytes))
    }
}

// Define the program's account structures
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Project {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub goal_amount: u64,
    pub raised_amount: u64,
    pub start_time: u64,
    pub end_time: u64,
    pub milestones: Vec<Milestone>,
    pub status: ProjectStatus,
    pub approve_votes: u32,
    pub reject_votes: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Milestone {
    pub name: String,
    pub description: String,
    pub amount: u64,
    pub completed: bool,
    pub validations: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum ProjectStatus {
    Pending,
    Active,
    Completed,
    Cancelled,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Contribution {
    pub contributor: Pubkey,
    pub project: Pubkey,
    pub amount: u64,
    pub timestamp: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Validation {
    pub validator: Pubkey,
    pub project: Pubkey,
    pub milestone_index: u8,
    pub timestamp: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Vote {
    pub voter: Pubkey,
    pub project: Pubkey,
    pub approve: bool,
    pub timestamp: u64,
}

// Process functions for each instruction
fn process_initialize_project(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    goal_amount: u64,
    duration: u64,
    milestones: Vec<Milestone>,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let creator_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    let rent_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify creator is signer
    if !creator_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify program owns the project account
    if project_account.owner != program_id {
        // Create the project account
        let rent = Rent::from_account_info(rent_account)?;
        let space = 1000; // Estimate space needed for the project data
        let lamports = rent.minimum_balance(space);
        
        invoke(
            &system_instruction::create_account(
                creator_account.key,
                project_account.key,
                lamports,
                space as u64,
                program_id,
            ),
            &[creator_account.clone(), project_account.clone(), system_program.clone()],
        )?;
    }
    
    // Get current timestamp
    let clock = solana_program::clock::Clock::get()?;
    let current_time = clock.unix_timestamp as u64;
    
    // Create project data
    let project_data = Project {
        creator: *creator_account.key,
        title,
        description,
        goal_amount,
        raised_amount: 0,
        start_time: current_time,
        end_time: current_time + duration,
        milestones,
        status: ProjectStatus::Pending,
        approve_votes: 0,
        reject_votes: 0,
    };
    
    // Serialize and save project data
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    msg!("Project initialized: {}", project_data.title);
    Ok(())
}

fn process_contribute(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let contributor_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    let contribution_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify contributor is signer
    if !contributor_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize project data
    let mut project_data = Project::try_from_slice(&project_account.data.borrow())?;
    
    // Check project status
    if project_data.status != ProjectStatus::Active {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check if project is still accepting contributions
    let clock = solana_program::clock::Clock::get()?;
    let current_time = clock.unix_timestamp as u64;
    
    if current_time > project_data.end_time {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Create contribution account if needed
    if contribution_account.owner != program_id {
        let rent = Rent::get()?;
        let space = 100; // Estimate space needed for contribution data
        let lamports = rent.minimum_balance(space);
        
        invoke(
            &system_instruction::create_account(
                contributor_account.key,
                contribution_account.key,
                lamports,
                space as u64,
                program_id,
            ),
            &[contributor_account.clone(), contribution_account.clone(), system_program.clone()],
        )?;
    }
    
    // Transfer SOL from contributor to project account
    invoke(
        &system_instruction::transfer(
            contributor_account.key,
            project_account.key,
            amount,
        ),
        &[contributor_account.clone(), project_account.clone(), system_program.clone()],
    )?;
    
    // Update project raised amount
    project_data.raised_amount += amount;
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    // Create contribution record
    let contribution_data = Contribution {
        contributor: *contributor_account.key,
        project: *project_account.key,
        amount,
        timestamp: current_time,
    };
    
    // Serialize and save contribution data
    contribution_data.serialize(&mut *contribution_account.data.borrow_mut())?;
    
    msg!("Contribution of {} lamports received", amount);
    Ok(())
}

fn process_validate_milestone(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    milestone_index: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let validator_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    let validation_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify validator is signer
    if !validator_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize project data
    let mut project_data = Project::try_from_slice(&project_account.data.borrow())?;
    
    // Check project status
    if project_data.status != ProjectStatus::Active {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check milestone index
    if milestone_index as usize >= project_data.milestones.len() {
        return Err(ProgramError::InvalidArgument);
    }
    
    // Create validation account if needed
    if validation_account.owner != program_id {
        let rent = Rent::get()?;
        let space = 100; // Estimate space needed for validation data
        let lamports = rent.minimum_balance(space);
        
        invoke(
            &system_instruction::create_account(
                validator_account.key,
                validation_account.key,
                lamports,
                space as u64,
                program_id,
            ),
            &[validator_account.clone(), validation_account.clone(), system_program.clone()],
        )?;
    }
    
    // Update milestone validations
    project_data.milestones[milestone_index as usize].validations += 1;
    
    // Check if milestone has enough validations to be considered complete
    // For simplicity, we'll say 3 validations are required
    if project_data.milestones[milestone_index as usize].validations >= 3 {
        project_data.milestones[milestone_index as usize].completed = true;
    }
    
    // Save updated project data
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    // Create validation record
    let clock = solana_program::clock::Clock::get()?;
    let current_time = clock.unix_timestamp as u64;
    
    let validation_data = Validation {
        validator: *validator_account.key,
        project: *project_account.key,
        milestone_index,
        timestamp: current_time,
    };
    
    // Serialize and save validation data
    validation_data.serialize(&mut *validation_account.data.borrow_mut())?;
    
    msg!("Milestone {} validated", milestone_index);
    Ok(())
}

fn process_release_funds(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    milestone_index: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let creator_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify creator is signer
    if !creator_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize project data
    let mut project_data = Project::try_from_slice(&project_account.data.borrow())?;
    
    // Verify creator is project owner
    if project_data.creator != *creator_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check project status
    if project_data.status != ProjectStatus::Active {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check milestone index
    if milestone_index as usize >= project_data.milestones.len() {
        return Err(ProgramError::InvalidArgument);
    }
    
    // Check if milestone is completed
    if !project_data.milestones[milestone_index as usize].completed {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Get milestone amount
    let amount = project_data.milestones[milestone_index as usize].amount;
    
    // Transfer funds from project account to creator
    let project_seeds = &[
        b"project",
        project_account.key.as_ref(),
        &[0], // Bump seed
    ];
    let project_signer = &[&project_seeds[..]];
    
    invoke_signed(
        &system_instruction::transfer(
            project_account.key,
            creator_account.key,
            amount,
        ),
        &[project_account.clone(), creator_account.clone(), system_program.clone()],
        project_signer,
    )?;
    
    // Check if all milestones are completed
    let all_completed = project_data.milestones.iter().all(|m| m.completed);
    if all_completed {
        project_data.status = ProjectStatus::Completed;
    }
    
    // Save updated project data
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    msg!("Released {} lamports for milestone {}", amount, milestone_index);
    Ok(())
}

fn process_cancel_project(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let creator_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    
    // Verify creator is signer
    if !creator_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize project data
    let mut project_data = Project::try_from_slice(&project_account.data.borrow())?;
    
    // Verify creator is project owner
    if project_data.creator != *creator_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check project status
    if project_data.status != ProjectStatus::Pending && project_data.status != ProjectStatus::Active {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Set project status to cancelled
    project_data.status = ProjectStatus::Cancelled;
    
    // Save updated project data
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    msg!("Project cancelled");
    Ok(())
}

fn process_vote(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    approve: bool,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    
    // Get accounts
    let voter_account = next_account_info(accounts_iter)?;
    let project_account = next_account_info(accounts_iter)?;
    let vote_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    
    // Verify voter is signer
    if !voter_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Deserialize project data
    let mut project_data = Project::try_from_slice(&project_account.data.borrow())?;
    
    // Check project status
    if project_data.status != ProjectStatus::Pending {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Create vote account if needed
    if vote_account.owner != program_id {
        let rent = Rent::get()?;
        let space = 100; // Estimate space needed for vote data
        let lamports = rent.minimum_balance(space);
        
        invoke(
            &system_instruction::create_account(
                voter_account.key,
                vote_account.key,
                lamports,
                space as u64,
                program_id,
            ),
            &[voter_account.clone(), vote_account.clone(), system_program.clone()],
        )?;
    }
    
    // Update project votes
    if approve {
        project_data.approve_votes += 1;
    } else {
        project_data.reject_votes += 1;
    }
    
    // Check if project has enough votes to change status
    // For simplicity, we'll say 10 approve votes are needed to activate
    if project_data.approve_votes >= 10 {
        project_data.status = ProjectStatus::Active;
    } else if project_data.reject_votes >= 10 {
        project_data.status = ProjectStatus::Cancelled;
    }
    
    // Save updated project data
    project_data.serialize(&mut *project_account.data.borrow_mut())?;
    
    // Create vote record
    let clock = solana_program::clock::Clock::get()?;
    let current_time = clock.unix_timestamp as u64;
    
    let vote_data = Vote {
        voter: *voter_account.key,
        project: *project_account.key,
        approve,
        timestamp: current_time,
    };
    
    // Serialize and save vote data
    vote_data.serialize(&mut *vote_account.data.borrow_mut())?;
    
    msg!("Vote recorded: {}", if approve { "approve" } else { "reject" });
    Ok(())
}
