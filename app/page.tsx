import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletMultiButton } from "@/components/wallet-multi-button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Image src="/colabio-logo.svg" alt="Colabio Logo" width={80} height={80} className="h-20 w-20" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-700">Colabio</h1>
          <p className="text-emerald-600 mt-1">Crowdfund on Solana</p>
        </div>

        <Card className="w-full shadow-lg border-emerald-100">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-emerald-800">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your Solana wallet to access green energy crowdfunding projects</CardDescription>
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
              Colabio is a decentralized platform for crowdfunding green energy projects on the Solana blockchain.
              Connect your wallet to start funding or creating sustainable energy initiatives.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
