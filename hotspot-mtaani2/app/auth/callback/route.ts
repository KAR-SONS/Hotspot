import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Has this user already finished onboarding + paid the setup fee?
      const { data: business } = await supabase
        .from("businesses")
        .select("is_active")
        .eq("owner_id", data.user.id)
        .maybeSingle();

      if (business?.is_active) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  // Something went wrong exchanging the code — send them back to try again
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
