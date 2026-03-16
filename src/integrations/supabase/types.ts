export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          content_en: string
          content_ka: string
          content_ru: string
          cover_image_url: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_ka: string | null
          excerpt_ru: string | null
          id: string
          published: boolean
          published_at: string
          slug: string
          sort_order: number
          title_en: string
          title_ka: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          content_en?: string
          content_ka?: string
          content_ru?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_ka?: string | null
          excerpt_ru?: string | null
          id?: string
          published?: boolean
          published_at?: string
          slug: string
          sort_order?: number
          title_en: string
          title_ka: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          content_en?: string
          content_ka?: string
          content_ru?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_ka?: string | null
          excerpt_ru?: string | null
          id?: string
          published?: boolean
          published_at?: string
          slug?: string
          sort_order?: number
          title_en?: string
          title_ka?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadership_members: {
        Row: {
          created_at: string
          id: string
          linkedin: string | null
          name: string
          phone: string
          published: boolean
          role_key: string
          sort_order: number
          updated_at: string
          whatsapp_enabled: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          linkedin?: string | null
          name: string
          phone: string
          published?: boolean
          role_key: string
          sort_order?: number
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          linkedin?: string | null
          name?: string
          phone?: string
          published?: boolean
          role_key?: string
          sort_order?: number
          updated_at?: string
          whatsapp_enabled?: boolean
        }
        Relationships: []
      }
      pages: {
        Row: {
          content_en: string
          content_ka: string
          content_ru: string
          cover_image_url: string | null
          created_at: string
          excerpt_en: string | null
          excerpt_ka: string | null
          excerpt_ru: string | null
          id: string
          nav_label_en: string
          nav_label_ka: string
          nav_label_ru: string
          published: boolean
          show_in_navigation: boolean
          slug: string
          sort_order: number
          title_en: string
          title_ka: string
          title_ru: string
          updated_at: string
        }
        Insert: {
          content_en?: string
          content_ka?: string
          content_ru?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_ka?: string | null
          excerpt_ru?: string | null
          id?: string
          nav_label_en: string
          nav_label_ka: string
          nav_label_ru: string
          published?: boolean
          show_in_navigation?: boolean
          slug: string
          sort_order?: number
          title_en: string
          title_ka: string
          title_ru: string
          updated_at?: string
        }
        Update: {
          content_en?: string
          content_ka?: string
          content_ru?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt_en?: string | null
          excerpt_ka?: string | null
          excerpt_ru?: string | null
          id?: string
          nav_label_en?: string
          nav_label_ka?: string
          nav_label_ru?: string
          published?: boolean
          show_in_navigation?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_ka?: string
          title_ru?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description_en: string
          description_ka: string
          description_ru: string
          id: string
          logo_url: string | null
          name: string
          published: boolean
          routes_en: string
          routes_ka: string
          routes_ru: string
          sort_order: number
          updated_at: string
          website: string
        }
        Insert: {
          created_at?: string
          description_en: string
          description_ka: string
          description_ru: string
          id?: string
          logo_url?: string | null
          name: string
          published?: boolean
          routes_en: string
          routes_ka: string
          routes_ru: string
          sort_order?: number
          updated_at?: string
          website: string
        }
        Update: {
          created_at?: string
          description_en?: string
          description_ka?: string
          description_ru?: string
          id?: string
          logo_url?: string | null
          name?: string
          published?: boolean
          routes_en?: string
          routes_ka?: string
          routes_ru?: string
          sort_order?: number
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          city_en: string
          city_ka: string
          city_ru: string
          country_en: string | null
          country_ka: string | null
          country_ru: string | null
          created_at: string
          duration: string | null
          id: string
          price_from: string | null
          provider_links: Json
          published: boolean
          route_type: Database["public"]["Enums"]["route_type"]
          show_in_footer: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          city_en: string
          city_ka: string
          city_ru: string
          country_en?: string | null
          country_ka?: string | null
          country_ru?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          price_from?: string | null
          provider_links?: Json
          published?: boolean
          route_type: Database["public"]["Enums"]["route_type"]
          show_in_footer?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          city_en?: string
          city_ka?: string
          city_ru?: string
          country_en?: string | null
          country_ka?: string | null
          country_ru?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          price_from?: string | null
          provider_links?: Json
          published?: boolean
          route_type?: Database["public"]["Enums"]["route_type"]
          show_in_footer?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      schedule_overrides: {
        Row: {
          buy_ticket_url: string
          created_at: string
          departure_time: string
          destination_en: string
          destination_ka: string
          destination_ru: string
          id: string
          operator: string
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          buy_ticket_url: string
          created_at?: string
          departure_time: string
          destination_en: string
          destination_ka: string
          destination_ru: string
          id?: string
          operator: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          buy_ticket_url?: string
          created_at?: string
          departure_time?: string
          destination_en?: string
          destination_ka?: string
          destination_ru?: string
          id?: string
          operator?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      section_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          locale: Database["public"]["Enums"]["language_code"]
          published: boolean
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          locale: Database["public"]["Enums"]["language_code"]
          published?: boolean
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          locale?: Database["public"]["Enums"]["language_code"]
          published?: boolean
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      language_code: "en" | "ka" | "ru"
      route_type: "domestic" | "international"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
