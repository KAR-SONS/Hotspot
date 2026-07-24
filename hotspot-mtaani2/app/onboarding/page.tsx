import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SetupWizard from "@/components/onboarding/setup-wizard";

export default async function OnboardingPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: business } = await supabase
    .from("businesses")
    .select(
      "business_name, business_type, location, phone, is_active, hotspot_name, max_users, network_name, network_password, band, wifi_share_link"
    )
    .eq("owner_id", user.id)
    .maybeSingle();

  // Already paid and live? Send them straight to the dashboard.
  if (business?.is_active) {
    redirect("/dashboard");
  }

  return <SetupWizard initialBusiness={business ?? null} />;
}