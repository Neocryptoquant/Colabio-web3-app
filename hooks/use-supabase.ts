"use client"

import { createClientComponentClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

export function useSupabase() {
  const supabase = createClientComponentClient()
  return { supabase }
}

export function useUser() {
  const { publicKey } = useWallet()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!publicKey) {
      setUser(null)
      setLoading(false)
      return
    }

    // Simulate user fetch
    setLoading(false)
    setUser({
      id: "123",
      wallet_address: publicKey.toString(),
      username: "User_" + publicKey.toString().substring(0, 4),
    })
  }, [publicKey])

  return { user, loading }
}
