"use client";

import { useState, useTransition } from "react";
import { saveHotspotInfo } from "@/app/onboarding/actions";
import type { BusinessType } from "@/app/onboarding/actions";

type InitialHotspot = {
  hotspot_name: string | null;
  max_users: number | null;
  network_name: string | null;
  network_password: string | null;
  band: string | null;
  wifi_share_link: string | null;
} | null;

export default function HotspotStep({
  businessType,
  initialValues,
  onSaved,
  onBack,
}: {
  businessType: BusinessType;
  initialValues: InitialHotspot;
  onSaved: () => void;
  onBack: () => void;
}) {
  const [hotspotName, setHotspotName] = useState(initialValues?.hotspot_name ?? "");
  const [maxUsers, setMaxUsers] = useState(
    initialValues?.max_users ? String(initialValues.max_users) : ""
  );
  const [networkName, setNetworkName] = useState(initialValues?.network_name ?? "");
  const [networkPassword, setNetworkPassword] = useState(initialValues?.network_password ?? "");
  const [band, setBand] = useState(initialValues?.band ?? "");
  const [wifiShareLink, setWifiShareLink] = useState(initialValues?.wifi_share_link ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNext() {
    setError(null);

    const maxUsersNum = Number(maxUsers);
    if (!hotspotName.trim() || !maxUsers || maxUsersNum < 1) {
      setError("Please fill in the hotspot name and a valid maximum users number.");
      return;
    }

    if (businessType === "mobile_hotspot") {
      if (!networkName.trim() || !networkPassword.trim() || !band) {
        setError("Please fill in your network name, password, and band.");
        return;
      }
    } else {
      if (!wifiShareLink.trim()) {
        setError("Please paste your WiFi share link.");
        return;
      }
    }

    startTransition(async () => {
      const result = await saveHotspotInfo({
        hotspotName,
        maxUsers: maxUsersNum,
        networkName: businessType === "mobile_hotspot" ? networkName : undefined,
        networkPassword: businessType === "mobile_hotspot" ? networkPassword : undefined,
        band: businessType === "mobile_hotspot" ? band : undefined,
        wifiShareLink: businessType === "home_wifi" ? wifiShareLink : undefined,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Create Hotspot</h2>
      <p className="mt-1 text-slate-500">Set up your hotspot details</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Hotspot Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={hotspotName}
            onChange={(e) => setHotspotName(e.target.value)}
            placeholder="e.g. FastWiFi_Main"
            className={inputClass}
          />
          <p className="mt-1 text-sm text-slate-500">Get it from your hotspot settings</p>
        </div>

        <div>
          <label className={labelClass}>
            Maximum Users <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={maxUsers}
            onChange={(e) => setMaxUsers(e.target.value)}
            placeholder="e.g. 10"
            className={inputClass}
          />
        </div>

        {businessType === "mobile_hotspot" ? (
          <>
            <div>
              <label className={labelClass}>
                Network Name (SSID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                placeholder="From your phone's hotspot settings"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={networkPassword}
                onChange={(e) => setNetworkPassword(e.target.value)}
                placeholder="Your hotspot password"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Band <span className="text-red-500">*</span>
              </label>
              <select
                value={band}
                onChange={(e) => setBand(e.target.value)}
                className={inputClass + " text-slate-700"}
              >
                <option value="">Select band…</option>
                <option value="2.4GHz">2.4 GHz</option>
                <option value="5GHz">5 GHz</option>
                <option value="Dual Band">Dual Band (2.4 GHz + 5 GHz)</option>
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-2">
            <label className={labelClass}>
              WiFi Share Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={wifiShareLink}
              onChange={(e) => setWifiShareLink(e.target.value)}
              placeholder="Paste the link from your router or phone's WiFi share feature"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-400">
              Generate this from your WiFi settings — most phones and routers have a &quot;Share&quot;
              option that creates a link or QR code for the network.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <span className="mt-0.5">ℹ️</span>
        <p>Make sure your internet is enough to handle the number of users you set here.</p>
      </div>

      <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50"
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