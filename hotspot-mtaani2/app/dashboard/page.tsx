import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardView from "@/components/dashboard/dashboard-view";

export default async function DashboardPage() {
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
      "id, business_name, business_type, location, phone, is_online, is_active, hotspot_name, max_users, network_name, band, wifi_share_link"
    )
    .eq("owner_id", user.id)
    .maybeSingle();

  // Not set up yet, or hasn't paid the setup fee — send them back to onboarding
  if (!business || !business.is_active) {
    redirect("/onboarding");
  }

  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, duration_minutes, price_ksh")
    .eq("business_id", business.id)
    .order("created_at", { ascending: true });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardView
      business={business}
      packages={packages ?? []}
      userLabel={profile?.full_name || profile?.email || "U"}
    />
  );
}