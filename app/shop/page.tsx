import ProductCard from '@/components/site/ProductCard';
import { shopCategories, shopProducts } from '@/src/data/mockData';

export default function ShopPage() {
  return (
    <div className="pb-16 pt-6 text-on-background sm:pb-20 sm:pt-8">
      <header className="mx-auto max-w-screen-2xl px-4 py-8 text-center sm:px-6 sm:py-10 md:px-8 md:py-14">
        <h1 className="mb-3 font-headline text-3xl tracking-tight sm:text-4xl md:mb-4 md:text-6xl">
          The Modern Apothecary
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-on-surface-variant opacity-80 sm:text-base md:text-lg">
          Heritage Indian spices, meticulously sourced and ground to perfection for the
          contemporary kitchen. Fragrant, vibrant, and pure.
        </p>
      </header>

      <section className="story-surface mx-2 mb-8 rounded-3xl sm:mx-4 sm:mb-10 md:mx-6 md:mb-12">
        <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 md:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3 sm:gap-4 sm:pb-4">
          {shopCategories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-label text-xs sm:px-6 sm:text-sm ${
                index === 0
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl py-6 sm:mx-4 sm:py-7 md:mx-6 md:py-8">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-3 px-4 min-[520px]:grid-cols-3 sm:gap-5 sm:px-6 md:px-8 lg:grid-cols-4 xl:grid-cols-5">
        {shopProducts.map((product) => (
          <ProductCard key={product.name} product={product} variant="shop" />
        ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-screen-2xl px-4 sm:mt-20 sm:px-6 md:mt-24 md:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-2xl bg-surface-container-low p-6 sm:gap-10 sm:p-8 md:flex-row md:items-center md:gap-12 md:p-16 lg:p-24">
          <div className="max-w-xl">
            <h2 className="mb-3 font-headline text-2xl tracking-tight sm:text-3xl md:mb-4 md:text-4xl">Join the Spice Circle</h2>
            <p className="mb-6 text-sm text-on-surface-variant opacity-80 sm:text-base md:mb-8">
              Receive monthly recipes from our master blenders and early access to our
              limited-run export collections.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                className="flex-1 rounded-md border-none bg-surface-container-high px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 sm:px-6 sm:text-base"
                placeholder="Email address"
                type="email"
              />
              <button className="spice-gradient rounded-full px-6 py-3 text-sm font-label font-semibold text-on-primary transition-transform hover:scale-105 sm:px-8 sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
          <div className="hidden h-72 w-72 overflow-hidden rounded-full md:block">
            <img
              alt="Colorful spice containers"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXcV_FQN2lUmshH7132dpXtvWJgYmrQ4AgnytqR_6nkCFJGX-N1qLC--SXt0dI6k0SOnEMBVyv9vE0RvmVEN1HPg5IS2XOFRf2xtiZSrxYaifvrx1tg1l_o4peDioKTxh2S4wCmmlrt-aTNU7UPYTpDLiLmSmpGTXLaESoloQbSfTlKJwKCMdxIRR0GD1ZdfCsHR51BHXMv-x7RVWbbBEkC6o_rJnTofCD9JoRjzK5YROts6xuP6lfXoCGMtOBd_GYQrRfP3pZmtY"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
