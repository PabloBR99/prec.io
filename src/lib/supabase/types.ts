export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          nombre: string;
          imagen_url: string;
          precio: number;
          categoria: string;
          marca: string | null;
          cantidad: string | null;
          off_barcode: string | null;
          fecha_asignada: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at" | "updated_at" | "activo"
        > & {
          id?: string;
          activo?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      guesses: {
        Row: {
          id: string;
          product_id: string;
          fecha: string;
          guess: number;
          error_abs: number;
          error_pct: number;
          session_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["guesses"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guesses"]["Insert"]>;
      };
    };
  };
}
