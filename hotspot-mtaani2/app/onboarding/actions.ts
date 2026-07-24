"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BusinessType = "mobile_hotspot" | "home_wifi";

export type BusinessInfoInput = {
  businessName: string;
  businessType: BusinessType;
  location: string;
  phone?: string;
};

export async function saveBusinessInfo(input: BusinessInfoInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (!input.businessName.trim() || !input.location.trim()) {
    return { error: "Business name and location are required." };
  }

  const { error } = await supabase.from("businesses").upsert(
    {
      owner_id: user.id,
      business_name: input.businessName.trim(),
      business_type: input.businessType,
      location: input.location.trim(),
      phone: input.phone?.trim() || null,
    },
    { onConflict: "owner_id" }
  );

  if (error) {
    return { error: error.message };
  }

  await supabase.from("profiles").update({ onboarding_step: "package" }).eq("id", user.id);

  revalidatePath("/onboarding");
  return { success: true };
}

export type HotspotInfoInput = {
  hotspotName: string;
  maxUsers: number;
  networkName?: string;
  networkPassword?: string;
  band?: string;
  wifiShareLink?: string;
};

export async function saveHotspotInfo(input: HotspotInfoInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (!input.hotspotName.trim() || !input.maxUsers || input.maxUsers < 1) {
    return { error: "Hotspot name and a valid maximum users number are required." };
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      hotspot_name: input.hotspotName.trim(),
      max_users: input.maxUsers,
      network_name: input.networkName?.trim() || null,
      network_password: input.networkPassword?.trim() || null,
      band: input.band || null,
      wifi_share_link: input.wifiShareLink?.trim() || null,
    })
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase.from("profiles").update({ onboarding_step: "payment" }).eq("id", user.id);

  revalidatePath("/onboarding");
  return { success: true };
}