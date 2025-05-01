import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire application
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side singleton
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const createClientComponentClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// Server-side client (for server components and API routes)
export const createServerClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}
