import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-white">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Button asChild className="bg-green-600 hover:bg-green-700">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
