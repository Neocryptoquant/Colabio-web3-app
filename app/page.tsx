import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletMultiButton } from "@/components/wallet-multi-button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/colabio-logo-light.png" alt="Colabio Logo" width={200} height={80} className="h-auto w-48" />
          </div>
          <p className="text-green-600 mt-1">Crowdfund natively on Solana</p>
        </div>

        <Card className="w-full shadow-lg border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Solana wallet to access crowdfunding projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <WalletMultiButton />

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">About Colabio</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              Colabio is a decentralized platform for crowdfunding projects on the Solana blockchain. Connect your
              wallet to start funding or creating initiatives.
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/discover">Browse Projects</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
