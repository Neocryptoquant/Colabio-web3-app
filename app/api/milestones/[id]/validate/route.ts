import { type NextRequest, NextResponse } from "next/server"
import { validateMilestone } from "@/lib/services/validation-service"
import { getUserByWalletAddress } from "@/lib/services/user-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const milestoneId = params.id
    const { walletAddress, approved, comment } = await request.json()

    if (approved === undefined) {
      return NextResponse.json({ error: "Approved status is required" }, { status: 400 })
    }

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get user by wallet address
    const user = await getUserByWalletAddress(walletAddress)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await validateMilestone(milestoneId, user.id, approved, comment)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error validating milestone:", error)
    return NextResponse.json({ error: "Failed to validate milestone" }, { status: 500 })
  }
}
