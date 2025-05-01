"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function WalletMultiButton() {
  const { wallet, publicKey, connecting, connected, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setVisible(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setIsConnecting(false)
    }
  }

  // Redirect to profile page when connected
  useEffect(() => {
    if (connected && isConnecting) {
      setIsConnecting(false)
      router.push("/profile")
    }
  }, [connected, isConnecting, router])

  // If already connected, show disconnect button
  if (connected) {
    return (
      <Button
        onClick={() => disconnect()}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium"
      >
        Disconnect
      </Button>
    )
  }

  // Show wallet icon based on selected wallet
  const getWalletIcon = () => {
    if (!wallet) return <Image src="/phantom-logo.svg" alt="Wallet" width={24} height={24} className="mr-2" />

    if (wallet.adapter.name.toLowerCase().includes("phantom")) {
      return <Image src="/phantom-logo.svg" alt="Phantom" width={24} height={24} className="mr-2" />
    } else if (wallet.adapter.name.toLowerCase().includes("solflare")) {
      return <Image src="/solflare-logo.svg" alt="Solflare" width={24} height={24} className="mr-2" />
    }

    return <Image src="/phantom-logo.svg" alt="Wallet" width={24} height={24} className="mr-2" />
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting || isConnecting}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium"
    >
      {connecting || isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          {getWalletIcon()}
          Connect Wallet
        </>
      )}
    </Button>
  )
}
