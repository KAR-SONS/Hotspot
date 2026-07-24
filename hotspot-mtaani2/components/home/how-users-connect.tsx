"use client";

import { useState } from "react";

const steps = [
  { n: 1,  title: "Activation", desc: "Activate your hotspot in your dashboard by toggling the switch to 'ON'" },
  { n: 2,  title: "Users", desc: "Users see your wifi." },
  { n: 3,  title: "Payment", desc: "Users click on your wifi and pay for the package" },
  { n: 4,  title: "Access", desc: "Users connect to your wifi and access the internet for the selected time" },
];

export default function HowUsersConnect() {
  const [open, setOpen] = useState(false);

  return (
    <section id="how-users-connect" className="bg-slate-50 py-5">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mx-auto flex w-full items-center justify-center gap-3"
        >
          <h2 className="text-2xl font-bold text-slate-900">How Users Connect</h2>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`h-6 w-6 shrink-0 text-brand-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "mt-10 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {s.n}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
