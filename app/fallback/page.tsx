import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/colabio-logo.svg" alt="Colabio Logo" width={80} height={80} className="h-20 w-20" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-700">Colabio</h1>
          <p className="text-emerald-600 mt-1">Crowdfund on Solana</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Welcome to Colabio</h2>
          <p className="text-gray-600 mb-6">
            Colabio is a decentralized platform for crowdfunding green energy projects on the Solana blockchain.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Link href="/">Go to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-emerald-200">
              <Link href="/discover">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
