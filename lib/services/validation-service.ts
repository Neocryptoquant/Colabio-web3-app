import { createServerClient } from "@/lib/supabase"

export async function validateMilestone(milestoneId: string, userId: string, approved: boolean, comment?: string) {
  const supabase = createServerClient()

  // Record validation
  const { data: validationData, error: validationError } = await supabase
    .from("validations")
    .insert({
      milestone_id: milestoneId,
      user_id: userId,
      approved,
      comment,
    })
    .select()
    .single()

  if (validationError) throw validationError

  // Get milestone
  const { data: milestone, error: milestoneError } = await supabase
    .from("milestones")
    .select("id, project_id, validations")
    .eq("id", milestoneId)
    .single()

  if (milestoneError) throw milestoneError

  // Update milestone validations count
  const newValidations = (milestone.validations || 0) + 1

  // Check if milestone should be marked as completed (3 validations required)
  const shouldComplete = newValidations >= 3 && approved

  const { data: updatedMilestone, error: updateError } = await supabase
    .from("milestones")
    .update({
      validations: newValidations,
      completed: shouldComplete ? true : undefined,
      status: shouldComplete ? "completed" : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", milestoneId)
    .select()
    .single()

  if (updateError) throw updateError

  return {
    validation: validationData,
    milestone: updatedMilestone,
  }
}

export async function voteOnProject(projectId: string, userId: string, approve: boolean) {
  const supabase = createServerClient()

  // Record vote
  const { data: voteData, error: voteError } = await supabase
    .from("votes")
    .insert({
      project_id: projectId,
      user_id: userId,
      approve,
    })
    .select()
    .single()

  if (voteError) throw voteError

  // Get current vote counts
  const { data: voteCounts, error: countError } = await supabase
    .from("votes")
    .select("approve")
    .eq("project_id", projectId)

  if (countError) throw countError

  const approveVotes = voteCounts.filter((v) => v.approve).length
  const rejectVotes = voteCounts.filter((v) => !v.approve).length

  // Update project vote counts
  const { data: updatedProject, error: updateError } = await supabase
    .from("projects")
    .update({
      approve_votes: approveVotes,
      reject_votes: rejectVotes,
      // If 10 or more approve votes, set status to active
      status: approveVotes >= 10 ? "active" : rejectVotes >= 10 ? "cancelled" : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single()

  if (updateError) throw updateError

  return {
    vote: voteData,
    project: updatedProject,
  }
}
