import { createClient } from '@supabase/supabase-js';

// Ambil variabel environment dari Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi sederhana agar tidak error saat runtime jika variabel lupa diisi
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL atau Anon Key tidak ditemukan. Pastikan sudah mengisi file .env'
  );
}

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
