import { createServerClient } from "@/lib/supabase"

export async function getUserByWalletAddress(walletAddress: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null // User not found
    }
    throw error
  }

  return data
}

export async function createUser(walletAddress: string, username?: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("users")
    .insert({
      wallet_address: walletAddress,
      username: username || `user_${walletAddress.substring(0, 8)}`,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function getOrCreateUser(walletAddress: string) {
  let user = await getUserByWalletAddress(walletAddress)

  if (!user) {
    user = await createUser(walletAddress)
  }

  return user
}

export async function updateUserProfile(
  userId: string,
  updates: {
    username?: string
    email?: string
    avatar_url?: string
  },
) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) throw error

  return data
}
