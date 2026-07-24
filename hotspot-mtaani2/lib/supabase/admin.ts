import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key — this bypasses Row Level
// Security, so it must never be imported into a client component. It's
// used by the Paystack verification route to write payments/activate a
// business after independently confirming the transaction with Paystack.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
