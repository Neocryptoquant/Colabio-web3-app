import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@/components/wallet-multi-button"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

export default function Home() {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-white ${roboto.className}`}>
      <div className="w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/colabio-logo.svg" alt="Colabio Logo" width={80} height={80} className="h-24 w-24" />
          </div>
          <h1 className="text-4xl font-medium text-gray-900 mb-2">Colabio</h1>
          <p className="text-lg text-emerald-600 font-light">Crowdfund natively on Solana</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Welcome</h2>
          <p className="text-gray-600 mb-8 font-light">
            A decentralized platform for crowdfunding green energy projects on the Solana blockchain.
          </p>

          <div className="space-y-5">
            <div className="w-full">
              <WalletMultiButton />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-medium">or</span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
            >
              <Link href="/discover">Browse Projects</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2023 Colabio. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
