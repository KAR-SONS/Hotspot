"use client";

import { useState, useTransition } from "react";
import { toggleOnlineStatus, signOut, deletePackage } from "@/app/dashboard/actions";
import PackageFormModal from "./package-form-modal";

type Business = {
  business_name: string;
  business_type: "mobile_hotspot" | "home_wifi";
  location: string;
  phone: string | null;
  is_online: boolean;
  hotspot_name: string | null;
  max_users: number | null;
  network_name: string | null;
  band: string | null;
  wifi_share_link: string | null;
};

type Package = {
  id: string;
  name: string;
  duration_minutes: number;
  price_ksh: number;
};

export default function DashboardView({
  business,
  packages: initialPackages,
  userLabel,
}: {
  business: Business;
  packages: Package[];
  userLabel: string;
}) {
  const [isOnline, setIsOnline] = useState(business.is_online);
  const [menuOpen, setMenuOpen] = useState(false);
  const [packages, setPackages] = useState(initialPackages);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !isOnline;
    setIsOnline(next); // optimistic UI

    startTransition(async () => {
      const result = await toggleOnlineStatus(next);
      if (result?.error) {
        setIsOnline(!next); // revert if the save failed
      }
    });
  }

  const initial = userLabel.trim().charAt(0).toUpperCase() || "U";

  async function handleDeletePackage(id: string) {
    const previous = packages;
    setPackages((prev) => prev.filter((p) => p.id !== id)); // optimistic
    const result = await deletePackage(id);
    if (result?.error) {
      setPackages(previous); // revert on failure
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <WifiIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-slate-900">{business.business_name}</p>
              <p className="text-xs text-slate-500">Hotspot Dashboard</p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                {initial}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
                <form action={signOut}>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Hotspot Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Hotspot Status</h1>
              <p className="mt-0.5 text-sm text-slate-500">Control your hotspot availability</p>
            </div>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                isOnline ? "bg-brand-50 text-brand-600" : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-brand-500" : "bg-slate-400"}`} />
              {isOnline ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={isOnline}
              onClick={handleToggle}
              disabled={isPending}
              className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:opacity-60 ${
                isOnline ? "bg-brand-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  isOnline ? "left-7" : "left-1"
                }`}
              />
            </button>
            <p className="text-sm text-slate-600">
              {isOnline
                ? "Your hotspot is currently active and accepting customers"
                : "Your hotspot is currently offline and hidden from customers"}
            </p>
          </div>
        </div>

        {/* Packages + Hotspot Info */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span aria-hidden>📦</span> Your Packages
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="whitespace-nowrap rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Add Package
              </button>
            </div>

            {packages.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
                No packages yet — click &quot;Add Package&quot; to create your first pricing plan.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{pkg.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="text-slate-300 transition hover:text-red-500"
                        aria-label={`Delete ${pkg.name}`}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 flex gap-6 text-sm">
                      <div>
                        <p className="text-slate-400">Price</p>
                        <p className="font-semibold text-brand-600">KSH {pkg.price_ksh}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Duration</p>
                        <p className="font-semibold text-slate-900">
                          {formatDuration(pkg.duration_minutes)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <WifiIcon className="h-5 w-5 text-brand-500" /> Hotspot Info
            </h2>

            <dl className="mt-4 divide-y divide-slate-100">
              <InfoRow label="Hotspot Name" value={business.hotspot_name ?? "—"} />
              <InfoRow
                label="Max Users"
                value={business.max_users ? `${business.max_users} concurrent users` : "—"}
              />
              <InfoRow label="Location" value={business.location} />
              {business.business_type === "mobile_hotspot" ? (
                <>
                  <InfoRow label="Network Name" value={business.network_name ?? "—"} />
                  <InfoRow label="Band" value={business.band ?? "—"} />
                </>
              ) : (
                <InfoRow label="WiFi Share Link" value={business.wifi_share_link ?? "—"} />
              )}
            </dl>
          </div>
        </div>
      </div>

      {modalOpen && (
        <PackageFormModal
          onClose={() => setModalOpen(false)}
          onCreated={(pkg) => {
            setPackages((prev) => [...prev, pkg]);
            setModalOpen(false);
          }}
        />
      )}
    </main>
  );
}

function formatDuration(minutes: number) {
  if (minutes % 1440 === 0) {
    const days = minutes / 1440;
    return `${days} day${days > 1 ? "s" : ""}`;
  }
  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} min`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className="mt-0.5 break-words font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function WifiIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01"
      />
    </svg>
  );
}