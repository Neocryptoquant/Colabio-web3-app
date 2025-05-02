import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-white">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Image src="/colabio-logo-light.png" alt="Colabio Logo" width={200} height={80} className="mx-auto" />
          <h1 className="text-3xl font-bold mt-4">Colabio</h1>
          <p className="text-green-600 mt-2">Crowdfund natively on Solana</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/discover">Browse Projects</Link>
          </Button>

          <Button asChild variant="outline" className="w-full border-green-200">
            <Link href="/create">Create Project</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
