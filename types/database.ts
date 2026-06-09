export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_history: {
        Row: {
          created_at: string | null
          id: string
          message: string
          response: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          response: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          title: string
          user_id: string | null
          status: string | null
          summary: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
          status?: string | null
          summary?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
          status?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_records: {
        Row: {
          created_at: string | null
          id: string
          moisture: number | null
          nitrogen: number | null
          ph: number | null
          phosphorus: number | null
          potassium: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          moisture?: number | null
          nitrogen?: number | null
          ph?: number | null
          phosphorus?: number | null
          potassium?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_snapshots: {
        Row: {
          created_at: string | null
          id: string
          session_id: string | null
          user_id: string | null
          ph: number | null
          moisture: number | null
          nitrogen: number | null
          phosphorus: number | null
          potassium: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
          ph?: number | null
          moisture?: number | null
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string | null
          user_id?: string | null
          ph?: number | null
          moisture?: number | null
          nitrogen?: number | null
          phosphorus?: number | null
          potassium?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_snapshots_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soil_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          preferred_language: string | null
          region: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          preferred_language?: string | null
          region?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          preferred_language?: string | null
          region?: string | null
        }
        Relationships: []
      }
      market_snapshots: {
        Row: {
          id: string
          region: string
          grade: string | null
          price_per_kg: number | null
          trend: string | null
          recorded_date: string
          source: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          region?: string
          grade?: string | null
          price_per_kg?: number | null
          trend?: string | null
          recorded_date: string
          source?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          region?: string
          grade?: string | null
          price_per_kg?: number | null
          trend?: string | null
          recorded_date?: string
          source?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      market_predictions: {
        Row: {
          id: string
          user_id: string | null
          region: string | null
          prediction: Record<string, unknown>
          valid_until: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          region?: string | null
          prediction: Record<string, unknown>
          valid_until: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          region?: string | null
          prediction?: Record<string, unknown>
          valid_until?: string
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type User = Tables<"users">
export type SoilRecord = Tables<"soil_records">
export type SoilSnapshot = Tables<"soil_snapshots">
export type ChatHistory = Tables<"chat_history">
export type ChatSession = Tables<"chat_sessions">
export type ChatMessage = Tables<"chat_messages">

export interface SoilParams {
  ph: number
  moisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

// Agent context types
export interface AgentContext {
  currentSoil: SoilParams | null
  previousSoils: { params: SoilParams; date: string }[]
  sessionMessages: { role: string; content: string }[]
  previousSessions: { title: string; summary: string | null; date: string }[]
  userName: string
}

// Session list item for sidebar
export interface SessionListItem {
  id: string
  title: string
  summary: string | null
  created_at: string
  status: string | null
  soil_snapshot: SoilParams | null
}
