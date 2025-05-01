export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          email: string | null
          avatar_url: string | null
          reputation: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          reputation?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          reputation?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          creator_id: string
          title: string
          tagline: string
          description: string
          location: string | null
          technology_type: string
          goal_amount: number
          raised_amount: number
          duration_days: number
          start_date: string
          end_date: string | null
          status: string
          risk_score: number | null
          approve_votes: number
          reject_votes: number
          solana_address: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
