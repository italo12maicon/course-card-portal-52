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
      banners: {
        Row: {
          button_text: string
          created_at: string | null
          description: string
          id: number
          image: string
          is_active: boolean | null
          link: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text: string
          created_at?: string | null
          description: string
          id?: number
          image: string
          is_active?: boolean | null
          link: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string
          created_at?: string | null
          description?: string
          id?: number
          image?: string
          is_active?: boolean | null
          link?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: string
          id: number
          is_free: boolean | null
          is_locked: boolean | null
          progress: number | null
          rating: number | null
          students: number | null
          thumbnail: string
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: string
          id?: number
          is_free?: boolean | null
          is_locked?: boolean | null
          progress?: number | null
          rating?: number | null
          students?: number | null
          thumbnail: string
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          is_free?: boolean | null
          is_locked?: boolean | null
          progress?: number | null
          rating?: number | null
          students?: number | null
          thumbnail?: string
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: number
          is_completed: boolean | null
          order_index: number
          title: string
          topic_id: number | null
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: number
          is_completed?: boolean | null
          order_index: number
          title: string
          topic_id?: number | null
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          is_completed?: boolean | null
          order_index?: number
          title?: string
          topic_id?: number | null
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "user_topics_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      login_sessions: {
        Row: {
          id: number
          ip_address: unknown
          is_active: boolean | null
          login_time: string | null
          logout_time: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          ip_address: unknown
          is_active?: boolean | null
          login_time?: string | null
          logout_time?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          ip_address?: unknown
          is_active?: boolean | null
          login_time?: string | null
          logout_time?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          button_text: string | null
          button_url: string | null
          created_at: string | null
          has_button: boolean | null
          id: number
          is_active: boolean | null
          message: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          has_button?: boolean | null
          id?: number
          is_active?: boolean | null
          message: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          button_url?: string | null
          created_at?: string | null
          has_button?: boolean | null
          id?: number
          is_active?: boolean | null
          message?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          course_id: number | null
          created_at: string | null
          description: string
          id: number
          order_index: number
          progress: number | null
          thumbnail: string
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          description: string
          id?: number
          order_index: number
          progress?: number | null
          thumbnail: string
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          description?: string
          id?: number
          order_index?: number
          progress?: number | null
          thumbnail?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_courses_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: number
          is_completed: boolean | null
          lesson_id: number | null
          updated_at: string | null
          user_id: string | null
          watch_time: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          lesson_id?: number | null
          updated_at?: string | null
          user_id?: string | null
          watch_time?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          lesson_id?: number | null
          updated_at?: string | null
          user_id?: string | null
          watch_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accessible_courses: number[] | null
          created_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          is_admin: boolean | null
          last_login: string | null
          login_count: number | null
          name: string
          registration_date: string | null
          updated_at: string | null
        }
        Insert: {
          accessible_courses?: number[] | null
          created_at?: string | null
          email: string
          id: string
          ip_address?: unknown | null
          is_active?: boolean | null
          is_admin?: boolean | null
          last_login?: string | null
          login_count?: number | null
          name: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Update: {
          accessible_courses?: number[] | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          is_admin?: boolean | null
          last_login?: string | null
          login_count?: number | null
          name?: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_stats: {
        Row: {
          active_users: number | null
          logins_today: number | null
          new_users_today: number | null
          total_courses: number | null
          total_lessons: number | null
        }
        Relationships: []
      }
      user_courses_with_progress: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          has_access: boolean | null
          id: number | null
          is_free: boolean | null
          is_locked: boolean | null
          progress: number | null
          rating: number | null
          students: number | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
          user_progress: number | null
          video_url: string | null
        }
        Relationships: []
      }
      user_topics_with_progress: {
        Row: {
          course_id: number | null
          created_at: string | null
          description: string | null
          id: number | null
          order_index: number | null
          progress: number | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
          user_progress: number | null
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          order_index?: number | null
          progress?: number | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_progress?: never
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          order_index?: number | null
          progress?: number | null
          thumbnail?: string | null
          title?: string | null
          updated_at?: string | null
          user_progress?: never
        }
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_courses_with_progress"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_course_progress: {
        Args: { course_id_param: number }
        Returns: number
      }
      calculate_topic_progress: {
        Args: { topic_id_param: number }
        Returns: number
      }
      complete_lesson: {
        Args: { lesson_id_param: number }
        Returns: undefined
      }
      register_login: {
        Args: { user_ip: unknown; user_agent_string?: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
