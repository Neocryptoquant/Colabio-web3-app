import { ProjectDetail } from "@/components/project-detail"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ProjectDetail id={params.id} />
}
