"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function WalletMultiButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const handleConnect = async () => {
    setIsConnecting(true)

    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false)
      router.push("/profile")
    }, 1000)
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium"
    >
      <Image src="/phantom-logo.svg" alt="Phantom" width={24} height={24} className="mr-2" />
      {isConnecting ? "Connecting..." : "Connect with Phantom"}
    </Button>
  )
}
