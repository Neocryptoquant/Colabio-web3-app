export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
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
        Insert: {
          id?: string
          creator_id: string
          title: string
          tagline: string
          description: string
          location?: string | null
          technology_type: string
          goal_amount: number
          raised_amount?: number
          duration_days: number
          start_date?: string
          end_date?: string | null
          status?: string
          risk_score?: number | null
          approve_votes?: number
          reject_votes?: number
          solana_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          tagline?: string
          description?: string
          location?: string | null
          technology_type?: string
          goal_amount?: number
          raised_amount?: number
          duration_days?: number
          start_date?: string
          end_date?: string | null
          status?: string
          risk_score?: number | null
          approve_votes?: number
          reject_votes?: number
          solana_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_media: {
        Row: {
          id: string
          project_id: string
          media_type: string
          url: string
          caption: string | null
          is_main: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          media_type: string
          url: string
          caption?: string | null
          is_main?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          media_type?: string
          url?: string
          caption?: string | null
          is_main?: boolean
          created_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string
          amount: number
          target_date: string | null
          status: string
          validations: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description: string
          amount: number
          target_date?: string | null
          status?: string
          validations?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string
          amount?: number
          target_date?: string | null
          status?: string
          validations?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          user_id: string | null
          project_id: string
          amount: number
          transaction_signature: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_id: string
          amount: number
          transaction_signature?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_id?: string
          amount?: number
          transaction_signature?: string | null
          created_at?: string
        }
      }
      validations: {
        Row: {
          id: string
          user_id: string | null
          milestone_id: string
          approved: boolean
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          milestone_id: string
          approved: boolean
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          milestone_id?: string
          approved?: boolean
          comment?: string | null
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string | null
          project_id: string
          approve: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_id: string
          approve: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_id?: string
          approve?: boolean
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string
          bio: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          role: string
          bio?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          role?: string
          bio?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
      project_documents: {
        Row: {
          id: string
          project_id: string
          document_type: string
          url: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          document_type: string
          url: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          document_type?: string
          url?: string
          name?: string
          created_at?: string
        }
      }
    }
  }
}
