import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image src="/colabio-logo.svg" alt="Colabio Logo" width={64} height={64} className="h-16 w-16" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-800 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-emerald-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-emerald-200">
            <Link href="/discover">Browse Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
