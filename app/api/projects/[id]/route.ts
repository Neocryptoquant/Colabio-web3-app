import { type NextRequest, NextResponse } from "next/server"
import { getProjectById, updateProjectStatus } from "@/lib/services/project-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    const project = await getProjectById(projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const project = await updateProjectStatus(projectId, status)

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}
