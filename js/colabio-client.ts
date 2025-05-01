import {
  type Connection,
  type Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import BN from "bn.js"

export class ColabioClient {
  connection: Connection
  programId: PublicKey

  constructor(connection: Connection, programId: PublicKey) {
    this.connection = connection
    this.programId = programId
  }

  async initializeProject(
    payer: Keypair,
    projectAccount: Keypair,
    title: string,
    description: string,
    goalAmount: number,
    durationDays: number,
    milestones: Array<{
      name: string
      description: string
      amount: number
    }>,
  ) {
    // Convert duration from days to seconds
    const durationSeconds = durationDays * 24 * 60 * 60

    // Create instruction data
    const instructionData = Buffer.alloc(1000) // Allocate enough space
    let offset = 0

    // Instruction tag
    instructionData.writeUInt8(0, offset)
    offset += 1

    // Title
    const titleBuffer = Buffer.from(title)
    instructionData.writeUInt32LE(titleBuffer.length, offset)
    offset += 4
    titleBuffer.copy(instructionData, offset)
    offset += titleBuffer.length

    // Description
    const descriptionBuffer = Buffer.from(description)
    instructionData.writeUInt32LE(descriptionBuffer.length, offset)
    offset += 4
    descriptionBuffer.copy(instructionData, offset)
    offset += descriptionBuffer.length

    // Goal amount (in lamports)
    const goalAmountLamports = new BN(goalAmount * 1_000_000_000) // Convert SOL to lamports
    instructionData.writeBigUInt64LE(BigInt(goalAmountLamports.toString()), offset)
    offset += 8

    // Duration
    instructionData.writeBigUInt64LE(BigInt(durationSeconds), offset)
    offset += 8

    // Milestones
    instructionData.writeUInt8(milestones.length, offset)
    offset += 1

    for (const milestone of milestones) {
      // Milestone name
      const nameBuffer = Buffer.from(milestone.name)
      instructionData.writeUInt32LE(nameBuffer.length, offset)
      offset += 4
      nameBuffer.copy(instructionData, offset)
      offset += nameBuffer.length

      // Milestone description
      const milestoneDescBuffer = Buffer.from(milestone.description)
      instructionData.writeUInt32LE(milestoneDescBuffer.length, offset)
      offset += 4
      milestoneDescBuffer.copy(instructionData, offset)
      offset += milestoneDescBuffer.length

      // Milestone amount
      const milestoneAmountLamports = new BN(milestone.amount * 1_000_000_000)
      instructionData.writeBigUInt64LE(BigInt(milestoneAmountLamports.toString()), offset)
      offset += 8
    }

    // Trim the buffer to the actual data size
    const finalInstructionData = instructionData.slice(0, offset)

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: finalInstructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [payer, projectAccount])

    return {
      projectId: projectAccount.publicKey.toString(),
      signature,
    }
  }

  async contribute(payer: Keypair, projectPubkey: PublicKey, contributionAccount: Keypair, amount: number) {
    // Convert amount from SOL to lamports
    const lamports = new BN(amount * 1_000_000_000)

    // Create instruction data
    const instructionData = Buffer.alloc(9)
    instructionData.writeUInt8(1, 0) // Instruction tag
    instructionData.writeBigUInt64LE(BigInt(lamports.toString()), 1)

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPubkey, isSigner: false, isWritable: true },
        { pubkey: contributionAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [payer, contributionAccount])

    return {
      contributionId: contributionAccount.publicKey.toString(),
      signature,
    }
  }

  async validateMilestone(
    validator: Keypair,
    projectPubkey: PublicKey,
    validationAccount: Keypair,
    milestoneIndex: number,
  ) {
    // Create instruction data
    const instructionData = Buffer.alloc(2)
    instructionData.writeUInt8(2, 0) // Instruction tag
    instructionData.writeUInt8(milestoneIndex, 1)

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: validator.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPubkey, isSigner: false, isWritable: true },
        { pubkey: validationAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [validator, validationAccount])

    return {
      validationId: validationAccount.publicKey.toString(),
      signature,
    }
  }

  async releaseFunds(creator: Keypair, projectPubkey: PublicKey, milestoneIndex: number) {
    // Create instruction data
    const instructionData = Buffer.alloc(2)
    instructionData.writeUInt8(3, 0) // Instruction tag
    instructionData.writeUInt8(milestoneIndex, 1)

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [creator])

    return { signature }
  }

  async cancelProject(creator: Keypair, projectPubkey: PublicKey) {
    // Create instruction data
    const instructionData = Buffer.alloc(1)
    instructionData.writeUInt8(4, 0) // Instruction tag

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: creator.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPubkey, isSigner: false, isWritable: true },
      ],
      programId: this.programId,
      data: instructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [creator])

    return { signature }
  }

  async vote(voter: Keypair, projectPubkey: PublicKey, voteAccount: Keypair, approve: boolean) {
    // Create instruction data
    const instructionData = Buffer.alloc(2)
    instructionData.writeUInt8(5, 0) // Instruction tag
    instructionData.writeUInt8(approve ? 1 : 0, 1)

    // Create the instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: voter.publicKey, isSigner: true, isWritable: true },
        { pubkey: projectPubkey, isSigner: false, isWritable: true },
        { pubkey: voteAccount.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: instructionData,
    })

    // Create and send transaction
    const transaction = new Transaction().add(instruction)
    const signature = await sendAndConfirmTransaction(this.connection, transaction, [voter, voteAccount])

    return {
      voteId: voteAccount.publicKey.toString(),
      signature,
    }
  }

  async getProject(projectPubkey: PublicKey) {
    const accountInfo = await this.connection.getAccountInfo(projectPubkey)
    if (!accountInfo) {
      throw new Error("Project not found")
    }

    // Parse the account data
    // This is a simplified version - in a real implementation,
    // you would use borsh or another serialization library
    const data = accountInfo.data

    // For demonstration purposes, we'll return a mock project
    return {
      pubkey: projectPubkey.toString(),
      creator: new PublicKey(data.slice(0, 32)).toString(),
      title: "Project Title", // In reality, you would parse this from the data
      description: "Project Description",
      goalAmount: 100,
      raisedAmount: 50,
      status: "Active",
      milestones: [
        {
          name: "Milestone 1",
          description: "First milestone",
          amount: 30,
          completed: false,
          validations: 1,
        },
        {
          name: "Milestone 2",
          description: "Second milestone",
          amount: 70,
          completed: false,
          validations: 0,
        },
      ],
      approveVotes: 15,
      rejectVotes: 3,
    }
  }
}
