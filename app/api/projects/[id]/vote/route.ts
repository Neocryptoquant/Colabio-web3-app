import { type NextRequest, NextResponse } from "next/server"
import { voteOnProject } from "@/lib/services/validation-service"
import { getUserByWalletAddress } from "@/lib/services/user-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const { walletAddress, approve } = await request.json()

    if (approve === undefined) {
      return NextResponse.json({ error: "Approve status is required" }, { status: 400 })
    }

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get user by wallet address
    const user = await getUserByWalletAddress(walletAddress)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await voteOnProject(projectId, user.id, approve)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error voting on project:", error)
    return NextResponse.json({ error: "Failed to vote on project" }, { status: 500 })
  }
}
