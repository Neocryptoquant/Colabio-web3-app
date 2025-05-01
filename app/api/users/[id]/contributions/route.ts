import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("contributions")
      .select(`
        *,
        projects (title)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Format the contributions for the frontend
    const formattedContributions = data.map((contribution) => ({
      id: contribution.id,
      project: contribution.projects?.title || "Unknown Project",
      amount: `${contribution.amount} SOL`,
      date: new Date(contribution.created_at).toLocaleDateString(),
      status: "Completed",
      transaction_signature: contribution.transaction_signature,
    }))

    return NextResponse.json({ contributions: formattedContributions })
  } catch (error) {
    console.error("Error fetching contributions:", error)
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 })
  }
}
