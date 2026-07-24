const reviews = [
  {
    name: "Felix Soi",
    message:
      "I set this up in one afternoon and started earning from my home WiFi the same week. The dashboard makes it so easy to manage.",
    image: "./Hotspot-page.png",
  },
  {
    name: "Lydia Murugi",
    message:
      "Simple to use and the M-Pesa payments just work. My hotspot business has grown a lot since I started using Hotspot Mtaani.",
    image: "",
  },
  {
    name: "John King'ori",
    message:
      "Setup was very quick and easy. Would recommend to anyone thinking of doing this in Kenya.",
    image: "",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">What Our Users Say</h2>
        <p className="mt-2 text-center text-slate-500">
          Real entrepreneurs earning with Hotspot Mtaani
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex text-brand-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
                  </svg>
                ))}
              </div>

              <p className="mt-4 text-sm text-slate-600">&ldquo;{r.message}&rdquo;</p>

              <div className="mt-5 flex flex-col items-center gap-3">
                {r.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-100 w-120 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-100 w-120 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                    {r.name.charAt(0)}
                  </span>
                )}
                <p className="font-semibold text-slate-900">{r.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}