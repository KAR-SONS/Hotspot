"use client";

import { useState, useTransition } from "react";
import { saveBusinessInfo, type BusinessType } from "@/app/onboarding/actions";

type InitialBusiness = {
  business_name: string;
  business_type: BusinessType;
  location: string;
  phone: string | null;
} | null;

export default function BusinessInfoStep({
  initialValues,
  onSaved,
}: {
  initialValues: InitialBusiness;
  onSaved: (savedType: BusinessType) => void;
}) {
  const [businessName, setBusinessName] = useState(initialValues?.business_name ?? "");
  const [businessType, setBusinessType] = useState<BusinessType | "">(
    initialValues?.business_type ?? ""
  );
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNext() {
    setError(null);

    if (!businessName.trim() || !businessType || !location.trim()) {
      setError("Please fill in business name, type, and location.");
      return;
    }

    startTransition(async () => {
      const result = await saveBusinessInfo({
        businessName,
        businessType: businessType as BusinessType,
        location,
        phone: phone ?? "",
      });

      if (result?.error) {
        setError(result.error);
        return;
      }
      onSaved(businessType as BusinessType);
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>
      <p className="mt-1 text-slate-500">Tell us about your WiFi business</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Fast WiFi Express"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as BusinessType)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select type…</option>
            <option value="mobile_hotspot">Mobile Hotspot</option>
            <option value="home_wifi">Home WiFi</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Naivasha, Kenya"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={phone ?? ""}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-300"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Next →"}
        </button>
      </div>
    </div>
  );
}