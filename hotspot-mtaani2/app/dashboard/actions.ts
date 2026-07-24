"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleOnlineStatus(nextValue: boolean) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("businesses")
    .update({ is_online: nextValue })
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type PackageInput = {
  name: string;
  price: number;
  durationValue: number;
  durationUnit: "minutes" | "hours" | "days";
};

export async function createPackage(input: PackageInput) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  if (
    !input.name.trim() ||
    !input.durationValue ||
    input.durationValue <= 0 ||
    !input.price ||
    input.price <= 0
  ) {
    return { error: "Please fill in a valid name, duration, and price." };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return { error: "Complete business setup first." };
  }

  const multiplier = input.durationUnit === "days" ? 1440 : input.durationUnit === "hours" ? 60 : 1;

  const { data, error } = await supabase
    .from("packages")
    .insert({
      business_id: business.id,
      name: input.name.trim(),
      duration_minutes: input.durationValue * multiplier,
      price_ksh: input.price,
    })
    .select("id, name, duration_minutes, price_ksh")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, package: data };
}

export async function deletePackage(packageId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return { error: "Business not found." };
  }

  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", packageId)
    .eq("business_id", business.id); // extra guard so you can only delete your own

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}