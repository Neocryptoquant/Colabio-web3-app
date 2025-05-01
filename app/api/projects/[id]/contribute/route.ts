import { type NextRequest, NextResponse } from "next/server"
import { recordContribution } from "@/lib/services/project-service"
import { getUserByWalletAddress } from "@/lib/services/user-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const { walletAddress, amount, transactionSignature } = await request.json()

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    let userId: string | undefined = undefined

    if (walletAddress) {
      const user = await getUserByWalletAddress(walletAddress)
      if (user) {
        userId = user.id
      }
    }

    const contribution = await recordContribution(projectId, amount, userId, transactionSignature)

    return NextResponse.json({ contribution })
  } catch (error) {
    console.error("Error recording contribution:", error)
    return NextResponse.json({ error: "Failed to record contribution" }, { status: 500 })
  }
}
