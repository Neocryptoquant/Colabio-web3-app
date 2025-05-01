import { type NextRequest, NextResponse } from "next/server"
import { getProjects, createProject } from "@/lib/services/project-service"
import { getUserByWalletAddress } from "@/lib/services/user-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || undefined
    const technology = searchParams.get("technology") || undefined

    const projects = await getProjects({
      status: status as string | undefined,
      technology_type: technology as string | undefined,
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
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
