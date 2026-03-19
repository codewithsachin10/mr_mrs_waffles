import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          price: number;
          description: string;
          badge: string | null;
          image_url: string | null;
          is_featured: boolean;
          is_available: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          price: number;
          description: string;
          badge?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          price?: number;
          description?: string;
          badge?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      add_ons: {
        Row: {
          id: string;
          name: string;
          price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          shop_name: string;
          tagline: string;
          phone: string;
          whatsapp_number: string;
          instagram: string;
          address: string;
          hero_text: string;
          announcement_text: string;
          pre_order_text: string;
        };
        Insert: {
          id?: string;
          shop_name: string;
          tagline: string;
          phone: string;
          whatsapp_number: string;
          instagram: string;
          address: string;
          hero_text: string;
          announcement_text: string;
          pre_order_text: string;
        };
        Update: {
          id?: string;
          shop_name?: string;
          tagline?: string;
          phone?: string;
          whatsapp_number?: string;
          instagram?: string;
          address?: string;
          hero_text?: string;
          announcement_text?: string;
          pre_order_text?: string;
        };
      };
    };
  };
};
