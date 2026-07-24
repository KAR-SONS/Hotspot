import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SETUP_FEE_KES = 100;

export async function POST(request: Request) {
  const { reference } = await request.json();

  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id, is_active")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ error: "Complete business setup first." }, { status: 400 });
  }

  if (business.is_active) {
    return NextResponse.json({ success: true }); // already paid, nothing to do
  }

  // Never trust the client's word that a payment succeeded — verify
  // directly with Paystack using the secret key.
  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    cache: "no-store",
  });
  const verifyData = await verifyRes.json();

  const paidAmountKes = verifyData?.data?.amount ? verifyData.data.amount / 100 : 0;
  const isValid =
    verifyRes.ok &&
    verifyData?.status === true &&
    verifyData?.data?.status === "success" &&
    verifyData?.data?.currency === "KES" &&
    paidAmountKes === SETUP_FEE_KES;

  if (!isValid) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  // From here on, use the admin client — the anon-key RLS policies don't
  // allow clients to write to payments/businesses directly, on purpose.
  const admin = createAdminClient();

  const { error: paymentError } = await admin.from("payments").insert({
    business_id: business.id,
    purpose: "setup_fee",
    amount_ksh: SETUP_FEE_KES,
    paystack_reference: reference,
    status: "success",
    verified_at: new Date().toISOString(),
  });

  if (paymentError && !paymentError.message.toLowerCase().includes("duplicate")) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  await admin.from("businesses").update({ is_active: true }).eq("id", business.id);
  await admin.from("profiles").update({ onboarding_step: "done" }).eq("id", user.id);

  return NextResponse.json({ success: true });
}
