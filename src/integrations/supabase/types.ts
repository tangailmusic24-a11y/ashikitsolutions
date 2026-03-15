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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      notices: {
        Row: {
          content_bn: string
          content_en: string
          created_at: string
          date: string
          id: string
          important: boolean | null
          title_bn: string
          title_en: string
          updated_at: string
        }
        Insert: {
          content_bn?: string
          content_en?: string
          created_at?: string
          date?: string
          id?: string
          important?: boolean | null
          title_bn: string
          title_en: string
          updated_at?: string
        }
        Update: {
          content_bn?: string
          content_en?: string
          created_at?: string
          date?: string
          id?: string
          important?: boolean | null
          title_bn?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          description_bn: string
          description_en: string
          features: string[] | null
          features_bn: string[] | null
          id: string
          name_bn: string
          name_en: string
          popular: boolean | null
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string
          description_en?: string
          features?: string[] | null
          features_bn?: string[] | null
          id?: string
          name_bn: string
          name_en: string
          popular?: boolean | null
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string
          description_en?: string
          features?: string[] | null
          features_bn?: string[] | null
          id?: string
          name_bn?: string
          name_en?: string
          popular?: boolean | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          cover_picture: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          mobile: string | null
          nid_back: string | null
          nid_front: string | null
          nid_number: string | null
          profile_picture: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          address?: string | null
          cover_picture?: string | null
          created_at?: string
          email: string
          full_name?: string
          id?: string
          mobile?: string | null
          nid_back?: string | null
          nid_front?: string | null
          nid_number?: string | null
          profile_picture?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          address?: string | null
          cover_picture?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mobile?: string | null
          nid_back?: string | null
          nid_front?: string | null
          nid_number?: string | null
          profile_picture?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string | null
          created_at: string
          description_bn: string
          description_en: string
          id: string
          image: string | null
          in_stock: boolean | null
          name_bn: string
          name_en: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_bn?: string
          description_en?: string
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name_bn: string
          name_en: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description_bn?: string
          description_en?: string
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name_bn?: string
          name_en?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value_bn: string
          value_en: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value_bn?: string
          value_en?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value_bn?: string
          value_en?: string
        }
        Relationships: []
      }
      social_services: {
        Row: {
          created_at: string
          description_bn: string
          description_en: string
          id: string
          max_quantity: number
          min_quantity: number
          name_bn: string
          name_en: string
          platform: string
          price: number
          service_type: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string
          description_en?: string
          id?: string
          max_quantity?: number
          min_quantity?: number
          name_bn: string
          name_en: string
          platform: string
          price?: number
          service_type: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string
          description_en?: string
          id?: string
          max_quantity?: number
          min_quantity?: number
          name_bn?: string
          name_en?: string
          platform?: string
          price?: number
          service_type?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          mobile: string
          package_id: string
          package_name: string
          status: string
          transaction_id: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          mobile?: string
          package_id?: string
          package_name?: string
          status?: string
          transaction_id?: string
          updated_at?: string
          user_id: string
          user_name?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          mobile?: string
          package_id?: string
          package_name?: string
          status?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_username_exists: { Args: { _username: string }; Returns: boolean }
      get_email_by_username: { Args: { _username: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
