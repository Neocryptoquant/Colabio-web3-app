import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/colabio-logo-light.png"
            alt="Colabio Logo"
            width={150}
            height={60}
            className="h-auto w-36 dark:hidden"
          />
          <Image
            src="/colabio-logo-dark.png"
            alt="Colabio Logo"
            width={150}
            height={60}
            className="h-auto w-36 hidden dark:block"
          />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-200 dark:border-gray-700">
            <Link href="/discover">Browse Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
