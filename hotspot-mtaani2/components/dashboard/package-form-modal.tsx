"use client";

import { useState, useTransition } from "react";
import { createPackage } from "@/app/dashboard/actions";

type NewPackage = {
  id: string;
  name: string;
  duration_minutes: number;
  price_ksh: number;
};

export default function PackageFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (pkg: NewPackage) => void;
}) {
  const [name, setName] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<"minutes" | "hours" | "days">("hours");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);

    const priceNum = Number(price);
    const durationNum = Number(durationValue);

    if (!name.trim() || !durationNum || durationNum <= 0 || !priceNum || priceNum <= 0) {
      setError("Please fill in a valid name, duration, and price.");
      return;
    }

    startTransition(async () => {
      const result = await createPackage({
        name,
        price: priceNum,
        durationValue: durationNum,
        durationUnit,
      });

      if (result?.error || !result.package) {
        setError(result?.error ?? "Something went wrong.");
        return;
      }
      onCreated(result.package);
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Add Package</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>Package Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basic 1 hour package"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Duration</label>
              <input
                type="number"
                min={1}
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                placeholder="e.g. 1"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <select
                value={durationUnit}
                onChange={(e) => setDurationUnit(e.target.value as typeof durationUnit)}
                className={inputClass + " text-slate-700"}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Price (KSH)</label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 10"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Add Package"}
          </button>
        </div>
      </div>
    </div>
  );
}