// Authoritative catalog and site content data used in production.
export type NavLink = {
  label: string;
  href: string;
};

export type CollectionItem = {
  title: string;
  description?: string;
  image: string;
  span: 'large' | 'small';
};

export type BenefitItem = {
  title: string;
  description: string;
  icon: string;
  accent: 'secondary' | 'primary' | 'tertiary';
};

export type FeaturedProduct = {
  name: string;
  price: string;
  image: string;
  reviews: string;
  badge?: string;
  rating: 4.5 | 5;
};

export type ShopProduct = {
  name: string;
  description: string;
  price: string;
  image: string;
  sizes: string[];
  tag?: {
    icon: string;
    label: string;
  };
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
  featured?: boolean;
};

export type ExportRegion = {
  icon: string;
  title: string;
  description: string;
};

export type BulkOption = {
  label: string;
  title: string;
  description: string;
  featured?: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type StoreLocation = {
  city: string;
  name: string;
  address: string;
  timings: string;
  contact: string;
};

export const navLinks: ReadonlyArray<NavLink> = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Exports', href: '/exports' },
];

export const homeCollections: ReadonlyArray<CollectionItem> = [
  {
    title: 'Spice Blends',
    description: 'Masterfully curated for authentic flavor.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVWi-mwqIcCVkHH_hMa3Be2ithZoExPKvrinXsLS8qMgNpqjaBqTX1_58sLv7uAGdBMOj5hsJo7MrWznzRl6rAwLHPvCfNcJZds9jfrGdqeFFsnntyanfaxk0n8tGYbT9khvv8BvwQVRDZgiV-qFqlukiLmA9HlVNpbM-KdsPEfoZyd_ggTwMoZVhDE-yO-l3r_Up99iNINYfVw_Xd-y9g_oUpqlviWIqFoJmrVhlI5IYbvduFfxkUDV_iRo_HQwJd1PfeMpDIdNU',
    span: 'large',
  },
  {
    title: 'Whole Spices',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzUYPD58FYawGf3fhJl8vCfVvkVegh6J5VLJ_CFvMuR_pJvUj8eXOM40sVE5pMb1SsYvlLA4CTNGN8T16O3NcQ8xx1Hoi2FEzUF_9YFvLDnQ3DNfTh4YeuD6rAj4ZR1VhudAKJUGrNyM421ZtsW674GFHdlNeIMFvCcBwes1BZ4oXnd6KZak__Zi0ZQsg-0Ds77OqlyJs0JM33wcTY29z19gHLIBVnGcvoXjiN_h7OcoLwdpqZAyMZwvxW32KukMkDW99QtJGjeNQ',
    span: 'small',
  },
  {
    title: 'Gift Boxes',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvkNoMPihXrnkXR6cZInvZGnmSouFUkygG2BuE5Qrq3vbC5LBTBUmTNJ6Fh8pr3yxj2QRdqFoF81eT9jSXyO5tW57Su6-WRmlrpi9ZJI1fdgKsOPP-hiqzSpAgiT_zeTVkFaIm3IWkzQILuiwevSvRlnmFnA4F3ryVgywZm1q6kV2X_h-N1UGsogdmGW_W4dS6_DmPqPnJaQvK3IKtLm3FDUWMgfvMPqO-nkYJ53IbUgt2mm6wKRAwB5VIB1Hx6wna4knK1VEP89o',
    span: 'small',
  },
];

export const homeBenefits: ReadonlyArray<BenefitItem> = [
  {
    title: 'Purity',
    description:
      "Zero fillers, zero artificial colors. Just the raw, potent essence of nature's finest harvests.",
    icon: 'verified',
    accent: 'secondary',
  },
  {
    title: 'Aroma',
    description:
      'Cold-processed grinding ensures that every volatile oil is preserved for a sensory explosion.',
    icon: 'air',
    accent: 'primary',
  },
  {
    title: 'Hand-picked',
    description:
      'Sourced directly from single-origin farms across the spice coast of India.',
    icon: 'eco',
    accent: 'tertiary',
  },
];

export const featuredProducts: ReadonlyArray<FeaturedProduct> = [
  {
    name: 'Kashmiri Red Chili',
    price: 'Rs. 450.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsH07k9Jz8fLmy_RUYod_NYAdUAGd5mXq53bC6RnhH68xiukosYHj8zdOOYZZ5jBvGLlFPg2aw2-ZRZCAUo_wTUZTZUr3E-4aagUUowEF83LCvPX23045ASme-sqj0Mx-2rlqF8bAx1RQP2TOnS-kIVl7O5Z5Ku50ntp-aic2Io6xogYxlrw7NKij8jEuj3iqg1Qs3Yprbb9_jXEsF0cKz3Hf3i3OAxPTOFBhoQscz-bWs0A6rTYSLC1c_5VMOu43NYJn1YLmeShc',
    reviews: '(124 reviews)',
    badge: 'Bestseller',
    rating: 5,
  },
  {
    name: 'Lakadong Turmeric',
    price: 'Rs. 380.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wNhtfRx-a4b_dUsgBo-r0XiGCAN4mV5NkZXx-UFBI0z9afkB2nqPCNg1EOoJVWP--bGKsQuHnRIAgWalUJhTVDyGidNbqEREzKv8HBIWepE2NWce75enIyJYvK3jlQOQBibsvKWKMJI1bIf2ZH8MQRz17VONlMBuQsuLsl2aaRKwqcu42VS8U2oI6ADc2dX8OkelN4QxXsumvo6tRIQCfuqQhRcJwUhulBc8EW9TPkrq3V-s-S3jrED8FYGELdXLEVW8Jqvkyj4',
    reviews: '(89 reviews)',
    rating: 5,
  },
  {
    name: "Grandfather's Garam Masala",
    price: 'Rs. 520.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSzEvW8Pws9wLZ1bJ4z8NWEgIA-H1S3oFhzDlKhUHu3GWjVDzAnzdY83SpnFrEibgPxZDpfri_S01A-HYzySjHwqeX7-6VzkRNonElUgbbWjsXArkUwshXX2FOwrbMIa9U9MXXNgPIuzIn2QY0cJ1LsIlImIy6vuCmDkZesWs5nObYw3Iqf5Fz4gEABKt7W_ij6oy-2lmJ1cabqZNrwdancK4HJGCD6yP64usQFyuUib3L6dpF1WF7GJcOR5Gwl909k5L1mVqVgmI',
    reviews: '(210 reviews)',
    rating: 4.5,
  },
  {
    name: 'Grade-A Saffron',
    price: 'Rs. 1,200.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAM4GAhoKOvsXxA6oHgvQoPgN3sgj5YrOGCrHjNeUktIIQ0ylwaocheG09KoNFUX-G68iv8bJrNuwPembYH7mTySAg_s9SxTm5bXujCqoUbEP5eNjVYpTGlrseF1z8ey6z9HMV-yaynEocVg27da0YlLlOn17xA7z0YR9oZoq4BSF5gpS-Uow_qekUk0vu9SHPEn_Qvr82P-AVSJsRpe6OzqSjg-JSM-Y2vdrqIOFq_HBJa36hhhvZHDBDpscqFsiLXU-NzYA8EDyk',
    reviews: '(56 reviews)',
    rating: 5,
  },
];

export const shopCategories: ReadonlyArray<string> = [
  'All Collections',
  'Traditional Masalas',
  'Kolhapuri Special',
  'Pure Powders',
  'Kitchen Essentials',
];

export const shopProducts: ReadonlyArray<ShopProduct> = [
  {
    name: 'Dry Red Chilli Powder (Kashmiri Lal)',
    description: 'Deep red color with balanced heat for rich gravies.',
    price: 'Rs. 700',
    image: '/masalas/6.Kashmirilal.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    tag: { icon: 'workspace_premium', label: 'Top Seller' },
  },
  {
    name: 'Dry Red Chilli Powder (Lai Tikhat)',
    description: 'Bold and fiery chilli powder for spicy regional recipes.',
    price: 'Rs. 600',
    image: '/masalas/4.Tikhalal.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Dry Red Chilli Powder (Tej)',
    description: 'Intense hot chilli profile for high-heat cooking.',
    price: 'Rs. 500',
    image: '/masalas/tej.jpeg',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Kanda Lasun Chutney',
    description: 'Authentic Maharashtrian garlic-onion chutney blend.',
    price: 'Rs. 600',
    image: '/masalas/3.Kanda_Lasun_chutney.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Turmeric Powder',
    description: 'Premium turmeric with bright color and earthy aroma.',
    price: 'Rs. 400',
    image: '/masalas/1.Turmeric_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Coriander Powder',
    description: 'Citrusy, warm coriander powder for daily cooking.',
    price: 'Rs. 300',
    image: '/masalas/10.Coriandor_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Cumin Powder',
    description: 'Robust cumin aroma with warm, nutty flavor.',
    price: 'Rs. 600',
    image: '/masalas/11.Cumin_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Shahi Garam Masala',
    description: 'Royal garam masala blend with layered whole-spice notes.',
    price: 'Rs. 700',
    image: '/masalas/2.Shahi_garam_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Sabji Masala',
    description: 'Everyday vegetable masala for homestyle curries.',
    price: 'Rs. 500',
    image: '/masalas/2.Shahi_garam_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Chicken Masala',
    description: 'Savory chicken masala blend with warming spices.',
    price: 'Rs. 700',
    image: '/masalas/7.Chiken_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Mutton Masala',
    description: 'Rich and robust spice blend for mutton gravies.',
    price: 'Rs. 800',
    image: '/masalas/8.Mutton_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Shahi Biryani Masala',
    description: 'Fragrant biryani blend for celebratory rice dishes.',
    price: 'Rs. 1,000',
    image: '/masalas/5.Shahi_Biryani_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Chaat Masala',
    description: 'Tangy and savory finishing masala for snacks and fruits.',
    price: 'Rs. 420',
    image: '/masalas/15.Chaat_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Shahi Paneer Masala',
    description: 'Creamy paneer curry masala with rich aromatic balance.',
    price: 'Rs. 600',
    image: '/masalas/shahi%20paneer%20masala.jpeg',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Fish Masala',
    description: 'Coastal-style fish masala with bright and spicy notes.',
    price: 'Rs. 540',
    image: '/masalas/14.Malvani_Fish_Fry_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Goda Masala',
    description: 'Classic Maharashtrian sweet-spiced goda masala.',
    price: 'Rs. 700',
    image: '/masalas/13.Goda_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Kala Masala',
    description: 'Dark roasted masala with smoky Kolhapuri depth.',
    price: 'Rs. 900',
    image: '/masalas/12.Kala_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
  {
    name: 'Misal / Usal Masala',
    description: 'Signature spicy blend for authentic misal and usal.',
    price: 'Rs. 1,000',
    image: '/masalas/9.Misal_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
  },
];

export const testimonials: ReadonlyArray<Testimonial> = [
  {
    quote:
      "The aroma when I opened the Garam Masala jar was like walking into my grandmother's kitchen. Exceptional quality.",
    name: 'Amrita Sharma',
    role: 'Food Blogger',
    initial: 'A',
  },
  {
    quote:
      "Finally found a brand that doesn't compromise on purity. Their Lakadong Turmeric is genuinely life-changing for my morning wellness ritual.",
    name: 'Rohan Mehta',
    role: 'Chef at Spicery',
    initial: 'R',
    featured: true,
  },
  {
    quote:
      "Beautiful packaging and even better contents. This was the perfect gift for my parents. They're loyal customers now!",
    name: 'Sarah Jenkins',
    role: 'Home Enthusiast',
    initial: 'S',
  },
];

export const exportRegions: ReadonlyArray<ExportRegion> = [
  {
    icon: 'public',
    title: 'North America',
    description:
      'Serving high-end culinary retailers and organic health stores across the United States and Canada with specialized FDA-compliant packaging.',
  },
  {
    icon: 'euro',
    title: 'Europe',
    description:
      'Distributed through London, Paris, and Berlin hubs. Adhering to strict EU organic certification standards for our boutique spice collections.',
  },
  {
    icon: 'account_balance',
    title: 'Middle East',
    description:
      'Supplying premium saffron and bespoke spice blends to luxury hospitality groups and gourmet distributors in Dubai and Riyadh.',
  },
];

export const bulkOptions: ReadonlyArray<BulkOption> = [
  {
    label: '5kg',
    title: 'Boutique Selection',
    description: 'Triple-layered vacuum sealed aluminum packs.',
    featured: true,
  },
  {
    label: '10kg',
    title: 'Culinary Reserve',
    description: 'Moisture-proof reinforced cartons.',
  },
  {
    label: '25kg',
    title: 'Industrial Wholesale',
    description: 'Heavy-duty food grade barrels with inner liners.',
  },
];

export const footerQuickLinks: ReadonlyArray<FooterLink> = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/shop' },
  { label: 'Exports', href: '/exports' },
];

export const footerHelpLinks: ReadonlyArray<FooterLink> = [
  { label: 'Shipping Policy', href: '#' },
  { label: 'Returns & Refunds', href: '#' },
  { label: 'Contact Us', href: '/exports#enquiry' },
  { label: 'FAQs', href: '#' },
];

export const footerLinktreeLinks: ReadonlyArray<FooterLink> = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Download Brochure', href: '/exports#brochure' },
  { label: 'Linktree', href: '#' },
];

export const storeLocations: ReadonlyArray<StoreLocation> = [
  {
    city: 'Mumbai',
    name: 'Veritraa Pantry at Kala Ghoda',
    address: '14 Ropewalk Lane, Kala Ghoda, Mumbai 400001',
    timings: 'Mon-Sat, 10:00 AM - 8:30 PM',
    contact: '+91 8983002683',
  },
  {
    city: 'Pune',
    name: 'The Spice Atelier',
    address: '22 Prabhat Road, Deccan Gymkhana, Pune 411004',
    timings: 'Daily, 11:00 AM - 9:00 PM',
    contact: '+91 8983002683',
  },
  {
    city: 'Bengaluru',
    name: 'Veritraa Experience Counter',
    address: '8 Lavelle Road, Ashok Nagar, Bengaluru 560001',
    timings: 'Mon-Sun, 11:00 AM - 8:00 PM',
    contact: '+91 8983002683',
  },
];


