import { bulkOptions, exportRegions } from '@/src/data/mockData';

export default function ExportsPage() {
  return (
    <div className="bg-surface pt-24 text-on-surface">
      <section className="relative overflow-hidden bg-surface px-8 py-20">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="z-10">
            <span className="mb-4 block font-label text-sm font-bold uppercase tracking-[0.2em] text-primary">
              International Presence
            </span>
            <h1 className="mb-8 font-headline text-5xl leading-[1.1] md:text-7xl">
              The Global Scent of Heritage
            </h1>
            <p className="mb-12 max-w-xl text-lg leading-relaxed text-on-surface-variant">
              Veritraa bridges the gap between ancient Indian spice traditions and the
              modern global apothecary. Our premium exports reach the most discerning
              kitchens and wellness boutiques worldwide.
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="block font-headline text-3xl text-primary">14+</span>
                <span className="font-label text-xs uppercase text-on-surface-variant">
                  Countries Served
                </span>
              </div>
              <div className="h-12 w-px bg-outline-variant/20" />
              <div>
                <span className="block font-headline text-3xl text-primary">320</span>
                <span className="font-label text-xs uppercase text-on-surface-variant">
                  Wholesale Partners
                </span>
              </div>
              <div className="h-12 w-px bg-outline-variant/20" />
              <div>
                <span className="block font-headline text-3xl text-primary">100%</span>
                <span className="font-label text-xs uppercase text-on-surface-variant">
                  Traceability
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl lg:h-[600px]">
            <img
              alt="Global distribution map"
              className="h-full w-full object-cover opacity-90 grayscale contrast-125"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2S37dTrlvNZWzrkUwGG085W9V1hAfeyH4cCMDGLZ2toFN2WqSQdgaox_xSqBNsg4YNQHrboV1UxmO8fI28rxkrR05TFO2fd6fKjEXg1mjsma-8C4lGVygCETD8KN2b4n07YFKycYj-w9gRfaC28nubSJgZJnCV6KRB7yzjVdr_Iw5HNWw69OBetMYpxRPM4Nlg4mTKLLKjB_vKjJA1RN0itxDdsSqwzFf_Yu_ts__RbpG4OU_kGNmxU1LEaLxdNqtrc7Q3CWVnuw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>

        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      </section>

      <section className="bg-surface-container-low px-8 py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {exportRegions.map((region) => (
              <div
                key={region.title}
                className="rounded-xl bg-surface p-10 transition-transform duration-500 hover:-translate-y-2"
              >
                <span className="material-symbols-outlined mb-6 text-4xl text-primary">
                  {region.icon}
                </span>
                <h3 className="mb-4 font-headline text-2xl">{region.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {region.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-8 py-24" id="bulk-orders">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="mb-6 font-headline text-4xl">
              Bulk Solutions for the Modern Artisan
            </h2>
            <p className="mb-10 text-on-surface-variant">
              We offer specialized bulk packaging designed to preserve the volatile oils
              and aromatic integrity of our spices during long-haul transit.
            </p>
            <div className="space-y-6">
              {bulkOptions.map((option) => (
                <div
                  key={option.label}
                  className={`flex items-center rounded-xl p-6 ${
                    option.featured
                      ? 'border-l-4 border-primary bg-surface-container-highest'
                      : 'bg-surface-container'
                  }`}
                >
                  <div
                    className={`mr-6 flex h-12 w-12 items-center justify-center rounded-full font-bold ${
                      option.featured
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-outline-variant text-on-surface'
                    }`}
                  >
                    {option.label}
                  </div>
                  <div>
                    <h4 className="font-bold">{option.title}</h4>
                    <p className="text-sm text-on-surface-variant">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-8 md:p-12 lg:col-span-7">
            <div className="relative z-10">
              <h3 className="mb-8 font-headline text-2xl text-primary">Wholesale Inquiry</h3>
              <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                    Company Name
                  </label>
                  <input
                    className="w-full rounded-lg border-none bg-surface p-4 focus:ring-2 focus:ring-primary/20"
                    placeholder="Artisan Foods Inc."
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                    Target Market
                  </label>
                  <select className="w-full rounded-lg border-none bg-surface p-4 focus:ring-2 focus:ring-primary/20">
                    <option>Select Region</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Middle East</option>
                    <option>Asia Pacific</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                    Product Interest
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary px-4 py-2 text-sm text-on-primary">
                      Whole Spices
                    </span>
                    <span className="rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm text-on-surface-variant hover:bg-primary-fixed">
                      Ground Blends
                    </span>
                    <span className="rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm text-on-surface-variant hover:bg-primary-fixed">
                      Essential Oils
                    </span>
                    <span className="rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm text-on-surface-variant hover:bg-primary-fixed">
                      Gift Tins
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                    Initial Quantity (approx)
                  </label>
                  <input
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant accent-primary"
                    type="range"
                  />
                  <div className="flex justify-between text-xs text-on-surface-variant">
                    <span>100kg</span>
                    <span>5000kg+</span>
                  </div>
                </div>
                <button className="spice-gradient mt-4 rounded-full py-4 text-sm font-bold uppercase tracking-widest text-on-primary md:col-span-2">
                  Request Quote
                </button>
              </form>
            </div>
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rotate-45 opacity-5">
              <img
                alt="Spice dust texture"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdruFlvRoa22BH-53SZa8i32sxCaZrq_JUI4u8HOVOhrW-DZvA8VDYKd4Am76X9yLUEJAX1kSGtcHkM8Dmx3hy11Z_YLiQdhxXUf-3Z8VwjguXEk3bO4zFclxA_GoeMzydnK0L3fpGAphgS7IgqVIYlyIirGPIF-ypgAktDwgTyP6GKWYsfYf7JqofOS2cuBvb0-h8l__pjCc1ZDZR_uuPD_2e3_WDw-p-gJxQZSZheVjsLARKQ9eVoI9-FYxyESmAZa7YPqvd40E"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-20" id="brochure">
        <div className="mx-auto max-w-screen-2xl overflow-hidden rounded-3xl bg-primary text-on-primary">
          <div className="grid grid-cols-1 items-center md:grid-cols-2">
            <div className="z-10 p-12 lg:p-20">
              <h2 className="mb-6 font-headline text-4xl lg:text-5xl">
                Our Full Export Catalog 2024
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-on-primary/80">
                Deep dive into our sourcing practices, chemical analysis reports, and the
                full variety of our heritage spices.
              </p>
              <button className="flex items-center gap-3 rounded-full bg-surface px-10 py-4 font-bold text-primary transition-colors hover:bg-surface-container-high">
                <span className="material-symbols-outlined">download</span>
                Download Brochure
              </button>
            </div>
            <div className="relative h-64 overflow-hidden md:h-full">
              <img
                alt="Premium export packaging"
                className="h-full w-full object-cover opacity-60 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIaDsz7RU8HK5D7EZd83epKDMBpJ2n-aQNc59OuyJTDZTqZ2FYtFI_8Ngf9ONZqmIAcjxmyRxBJ5JPZ0mdFKDGfSZL1jf8nfnyDe2SI-bqeep8V1Niwp8ERywAc52txCFovFPCSKcWo2fpofZpFtixigk9etIReSzfs5jzLp3gEjIYmSbAuQ28OCO0i11IpmRYXixl42dTeqrnrG5o-9xAmrux27DBuMno5xeC0ocmRrxyNbBP8ZsBINZUPVY8tJ1S8WhpmpDQcw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-8 py-24" id="enquiry">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 font-headline text-4xl">Start an International Partnership</h2>
          <p className="text-on-surface-variant">
            Our dedicated export desk handles all documentation, from Phytosanitary
            certificates to Certificate of Origin.
          </p>
        </div>
        <div className="mx-auto max-w-4xl rounded-2xl bg-surface p-12 shadow-sm">
          <form className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest opacity-60">
                Full Name
              </label>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4"
                placeholder="Alexander Graham"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest opacity-60">
                Email Address
              </label>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4"
                placeholder="veritraa.si@gmail.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest opacity-60">
                Phone Number
              </label>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4"
                placeholder="+91 8983002683"
                type="tel"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest opacity-60">
                Interested Products
              </label>
              <input
                className="w-full rounded-lg border-none bg-surface-container-low p-4"
                placeholder="Saffron, Cardamom, Cumin"
                type="text"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-label text-xs uppercase tracking-widest opacity-60">
                Message / Specific Requirements
              </label>
              <textarea
                className="w-full rounded-lg border-none bg-surface-container-low p-4"
                placeholder="Tell us about your sourcing needs..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-3 py-4 md:col-span-2">
              <input className="h-5 w-5 rounded text-primary focus:ring-primary" type="checkbox" />
              <span className="text-sm text-on-surface-variant">
                I agree to the privacy policy regarding international data handling.
              </span>
            </div>
            <button className="rounded-full bg-on-surface py-5 text-xs font-bold uppercase tracking-[0.2em] text-surface transition-colors hover:bg-primary md:col-span-2">
              Send Enquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
