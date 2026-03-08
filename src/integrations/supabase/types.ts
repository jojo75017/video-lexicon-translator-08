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
      audiobooks: {
        Row: {
          audio_url: string | null
          author_name: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          excerpt_url: string | null
          id: string
          is_public: boolean
          paypal_link: string | null
          play_count: number
          price: number | null
          slug: string | null
          status: string
          stripe_link: string | null
          title: string
          updated_at: string
          user_id: string
          voice_name: string | null
        }
        Insert: {
          audio_url?: string | null
          author_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          excerpt_url?: string | null
          id?: string
          is_public?: boolean
          paypal_link?: string | null
          play_count?: number
          price?: number | null
          slug?: string | null
          status?: string
          stripe_link?: string | null
          title: string
          updated_at?: string
          user_id: string
          voice_name?: string | null
        }
        Update: {
          audio_url?: string | null
          author_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          excerpt_url?: string | null
          id?: string
          is_public?: boolean
          paypal_link?: string | null
          play_count?: number
          price?: number | null
          slug?: string | null
          status?: string
          stripe_link?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          voice_name?: string | null
        }
        Relationships: []
      }
      book_tracking_history: {
        Row: {
          book_id: string
          bsr: number | null
          estimated_daily_sales: number | null
          estimated_monthly_revenue: number | null
          estimated_monthly_sales: number | null
          id: string
          rating: number | null
          reviews_count: number | null
          tracked_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          bsr?: number | null
          estimated_daily_sales?: number | null
          estimated_monthly_revenue?: number | null
          estimated_monthly_sales?: number | null
          id?: string
          rating?: number | null
          reviews_count?: number | null
          tracked_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          bsr?: number | null
          estimated_daily_sales?: number | null
          estimated_monthly_revenue?: number | null
          estimated_monthly_sales?: number | null
          id?: string
          rating?: number | null
          reviews_count?: number | null
          tracked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_tracking_history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "published_books"
            referencedColumns: ["id"]
          },
        ]
      }
      comic_books: {
        Row: {
          age_group: string | null
          art_style: string | null
          color_mode: string | null
          cover_url: string | null
          created_at: string
          genre: string | null
          id: string
          main_character: string | null
          number_of_pages: number | null
          pages: Json | null
          panel_layout: string | null
          scenario: Json | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
          visual_seed: string | null
        }
        Insert: {
          age_group?: string | null
          art_style?: string | null
          color_mode?: string | null
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          main_character?: string | null
          number_of_pages?: number | null
          pages?: Json | null
          panel_layout?: string | null
          scenario?: Json | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          visual_seed?: string | null
        }
        Update: {
          age_group?: string | null
          art_style?: string | null
          color_mode?: string | null
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          main_character?: string | null
          number_of_pages?: number | null
          pages?: Json | null
          panel_layout?: string | null
          scenario?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          visual_seed?: string | null
        }
        Relationships: []
      }
      ebook_project_versions: {
        Row: {
          author_name: string | null
          book_summary: string | null
          chapter_length: string | null
          chapters: Json | null
          characters: Json | null
          conclusion: string | null
          cover_concepts: string | null
          created_at: string
          detail_level: string | null
          ebook_images: Json | null
          id: string
          kdp_categories: string | null
          kdp_description: string | null
          kdp_keywords: string | null
          narrative_format: string | null
          number_of_chapters: number | null
          preface: string | null
          project_id: string
          seo_optimization: string | null
          target_audience: string | null
          title: string
          tome_number: number | null
          tone: string | null
          user_id: string
          version_number: number
          writing_style: string | null
        }
        Insert: {
          author_name?: string | null
          book_summary?: string | null
          chapter_length?: string | null
          chapters?: Json | null
          characters?: Json | null
          conclusion?: string | null
          cover_concepts?: string | null
          created_at?: string
          detail_level?: string | null
          ebook_images?: Json | null
          id?: string
          kdp_categories?: string | null
          kdp_description?: string | null
          kdp_keywords?: string | null
          narrative_format?: string | null
          number_of_chapters?: number | null
          preface?: string | null
          project_id: string
          seo_optimization?: string | null
          target_audience?: string | null
          title: string
          tome_number?: number | null
          tone?: string | null
          user_id: string
          version_number: number
          writing_style?: string | null
        }
        Update: {
          author_name?: string | null
          book_summary?: string | null
          chapter_length?: string | null
          chapters?: Json | null
          characters?: Json | null
          conclusion?: string | null
          cover_concepts?: string | null
          created_at?: string
          detail_level?: string | null
          ebook_images?: Json | null
          id?: string
          kdp_categories?: string | null
          kdp_description?: string | null
          kdp_keywords?: string | null
          narrative_format?: string | null
          number_of_chapters?: number | null
          preface?: string | null
          project_id?: string
          seo_optimization?: string | null
          target_audience?: string | null
          title?: string
          tome_number?: number | null
          tone?: string | null
          user_id?: string
          version_number?: number
          writing_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebook_project_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "ebook_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ebook_projects: {
        Row: {
          author_name: string | null
          book_summary: string | null
          chapter_length: string | null
          chapters: Json | null
          characters: Json | null
          conclusion: string | null
          cover_concepts: string | null
          created_at: string
          detail_level: string | null
          ebook_images: Json | null
          id: string
          kdp_categories: string | null
          kdp_description: string | null
          kdp_keywords: string | null
          narrative_format: string | null
          number_of_chapters: number | null
          preface: string | null
          project_type: string | null
          seo_optimization: string | null
          target_audience: string | null
          title: string
          tome_number: number | null
          tone: string | null
          updated_at: string
          user_id: string
          writing_style: string | null
        }
        Insert: {
          author_name?: string | null
          book_summary?: string | null
          chapter_length?: string | null
          chapters?: Json | null
          characters?: Json | null
          conclusion?: string | null
          cover_concepts?: string | null
          created_at?: string
          detail_level?: string | null
          ebook_images?: Json | null
          id?: string
          kdp_categories?: string | null
          kdp_description?: string | null
          kdp_keywords?: string | null
          narrative_format?: string | null
          number_of_chapters?: number | null
          preface?: string | null
          project_type?: string | null
          seo_optimization?: string | null
          target_audience?: string | null
          title: string
          tome_number?: number | null
          tone?: string | null
          updated_at?: string
          user_id: string
          writing_style?: string | null
        }
        Update: {
          author_name?: string | null
          book_summary?: string | null
          chapter_length?: string | null
          chapters?: Json | null
          characters?: Json | null
          conclusion?: string | null
          cover_concepts?: string | null
          created_at?: string
          detail_level?: string | null
          ebook_images?: Json | null
          id?: string
          kdp_categories?: string | null
          kdp_description?: string | null
          kdp_keywords?: string | null
          narrative_format?: string | null
          number_of_chapters?: number | null
          preface?: string | null
          project_type?: string | null
          seo_optimization?: string | null
          target_audience?: string | null
          title?: string
          tome_number?: number | null
          tone?: string | null
          updated_at?: string
          user_id?: string
          writing_style?: string | null
        }
        Relationships: []
      }
      email_opens: {
        Row: {
          email_step: number
          id: string
          ip_address: string | null
          opened_at: string
          prospect_email: string
          user_agent: string | null
        }
        Insert: {
          email_step: number
          id?: string
          ip_address?: string | null
          opened_at?: string
          prospect_email: string
          user_agent?: string | null
        }
        Update: {
          email_step?: number
          id?: string
          ip_address?: string | null
          opened_at?: string
          prospect_email?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      email_sequences: {
        Row: {
          completed: boolean
          created_at: string
          current_step: number
          email: string
          id: string
          last_email_sent_at: string | null
          next_email_at: string
          sequence_name: string
          subscribed_at: string
          unsubscribed: boolean
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_step?: number
          email: string
          id?: string
          last_email_sent_at?: string | null
          next_email_at?: string
          sequence_name?: string
          subscribed_at?: string
          unsubscribed?: boolean
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_step?: number
          email?: string
          id?: string
          last_email_sent_at?: string | null
          next_email_at?: string
          sequence_name?: string
          subscribed_at?: string
          unsubscribed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          emoji: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          post_id: string | null
          reply_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          post_id?: string | null
          reply_id?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          post_id?: string | null
          reply_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_notifications_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          category_id: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          likes_count: number
          post_type: string
          replies_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          post_type?: string
          replies_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          post_type?: string
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          likes_count: number
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_confirmations: {
        Row: {
          created_at: string
          email: string
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      published_books: {
        Row: {
          asin: string | null
          author_name: string | null
          category: string | null
          cover_url: string | null
          created_at: string
          id: string
          isbn: string | null
          keywords: string[] | null
          pages: number | null
          price: number | null
          publication_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asin?: string | null
          author_name?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          keywords?: string[] | null
          pages?: number | null
          price?: number | null
          publication_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asin?: string | null
          author_name?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          keywords?: string[] | null
          pages?: number | null
          price?: number | null
          publication_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number
          commission_paid: boolean
          converted_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          commission_amount?: number
          commission_paid?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          commission_amount?: number
          commission_paid?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      sales_prospects: {
        Row: {
          auto_send: boolean | null
          completed: boolean | null
          created_at: string | null
          current_step: number | null
          email: string
          first_name: string | null
          id: string
          imported_at: string | null
          last_email_sent_at: string | null
          next_email_at: string | null
          source: string | null
          status: string | null
          unsubscribed: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_send?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          email: string
          first_name?: string | null
          id?: string
          imported_at?: string | null
          last_email_sent_at?: string | null
          next_email_at?: string | null
          source?: string | null
          status?: string | null
          unsubscribed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_send?: boolean | null
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          email?: string
          first_name?: string | null
          id?: string
          imported_at?: string | null
          last_email_sent_at?: string | null
          next_email_at?: string | null
          source?: string | null
          status?: string | null
          unsubscribed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      series_bibles: {
        Row: {
          characters: Json | null
          created_at: string
          genre: string | null
          id: string
          locations: Json | null
          main_themes: Json | null
          narrative_style: string | null
          plot_threads: Json | null
          timeline: Json | null
          title: string
          tomes: Json | null
          total_tomes: number | null
          updated_at: string
          user_id: string
          world_rules: string | null
        }
        Insert: {
          characters?: Json | null
          created_at?: string
          genre?: string | null
          id?: string
          locations?: Json | null
          main_themes?: Json | null
          narrative_style?: string | null
          plot_threads?: Json | null
          timeline?: Json | null
          title: string
          tomes?: Json | null
          total_tomes?: number | null
          updated_at?: string
          user_id: string
          world_rules?: string | null
        }
        Update: {
          characters?: Json | null
          created_at?: string
          genre?: string | null
          id?: string
          locations?: Json | null
          main_themes?: Json | null
          narrative_style?: string | null
          plot_threads?: Json | null
          timeline?: Json | null
          title?: string
          tomes?: Json | null
          total_tomes?: number | null
          updated_at?: string
          user_id?: string
          world_rules?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          clicks_count: number | null
          comments_count: number | null
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          likes_count: number | null
          notes: string | null
          platform: string
          post_type: string
          scheduled_date: string | null
          scheduled_time: string | null
          shares_count: number | null
          status: string
          updated_at: string
          visual_description: string | null
        }
        Insert: {
          clicks_count?: number | null
          comments_count?: number | null
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          likes_count?: number | null
          notes?: string | null
          platform?: string
          post_type?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          shares_count?: number | null
          status?: string
          updated_at?: string
          visual_description?: string | null
        }
        Update: {
          clicks_count?: number | null
          comments_count?: number | null
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          likes_count?: number | null
          notes?: string | null
          platform?: string
          post_type?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          shares_count?: number | null
          status?: string
          updated_at?: string
          visual_description?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          access_code: string | null
          chapters_generated: number
          covers_generated: number
          created_at: string
          ebook_plans_generated: number
          email: string
          expires_at: string | null
          id: string
          plan_tier: string
          plan_type: string
          status: string
          subchapters_generated: number
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          chapters_generated?: number
          covers_generated?: number
          created_at?: string
          ebook_plans_generated?: number
          email: string
          expires_at?: string | null
          id?: string
          plan_tier?: string
          plan_type?: string
          status?: string
          subchapters_generated?: number
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          chapters_generated?: number
          covers_generated?: number
          created_at?: string
          ebook_plans_generated?: number
          email?: string
          expires_at?: string | null
          id?: string
          plan_tier?: string
          plan_type?: string
          status?: string
          subchapters_generated?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_results: {
        Row: {
          created_at: string
          display_content: string | null
          generated_at: string
          id: string
          project_title: string
          step_id: string
          step_result: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_content?: string | null
          generated_at?: string
          id?: string
          project_title: string
          step_id: string
          step_result?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_content?: string | null
          generated_at?: string
          id?: string
          project_title?: string
          step_id?: string
          step_result?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_vip: { Args: never; Returns: boolean }
      count_vip_subscribers: { Args: never; Returns: number }
      generate_referral_code: { Args: never; Returns: string }
      get_referral_stats: { Args: { p_user_id: string }; Returns: Json }
      has_role:
        | {
            Args: {
              _email: string
              _role: Database["public"]["Enums"]["app_role"]
            }
            Returns: boolean
          }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      vip_days_remaining: { Args: never; Returns: number }
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
