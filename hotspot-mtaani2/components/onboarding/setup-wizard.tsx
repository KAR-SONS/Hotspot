"use client";

import { useState } from "react";
import BusinessInfoStep from "./business-info-step";
import HotspotStep from "./hotspot-step";
import PaymentStep from "./payment-step";
import type { BusinessType } from "@/app/onboarding/actions";

type InitialBusiness = {
  business_name: string;
  business_type: BusinessType;
  location: string;
  phone: string | null;
  hotspot_name: string | null;
  max_users: number | null;
  network_name: string | null;
  network_password: string | null;
  band: string | null;
  wifi_share_link: string | null;
} | null;

const STEPS = [1, 2, 3];

export default function SetupWizard({ initialBusiness }: { initialBusiness: InitialBusiness }) {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType | null>(
    initialBusiness?.business_type ?? null
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 bg-slate-50 px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01"
                />
              </svg>
            </span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Hotspot Mtaani Setup</h1>
              <p className="text-sm text-slate-500">Complete these steps to launch your business</p>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            {STEPS.map((n, i) => (
              <div key={n} className="flex items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                    n <= step ? "bg-brand-500 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {n < step ? "✓" : n}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-10 sm:w-16 transition ${
                      step > n ? "bg-brand-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {step === 1 && (
          <BusinessInfoStep
            initialValues={initialBusiness}
            onSaved={(savedType) => {
              setBusinessType(savedType);
              setStep(2);
            }}
          />
        )}
        {step === 2 && businessType && (
          <HotspotStep
            businessType={businessType}
            initialValues={initialBusiness}
            onSaved={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && <PaymentStep onBack={() => setStep(2)} />}
      </div>
    </main>
  );
}
