import { createServerClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectWithMedia = Database["public"]["Tables"]["projects"]["Row"] & {
  project_media: Database["public"]["Tables"]["project_media"]["Row"][]
  milestones: Database["public"]["Tables"]["milestones"]["Row"][]
  team_members?: Database["public"]["Tables"]["team_members"]["Row"][]
}

export async function getProjects(filters?: {
  status?: string
  technology_type?: string
  creator_id?: string
}) {
  const supabase = createServerClient()

  let query = supabase.from("projects").select(`
      *,
      project_media (*)
    `)

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.technology_type) {
    query = query.eq("technology_type", filters.technology_type)
  }

  if (filters?.creator_id) {
    query = query.eq("creator_id", filters.creator_id)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}

export async function getProjectById(id: string): Promise<ProjectWithMedia | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_media (*),
      milestones (*),
      team_members (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // Project not found
    }
    throw error
  }

  return data as ProjectWithMedia
}

export async function createProject(
  project: ProjectInsert,
  media?: Array<{ url: string; media_type: string; caption?: string; is_main?: boolean }>,
  milestones?: Array<{ name: string; description: string; amount: number; target_date?: string }>,
  team_members?: Array<{ name: string; role: string; bio?: string; photo_url?: string }>,
) {
  const supabase = createServerClient()

  // Start a transaction
  const { data: projectData, error: projectError } = await supabase.from("projects").insert(project).select().single()

  if (projectError) throw projectError

  const projectId = projectData.id

  // Insert media if provided
  if (media && media.length > 0) {
    const mediaToInsert = media.map((m) => ({
      project_id: projectId,
      ...m,
    }))

    const { error: mediaError } = await supabase.from("project_media").insert(mediaToInsert)

    if (mediaError) throw mediaError
  }

  // Insert milestones if provided
  if (milestones && milestones.length > 0) {
    const milestonesToInsert = milestones.map((m) => ({
      project_id: projectId,
      ...m,
    }))

    const { error: milestonesError } = await supabase.from("milestones").insert(milestonesToInsert)

    if (milestonesError) throw milestonesError
  }

  // Insert team members if provided
  if (team_members && team_members.length > 0) {
    const teamToInsert = team_members.map((m) => ({
      project_id: projectId,
      ...m,
    }))

    const { error: teamError } = await supabase.from("team_members").insert(teamToInsert)

    if (teamError) throw teamError
  }

  return await getProjectById(projectId)
}

export async function updateProjectStatus(projectId: string, status: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single()

  if (error) throw error

  return data
}

export async function recordContribution(
  projectId: string,
  amount: number,
  userId?: string,
  transactionSignature?: string,
) {
  const supabase = createServerClient()

  // Insert contribution
  const { data: contributionData, error: contributionError } = await supabase
    .from("contributions")
    .insert({
      project_id: projectId,
      user_id: userId,
      amount,
      transaction_signature: transactionSignature,
    })
    .select()
    .single()

  if (contributionError) throw contributionError

  // Update project raised amount
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("raised_amount")
    .eq("id", projectId)
    .single()

  if (projectError) throw projectError

  const newAmount = (Number.parseFloat(project.raised_amount.toString()) || 0) + amount

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      raised_amount: newAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  if (updateError) throw updateError

  return contributionData
}
