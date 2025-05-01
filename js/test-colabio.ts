import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { ColabioClient } from "./colabio-client"

async function main() {
  // Connect to the Solana devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

  // Replace with your program ID
  const programId = new PublicKey("YOUR_PROGRAM_ID_HERE")

  // Create a client instance
  const client = new ColabioClient(connection, programId)

  // Generate keypairs for testing
  const creator = Keypair.generate()
  const projectAccount = Keypair.generate()
  const contributor = Keypair.generate()
  const contributionAccount = Keypair.generate()
  const validator = Keypair.generate()
  const validationAccount = Keypair.generate()

  console.log("Creator pubkey:", creator.publicKey.toString())
  console.log("Project pubkey:", projectAccount.publicKey.toString())

  // Request airdrop for testing
  const airdropSignature = await connection.requestAirdrop(
    creator.publicKey,
    2 * 1_000_000_000, // 2 SOL
  )
  await connection.confirmTransaction(airdropSignature)

  // Initialize a project
  const projectResult = await client.initializeProject(
    creator,
    projectAccount,
    "Community Solar Array",
    "Solar power installation for a rural community center",
    500, // 500 SOL goal
    30, // 30 days duration
    [
      {
        name: "Land acquisition",
        description: "Purchase of 2-acre plot for solar installation",
        amount: 100, // 100 SOL
      },
      {
        name: "Equipment procurement",
        description: "Purchase of solar panels, inverters, and mounting hardware",
        amount: 250, // 250 SOL
      },
      {
        name: "Installation",
        description: "Physical installation of solar array and connection equipment",
        amount: 150, // 150 SOL
      },
    ],
  )

  console.log("Project created:", projectResult)

  // Vote to approve the project
  const voteAccount = Keypair.generate()
  const voteResult = await client.vote(
    validator,
    projectAccount.publicKey,
    voteAccount,
    true, // approve
  )

  console.log("Vote recorded:", voteResult)

  // Contribute to the project
  const contributionResult = await client.contribute(
    contributor,
    projectAccount.publicKey,
    contributionAccount,
    5, // 5 SOL
  )

  console.log("Contribution made:", contributionResult)

  // Validate a milestone
  const validationResult = await client.validateMilestone(
    validator,
    projectAccount.publicKey,
    validationAccount,
    0, // first milestone
  )

  console.log("Milestone validated:", validationResult)

  // Release funds for a milestone
  const releaseResult = await client.releaseFunds(
    creator,
    projectAccount.publicKey,
    0, // first milestone
  )

  console.log("Funds released:", releaseResult)

  // Get project details
  const projectDetails = await client.getProject(projectAccount.publicKey)
  console.log("Project details:", projectDetails)
}

main().catch(console.error)
