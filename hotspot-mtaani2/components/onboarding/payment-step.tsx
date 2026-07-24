"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

const SETUP_FEE_KES = 100;

export default function PaymentStep({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handlePay() {
    setError(null);

    if (!scriptReady || !window.PaystackPop) {
      setError("Payment is still loading — please try again in a second.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setError("You need to be signed in with an email to pay.");
      return;
    }

    setLoading(true);

    const reference = `hm_${user.id.slice(0, 8)}_${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: SETUP_FEE_KES * 100, // Paystack expects the amount in kobo/cents
      currency: "KES",
      ref: reference,
      channels: ["card", "mobile_money"], // M-Pesa shows under mobile_money for KES
      callback: (response: { reference: string }) => {
        verifyPayment(response.reference);
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  }

  async function verifyPayment(reference: string) {
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "We couldn't verify that payment. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong verifying your payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <Script src="https://js.paystack.co/v1/inline.js" onLoad={() => setScriptReady(true)} />

      <h2 className="text-2xl font-bold text-slate-900">Setup Payment</h2>
      <p className="mt-1 text-slate-500">Pay a one-time fee to activate your hotspot business</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-sm rounded-2xl border-2 border-brand-500 p-8 text-center">
        <p className="text-sm text-slate-500">Setup Cost</p>
        <p className="mt-2 text-5xl font-extrabold text-brand-500">KSH {SETUP_FEE_KES}</p>
        <p className="mt-2 text-sm text-slate-500">One-time payment · card or M-Pesa</p>
      </div>

      <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Processing…" : `Pay KSH ${SETUP_FEE_KES}`}
        </button>
      </div>
    </div>
  );
}
