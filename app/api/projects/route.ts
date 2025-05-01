import { type NextRequest, NextResponse } from "next/server"
import { createProject } from "@/lib/services/project-service"
import { getUserByWalletAddress } from "@/lib/services/user-service"

export async function GET(request: NextRequest) {
  // This is a placeholder that returns static data
  // In a real implementation, this would fetch from Supabase
  const projects = [
    {
      id: "1",
      title: "Community Solar Array",
      description: "Solar power installation for a rural community center",
      location: "Greenville, CA",
      image: "/project-solar.jpg",
      progress: 65,
      goal: 500,
      raised: 325,
      risk: "low",
      technology_type: "solar",
      status: "active",
    },
    // Add more sample projects here
  ]

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  try {
    const {
      walletAddress,
      title,
      tagline,
      description,
      location,
      technology_type,
      goal_amount,
      duration_days,
      milestones,
      media,
      team_members,
    } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get user by wallet address
    const user = await getUserByWalletAddress(walletAddress)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create project
    const project = await createProject(
      {
        creator_id: user.id,
        title,
        tagline,
        description,
        location,
        technology_type,
        goal_amount,
        duration_days,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000).toISOString(),
      },
      media,
      milestones,
      team_members,
    )

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
