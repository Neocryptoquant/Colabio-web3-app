"use client"

import { createClientComponentClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import type { Database } from "@/types/supabase"

export function useSupabase() {
  const supabase = createClientComponentClient()
  return { supabase }
}

export function useUser() {
  const { publicKey } = useWallet()
  const { supabase } = useSupabase()
  const [user, setUser] = useState<Database["public"]["Tables"]["users"]["Row"] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      if (!publicKey) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const walletAddress = publicKey.toString()

        // Try to fetch user from Supabase
        const { data, error } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setUser(data)
        } else {
          // User doesn't exist, create via API
          const response = await fetch("/api/auth/wallet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ walletAddress }),
          })

          if (!response.ok) {
            throw new Error("Failed to create user")
          }

          const { user: newUser } = await response.json()
          setUser(newUser)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [publicKey, supabase])

  return { user, loading }
}
