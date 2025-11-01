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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crop_listings: {
        Row: {
          category: string
          created_at: string
          crop_name: string
          delivery_available: boolean | null
          district: string
          farm_name: string
          farmer_name: string
          harvest_date: string
          id: string
          image_urls: string[] | null
          is_organic: boolean | null
          price_per_unit: number
          quantity: number
          state: string
          status: string | null
          storage_type: string | null
          taluka: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          crop_name: string
          delivery_available?: boolean | null
          district: string
          farm_name: string
          farmer_name: string
          harvest_date: string
          id?: string
          image_urls?: string[] | null
          is_organic?: boolean | null
          price_per_unit: number
          quantity: number
          state: string
          status?: string | null
          storage_type?: string | null
          taluka?: string | null
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          crop_name?: string
          delivery_available?: boolean | null
          district?: string
          farm_name?: string
          farmer_name?: string
          harvest_date?: string
          id?: string
          image_urls?: string[] | null
          is_organic?: boolean | null
          price_per_unit?: number
          quantity?: number
          state?: string
          status?: string | null
          storage_type?: string | null
          taluka?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          application_link: string | null
          application_process: string
          application_process_mr: string
          benefits: Json
          benefits_mr: Json
          category: Database["public"]["Enums"]["scheme_category"]
          contact_info: Json | null
          created_at: string | null
          description: string
          description_mr: string
          districts: Json | null
          eligibility_criteria: Json
          eligibility_criteria_mr: Json
          end_date: string | null
          id: string
          is_active: boolean | null
          required_documents: Json
          required_documents_mr: Json
          scheme_name: string
          scheme_name_mr: string
          scheme_type: Database["public"]["Enums"]["scheme_type"]
          start_date: string | null
          state: string
          subcategory: string | null
          tags: string[]
          target_beneficiary: string[]
          updated_at: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          application_link?: string | null
          application_process: string
          application_process_mr: string
          benefits: Json
          benefits_mr: Json
          category: Database["public"]["Enums"]["scheme_category"]
          contact_info?: Json | null
          created_at?: string | null
          description: string
          description_mr: string
          districts?: Json | null
          eligibility_criteria: Json
          eligibility_criteria_mr: Json
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          required_documents: Json
          required_documents_mr: Json
          scheme_name: string
          scheme_name_mr: string
          scheme_type: Database["public"]["Enums"]["scheme_type"]
          start_date?: string | null
          state?: string
          subcategory?: string | null
          tags: string[]
          target_beneficiary: string[]
          updated_at?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          application_link?: string | null
          application_process?: string
          application_process_mr?: string
          benefits?: Json
          benefits_mr?: Json
          category?: Database["public"]["Enums"]["scheme_category"]
          contact_info?: Json | null
          created_at?: string | null
          description?: string
          description_mr?: string
          districts?: Json | null
          eligibility_criteria?: Json
          eligibility_criteria_mr?: Json
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          required_documents?: Json
          required_documents_mr?: Json
          scheme_name?: string
          scheme_name_mr?: string
          scheme_type?: Database["public"]["Enums"]["scheme_type"]
          start_date?: string | null
          state?: string
          subcategory?: string | null
          tags?: string[]
          target_beneficiary?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      scheme_recommendations: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          relevance_score: number
          scheme_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          relevance_score: number
          scheme_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          relevance_score?: number
          scheme_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_recommendations_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scheme_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          notes: string | null
          scheme_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          notes?: string | null
          scheme_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          notes?: string | null
          scheme_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scheme_interactions_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      interaction_type: "viewed" | "bookmarked" | "applied" | "inquired"
      scheme_category:
        | "crop_insurance"
        | "irrigation"
        | "machinery"
        | "financial_aid"
        | "soil_health"
        | "renewable_energy"
      scheme_type: "central" | "state" | "district"
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
      interaction_type: ["viewed", "bookmarked", "applied", "inquired"],
      scheme_category: [
        "crop_insurance",
        "irrigation",
        "machinery",
        "financial_aid",
        "soil_health",
        "renewable_energy",
      ],
      scheme_type: ["central", "state", "district"],
    },
  },
} as const
