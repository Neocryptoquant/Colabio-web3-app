import { type NextRequest, NextResponse } from "next/server"
import { getOrCreateUser } from "@/lib/services/user-service"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get or create user
    const user = await getOrCreateUser(walletAddress)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error in wallet auth:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
