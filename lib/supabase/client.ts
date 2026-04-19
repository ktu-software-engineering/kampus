// İstemci taraflı Supabase bağlantısı (Client Components için)
// NEXT_PUBLIC_ değişkenleri kullanır
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
