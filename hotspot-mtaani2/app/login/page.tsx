import Link from "next/link";
import GoogleAuthButton from "@/components/auth/google-auth-button";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-100 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </header>

      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center sm:px-0">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-7 w-7">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M5 12.859a9.5 9.5 0 0114 0M12 20h.01"
            />
          </svg>
        </span>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">Welcome to Hotspot Mtaani</h1>
        <p className="mt-2 text-slate-500">Join Hotspot Mtaani and start earning</p>

        <div className="mt-10 w-full border-slate-200">
          <GoogleAuthButton />
        </div>

        <div className="mt-8 flex w-full items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-left text-md text-blue-800">
          <span className="mt-0.5">ℹ️</span>
          <p >You&apos;ll set up your business details after signing in.</p>
        </div>

      </div>
    </main>
  );
}
