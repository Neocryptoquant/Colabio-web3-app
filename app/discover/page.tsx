import { ProjectDiscovery } from "@/components/project-discovery"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading-states"

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectDiscovery />
    </Suspense>
  )
}
