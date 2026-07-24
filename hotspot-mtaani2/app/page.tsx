import Link from "next/link";
import HowItWorks from "@/components/home/how-it-works";
import HowUsersConnect from "@/components/home/how-users-connect";
import HotspotDetails from "@/components/home/hotspot-details";
import Testimonials from "@/components/home/testimonials";

const perks = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure & Reliable",
    desc: "Your business data is protected with industry-leading security.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8M21 7v6h-6" />
      </svg>
    ),
    title: "Grow Your Income",
    desc: "Flexible pricing and unlimited customer support to maximize earnings.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Easy to Manage",
    desc: "Simple dashboard to manage hotspots, packages, and customers.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-300 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight">Hotspot Mtaani</span>
          </div>
          <Link
            href="/signup"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Earn Money from Your Mobile Data Hotspot
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Turn your Mobile Data connection into a profitable business. Create packages, manage
              hotspots, and start earning today with Hotspot Mtaani.
            </p>
            <p className="mt-3 text-slate-500">Simple, secure, and designed for Kenyan market.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
              >
                Start Earning
              </Link>
              <a
                href="#how-it-works"
                className="rounded-lg border border-brand-500 px-6 py-3 font-semibold text-brand-600 transition hover:bg-brand-50"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-ink-900 p-10 text-center text-white shadow-xl">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="mx-auto mb-6 h-16 w-16 opacity-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01" />
            </svg>
            <p className="text-xl font-semibold">Your Data, Your Income</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks />
      <HowUsersConnect />
      <HotspotDetails />
      <Testimonials />

      {/* Why choose us */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-bold text-slate-900">Why Choose Hotspot Mtaani?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {perks.map((p) => (
              <div key={p.title} className="rounded-xl border border-slate-200 p-6">
                <div className="text-brand-500">{p.icon}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-bold text-slate-900">One-Time Setup Fee</h2>
          <p className="mt-2 text-slate-500">Start your WiFi business with just a small one-time payment</p>
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border-2 border-brand-500 bg-white p-8">
            <p className="text-sm text-slate-500">Setup Cost</p>
            <p className="mt-2 text-5xl font-extrabold text-brand-500">KSH 100</p>
            <p className="mt-2 text-sm text-slate-500">One-time payment to get started</p>
            <Link
              href="/signup"
              className="mt-6 block rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-600"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16 text-center text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-3xl font-bold">Ready to Start Your Hotspot Business?</h2>
          <p className="mt-2 text-brand-50">Join thousands of entrepreneurs earning with Hotspot Mtaani</p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Sign Up Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 py-12 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01" />
                </svg>
              </span>
              <span className="font-bold">Hotspot Mtaani</span>
            </div>
            <p className="mt-3 text-sm">Earn from your Mobile Data connection</p>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Hotspot Mtaani. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
