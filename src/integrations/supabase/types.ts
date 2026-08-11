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
      admin_launches: {
        Row: {
          color: string | null
          created_at: string
          id: string
          launch_date: string
          notes: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          launch_date: string
          notes?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          launch_date?: string
          notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          clicked_at: string
          id: string
          ip: string | null
          landing_path: string | null
          ref_code: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          ip?: string | null
          landing_path?: string | null
          ref_code: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          ip?: string | null
          landing_path?: string | null
          ref_code?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      ambassador_outreach: {
        Row: {
          created_at: string
          email: string | null
          follow_up_at: string | null
          handle: string
          id: string
          last_contact_at: string | null
          niche: string | null
          notes: string | null
          owner_id: string
          platform: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          follow_up_at?: string | null
          handle: string
          id?: string
          last_contact_at?: string | null
          niche?: string | null
          notes?: string | null
          owner_id: string
          platform?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          follow_up_at?: string | null
          handle?: string
          id?: string
          last_contact_at?: string | null
          niche?: string | null
          notes?: string | null
          owner_id?: string
          platform?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_secrets: {
        Row: {
          created_at: string
          key: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          value?: string
        }
        Relationships: []
      }
      audiobook_unlocks: {
        Row: {
          audio_url: string | null
          book_id: string
          created_at: string
          environment: string
          id: string
          paid_at: string | null
          provider_used: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          book_id: string
          created_at?: string
          environment?: string
          id?: string
          paid_at?: string | null
          provider_used?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          book_id?: string
          created_at?: string
          environment?: string
          id?: string
          paid_at?: string | null
          provider_used?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
      beta_promo_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          sent_at: string | null
          sent_to_email: string | null
          status: string
          used_at: string | null
          used_by_email: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string
          used_at?: string | null
          used_by_email?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          sent_at?: string | null
          sent_to_email?: string | null
          status?: string
          used_at?: string | null
          used_by_email?: string | null
        }
        Relationships: []
      }
      book_bibles: {
        Row: {
          characters: Json
          concept: string | null
          created_at: string
          engine: string
          id: string
          notes: string | null
          pedagogy: Json
          places: Json
          plot_threads: Json
          project_id: string
          promise: string | null
          structure: Json
          synopsis: string | null
          timeline: Json
          updated_at: string
          user_id: string
          validated_at: string | null
          version: number
        }
        Insert: {
          characters?: Json
          concept?: string | null
          created_at?: string
          engine?: string
          id?: string
          notes?: string | null
          pedagogy?: Json
          places?: Json
          plot_threads?: Json
          project_id: string
          promise?: string | null
          structure?: Json
          synopsis?: string | null
          timeline?: Json
          updated_at?: string
          user_id: string
          validated_at?: string | null
          version?: number
        }
        Update: {
          characters?: Json
          concept?: string | null
          created_at?: string
          engine?: string
          id?: string
          notes?: string | null
          pedagogy?: Json
          places?: Json
          plot_threads?: Json
          project_id?: string
          promise?: string | null
          structure?: Json
          synopsis?: string | null
          timeline?: Json
          updated_at?: string
          user_id?: string
          validated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_bibles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "book_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      book_chapter_versions: {
        Row: {
          chapter_id: string
          content: string
          created_at: string
          engine: string | null
          id: string
          kind: string
          project_id: string
          user_id: string
          version: number
          word_count: number
        }
        Insert: {
          chapter_id: string
          content?: string
          created_at?: string
          engine?: string | null
          id?: string
          kind?: string
          project_id: string
          user_id: string
          version?: number
          word_count?: number
        }
        Update: {
          chapter_id?: string
          content?: string
          created_at?: string
          engine?: string | null
          id?: string
          kind?: string
          project_id?: string
          user_id?: string
          version?: number
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_chapter_versions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_chapter_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "book_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      book_chapters: {
        Row: {
          created_at: string
          id: string
          objective: string | null
          planned_summary: string | null
          position: number
          project_id: string
          status: string
          subsections: Json
          title: string
          updated_at: string
          user_id: string
          word_count: number
          word_target: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          objective?: string | null
          planned_summary?: string | null
          position: number
          project_id: string
          status?: string
          subsections?: Json
          title?: string
          updated_at?: string
          user_id: string
          word_count?: number
          word_target?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          objective?: string | null
          planned_summary?: string | null
          position?: number
          project_id?: string
          status?: string
          subsections?: Json
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number
          word_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "book_chapters_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "book_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      book_memory: {
        Row: {
          chapter_id: string | null
          chapter_position: number | null
          characters_present: Json
          clues: Json
          created_at: string
          dates: Json
          decisions: Json
          events: Json
          id: string
          objects: Json
          open_questions: Json
          places: Json
          project_id: string
          relationship_changes: Json
          revealed_info: Json
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          chapter_position?: number | null
          characters_present?: Json
          clues?: Json
          created_at?: string
          dates?: Json
          decisions?: Json
          events?: Json
          id?: string
          objects?: Json
          open_questions?: Json
          places?: Json
          project_id: string
          relationship_changes?: Json
          revealed_info?: Json
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          chapter_position?: number | null
          characters_present?: Json
          clues?: Json
          created_at?: string
          dates?: Json
          decisions?: Json
          events?: Json
          id?: string
          objects?: Json
          open_questions?: Json
          places?: Json
          project_id?: string
          relationship_changes?: Json
          revealed_info?: Json
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_memory_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "book_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_memory_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "book_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      book_projects: {
        Row: {
          book_kind: string
          chapters_target: number
          constraints: string | null
          created_at: string
          era: string | null
          genre: string | null
          id: string
          language_level: string | null
          length_target: string | null
          main_characters: string | null
          mode: string
          narrative_pov: string | null
          objective: string | null
          places: string | null
          source_notes: string | null
          status: string
          subtitle: string | null
          target_audience: string | null
          title: string
          tone: string | null
          updated_at: string
          user_id: string
          with_images: boolean
          writing_style: string | null
        }
        Insert: {
          book_kind?: string
          chapters_target?: number
          constraints?: string | null
          created_at?: string
          era?: string | null
          genre?: string | null
          id?: string
          language_level?: string | null
          length_target?: string | null
          main_characters?: string | null
          mode?: string
          narrative_pov?: string | null
          objective?: string | null
          places?: string | null
          source_notes?: string | null
          status?: string
          subtitle?: string | null
          target_audience?: string | null
          title?: string
          tone?: string | null
          updated_at?: string
          user_id: string
          with_images?: boolean
          writing_style?: string | null
        }
        Update: {
          book_kind?: string
          chapters_target?: number
          constraints?: string | null
          created_at?: string
          era?: string | null
          genre?: string | null
          id?: string
          language_level?: string | null
          length_target?: string | null
          main_characters?: string | null
          mode?: string
          narrative_pov?: string | null
          objective?: string | null
          places?: string | null
          source_notes?: string | null
          status?: string
          subtitle?: string | null
          target_audience?: string | null
          title?: string
          tone?: string | null
          updated_at?: string
          user_id?: string
          with_images?: boolean
          writing_style?: string | null
        }
        Relationships: []
      }
      book_testimonials: {
        Row: {
          approved: boolean
          author_name: string
          book_title: string | null
          comment: string
          created_at: string
          email: string
          id: string
          photo_url: string | null
          rating: number | null
        }
        Insert: {
          approved?: boolean
          author_name: string
          book_title?: string | null
          comment: string
          created_at?: string
          email: string
          id?: string
          photo_url?: string | null
          rating?: number | null
        }
        Update: {
          approved?: boolean
          author_name?: string
          book_title?: string | null
          comment?: string
          created_at?: string
          email?: string
          id?: string
          photo_url?: string | null
          rating?: number | null
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
      capture_events: {
        Row: {
          ab_variant: string | null
          created_at: string
          event_type: string
          id: string
          lead_magnet: string | null
          page_path: string | null
          surface: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          ab_variant?: string | null
          created_at?: string
          event_type: string
          id?: string
          lead_magnet?: string | null
          page_path?: string | null
          surface: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          ab_variant?: string | null
          created_at?: string
          event_type?: string
          id?: string
          lead_magnet?: string | null
          page_path?: string | null
          surface?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
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
      crm_activities: {
        Row: {
          activity_type: string
          contact_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type?: string
          contact_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          contact_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_interaction_at: string | null
          last_name: string | null
          lifetime_value: number | null
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          tags: string[] | null
          temperature: string
          total_clicks: number | null
          total_emails_opened: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_interaction_at?: string | null
          last_name?: string | null
          lifetime_value?: number | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          temperature?: string
          total_clicks?: number | null
          total_emails_opened?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_interaction_at?: string | null
          last_name?: string | null
          lifetime_value?: number | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          tags?: string[] | null
          temperature?: string
          total_clicks?: number | null
          total_emails_opened?: number | null
          updated_at?: string
          user_id?: string
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
      email_clicks: {
        Row: {
          clicked_at: string
          clicked_url: string
          email_step: number | null
          id: string
          prospect_email: string
          template_name: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          clicked_url: string
          email_step?: number | null
          id?: string
          prospect_email: string
          template_name?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          clicked_url?: string
          email_step?: number | null
          id?: string
          prospect_email?: string
          template_name?: string | null
          user_agent?: string | null
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
          template_name: string | null
          user_agent: string | null
        }
        Insert: {
          email_step: number
          id?: string
          ip_address?: string | null
          opened_at?: string
          prospect_email: string
          template_name?: string | null
          user_agent?: string | null
        }
        Update: {
          email_step?: number
          id?: string
          ip_address?: string | null
          opened_at?: string
          prospect_email?: string
          template_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          last_event: string | null
          message_id: string | null
          recipient_email: string
          status: string
          template_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_event?: string | null
          message_id?: string | null
          recipient_email: string
          status?: string
          template_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_event?: string | null
          message_id?: string | null
          recipient_email?: string
          status?: string
          template_name?: string | null
          updated_at?: string
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
      error_logs: {
        Row: {
          alerted: boolean
          context: Json | null
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          severity: string
          url: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          alerted?: boolean
          context?: Json | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          severity?: string
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          alerted?: boolean
          context?: Json | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          severity?: string
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
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
          tags: string[]
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
          tags?: string[]
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
          tags?: string[]
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
      funnel_leads: {
        Row: {
          ab_variant: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          ip: string | null
          landing_url: string | null
          lead_magnet: string | null
          lead_magnet_sent_at: string | null
          ref_code: string | null
          sequence_started: boolean
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          ab_variant?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          ip?: string | null
          landing_url?: string | null
          lead_magnet?: string | null
          lead_magnet_sent_at?: string | null
          ref_code?: string | null
          sequence_started?: boolean
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          ab_variant?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          ip?: string | null
          landing_url?: string | null
          lead_magnet?: string | null
          lead_magnet_sent_at?: string | null
          ref_code?: string | null
          sequence_started?: boolean
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      funnel_orders: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          currency: string
          email: string
          first_name: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string
          product_key: string
          ref_code: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          currency?: string
          email: string
          first_name?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method: string
          product_key: string
          ref_code?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          currency?: string
          email?: string
          first_name?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string
          product_key?: string
          ref_code?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_entitlements: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          email: string
          environment: string
          id: string
          module: string
          status: string
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email: string
          environment?: string
          id?: string
          module: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          environment?: string
          id?: string
          module?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
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
      paypal_plan_cache: {
        Row: {
          amount: number
          created_at: string
          currency: string
          interval: string
          lookup_key: string
          paypal_plan_id: string
          paypal_product_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          interval: string
          lookup_key: string
          paypal_plan_id: string
          paypal_product_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          interval?: string
          lookup_key?: string
          paypal_plan_id?: string
          paypal_product_id?: string
        }
        Relationships: []
      }
      paypal_subscriptions: {
        Row: {
          amount: number
          cancelled_at: string | null
          created_at: string
          currency: string
          email: string
          id: string
          interval: string
          last_payment_at: string | null
          metadata: Json
          next_billing_at: string | null
          paypal_payer_id: string | null
          paypal_plan_id: string | null
          paypal_subscription_id: string | null
          plan_id: string
          plan_name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          email: string
          id?: string
          interval: string
          last_payment_at?: string | null
          metadata?: Json
          next_billing_at?: string | null
          paypal_payer_id?: string | null
          paypal_plan_id?: string | null
          paypal_subscription_id?: string | null
          plan_id: string
          plan_name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          email?: string
          id?: string
          interval?: string
          last_payment_at?: string | null
          metadata?: Json
          next_billing_at?: string | null
          paypal_payer_id?: string | null
          paypal_plan_id?: string | null
          paypal_subscription_id?: string | null
          plan_id?: string
          plan_name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
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
          commission_rate: number
          converted_at: string | null
          created_at: string
          funnel_order_id: string | null
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
          commission_rate?: number
          converted_at?: string | null
          created_at?: string
          funnel_order_id?: string | null
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
          commission_rate?: number
          converted_at?: string | null
          created_at?: string
          funnel_order_id?: string | null
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
          relance_round: number
          relance_sent_at: string | null
          relance_status: string | null
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
          relance_round?: number
          relance_sent_at?: string | null
          relance_status?: string | null
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
          relance_round?: number
          relance_sent_at?: string | null
          relance_status?: string | null
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
          license_type: string
          plan_tier: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subchapters_generated: number
          trial_ends_at: string | null
          updated_at: string
          user_id: string | null
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
          license_type?: string
          plan_tier?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subchapters_generated?: number
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string | null
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
          license_type?: string
          plan_tier?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subchapters_generated?: number
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string | null
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
      v3_gift_cards: {
        Row: {
          amount_paid: number
          buyer_email: string
          code: string
          created_at: string
          currency: string
          environment: string
          id: string
          plan: string
          recipient_email: string | null
          redeemed_at: string | null
          redeemed_by_email: string | null
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          amount_paid: number
          buyer_email: string
          code: string
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          plan?: string
          recipient_email?: string | null
          redeemed_at?: string | null
          redeemed_by_email?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount_paid?: number
          buyer_email?: string
          code?: string
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          plan?: string
          recipient_email?: string | null
          redeemed_at?: string | null
          redeemed_by_email?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      v3_installment_orders: {
        Row: {
          amount_total: number
          completed_at: string | null
          created_at: string
          currency: string
          email: string
          environment: string
          grace_until: string | null
          id: string
          installments_paid: number
          installments_total: number
          metadata: Json | null
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount_total: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          email: string
          environment?: string
          grace_until?: string | null
          id?: string
          installments_paid?: number
          installments_total?: number
          metadata?: Json | null
          plan: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_total?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          email?: string
          environment?: string
          grace_until?: string | null
          id?: string
          installments_paid?: number
          installments_total?: number
          metadata?: Json | null
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      v3_workflow_projects: {
        Row: {
          brief: Json
          created_at: string
          done: Json
          id: string
          name: string
          results: Json
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brief?: Json
          created_at?: string
          done?: Json
          id?: string
          name?: string
          results?: Json
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brief?: Json
          created_at?: string
          done?: Json
          id?: string
          name?: string
          results?: Json
          theme?: string
          updated_at?: string
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
      get_my_funnel_orders: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          currency: string
          email: string
          first_name: string
          id: string
          paid_at: string
          payment_method: string
          product_key: string
          ref_code: string
          status: string
          updated_at: string
        }[]
      }
      get_my_module_entitlements: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          currency: string
          email: string
          environment: string
          id: string
          module: string
          status: string
        }[]
      }
      get_my_v3_installment_orders: {
        Args: never
        Returns: {
          amount_total: number
          completed_at: string
          created_at: string
          currency: string
          email: string
          environment: string
          grace_until: string
          id: string
          installments_paid: number
          installments_total: number
          plan: string
          status: string
          updated_at: string
        }[]
      }
      get_referral_stats: { Args: { p_user_id: string }; Returns: Json }
      has_role: {
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
