export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          username: string | null;
          avatar_url: string | null;
          role: string | null;
          bio: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cover_image: string | null;
          is_featured: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cover_image?: string | null;
          is_featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cover_image?: string | null;
          is_featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      artworks: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          image_url: string;
          thumbnail_url: string | null;
          category_id: string | null;
          created_by: string | null;
          featured: boolean | null;
          tags: string[] | null;
          anime_series: string | null;
          price: number | null;
          status: string | null;
          views: number | null;
          likes_count: number | null;
          created_at: string | null;
          updated_at: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          image_url: string;
          thumbnail_url?: string | null;
          category_id?: string | null;
          created_by?: string | null;
          featured?: boolean | null;
          tags?: string[] | null;
          anime_series?: string | null;
          price?: number | null;
          status?: string | null;
          views?: number | null;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          image_url?: string;
          thumbnail_url?: string | null;
          category_id?: string | null;
          created_by?: string | null;
          featured?: boolean | null;
          tags?: string[] | null;
          anime_series?: string | null;
          price?: number | null;
          status?: string | null;
          views?: number | null;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          author_id: string | null;
          published: boolean | null;
          featured: boolean | null;
          meta_title: string | null;
          meta_description: string | null;
          views: number | null;
          created_at: string | null;
          updated_at: string | null;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          published?: boolean | null;
          featured?: boolean | null;
          meta_title?: string | null;
          meta_description?: string | null;
          views?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          author_id?: string | null;
          published?: boolean | null;
          featured?: boolean | null;
          meta_title?: string | null;
          meta_description?: string | null;
          views?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      blog_tags: {
        Row: {
          id: string;
          blog_id: string;
          tag: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          blog_id: string;
          tag: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          blog_id?: string;
          tag?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      artwork_likes: {
        Row: {
          id: string;
          user_id: string | null;
          artwork_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          artwork_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          artwork_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          artwork_id: string | null;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          artwork_id?: string | null;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          artwork_id?: string | null;
          content?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
