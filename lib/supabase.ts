import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire application
export const createClientComponentClient = () => {
  // Use empty strings as fallbacks to prevent runtime errors
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""

  return createClient(supabaseUrl, supabaseServiceKey)
}
