import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // This is a placeholder that returns static data
    // In a real implementation, this would fetch from Supabase
    const project = {
      id: projectId,
      title: "Community Solar Array - Greenville",
      description:
        "This project aims to install a community-owned solar array that will provide clean, renewable energy to the rural community of Greenville.",
      location: "Greenville, CA",
      progress: 65,
      goal: 500,
      raised: 325,
      risk: "low",
      technology_type: "solar",
      status: "active",
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
