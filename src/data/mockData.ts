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
  slug: string;
  shopifyHandle?: string;
  name: string;
  description: string;
  image: string;
  sizes: string[];
  highlights: string[];
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

export const brochureDownloadHref = '/brochures/Veritraa-Brochure-1-Final.pdf';

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
    slug: 'dry-red-chilli-powder-kashmiri-lal',
    name: 'Dry Red Chilli Powder (Kashmiri Lal)',
    description: 'Naturally rich, vibrant authentic red color with smoky flavor.',
    image: '/masalas/6.Kashmirilal.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Bright color', 'Balanced heat', 'Rich gravies'],
    tag: { icon: 'workspace_premium', label: 'Top Seller' },
  },
  {
    slug: 'dry-red-chilli-powder-lal-tikhat',
    name: 'Dry Red Chilli Powder (Lal Tikhat)',
    description: 'Made from premium, high-heat red chillies for bold taste.',
    image: '/masalas/4.Tikhalal.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Strong, fiery spice', 'Curries and gravies', 'Bold taste'],
  },
  {
    slug: 'dry-red-chilli-powder-tej',
    name: 'Dry Red Chilli Powder (Tej)',
    description: 'Strong, fiery spice level with carefully roasted spice base.',
    image: '/masalas/tej.jpeg',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Sharp heat', 'Deep spice strength', 'Bold finish'],
  },
  {
    slug: 'kanda-lasun-chutney',
    name: 'Kanda Lasun Chutney',
    description: 'Traditional Maharashtrian recipe made with premium onions and garlic.',
    image: '/masalas/3.Kanda_Lasun_chutney.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Balanced spice', 'Garlic and onion', 'Traditional recipe'],
  },
  {
    slug: 'turmeric-powder',
    name: 'Turmeric Powder',
    description: 'Naturally strong curcumin profile, multi-region blended for quality.',
    image: '/masalas/1.Turmeric_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Lab-tested purity', 'No artificial colours', 'Freshness-sealed'],
  },
  {
    slug: 'coriander-powder',
    name: 'Coriander Powder',
    description: 'Fresh, earthy flavour stone-ground from sun-dried coriander seeds.',
    image: '/masalas/10.Coriandor_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Uniform texture', 'Clean-label processing', 'Consistent batch quality'],
  },
  {
    slug: 'cumin-powder',
    name: 'Cumin Powder',
    description: 'Strong natural aroma with precision-ground texture and freshness-sealed packing.',
    image: '/masalas/11.Cumin_Powder.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['No additives', 'Precision-ground', 'Freshness-sealed'],
  },
  {
    slug: 'shahi-garam-masala',
    name: 'Shahi Garam Masala',
    description: 'Refined whole-spice blend crafted to enhance curries, gravies, and festive dishes.',
    image: '/masalas/2.Shahi_garam_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Depth and warmth', 'Consistent flavor', 'Royal-style blend'],
  },
  {
    slug: 'sabji-masala',
    name: 'Sabji Masala',
    description: 'Premium blend ideal for all types of vegetable (subji) preparations.',
    image: '/masalas/2.Shahi_garam_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Dry and gravy dishes', 'Vegetable cooking', 'Balanced flavour'],
  },
  {
    slug: 'chicken-masala',
    name: 'Chicken Masala',
    description: 'Premium blend of carefully selected spices for chicken curries, gravies, and dry preparations.',
    image: '/masalas/7.Chiken_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Balanced flavour', 'Rich aroma', 'Warmth'],
  },
  {
    slug: 'mutton-masala',
    name: 'Mutton Masala',
    description: 'Specially crafted for mutton curries and gravies with rich, bold flavor.',
    image: '/masalas/8.Mutton_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Deep aroma', 'Slow cooking', 'Dhaba-style taste'],
  },
  {
    slug: 'shahi-biryani-masala',
    name: 'Shahi Biryani Masala',
    description: 'An aromatic blend designed to elevate biryani with balanced spice and fragrance.',
    image: '/masalas/5.Shahi_Biryani_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Layered aroma', 'Balanced spice', 'Authentic biryani'],
  },
  {
    slug: 'chaat-masala',
    name: 'Chaat Masala',
    description: 'Tangy, zesty, and slightly spicy flavour profile for snacks and fruits.',
    image: '/masalas/15.Chaat_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Chaats and salads', 'Slightly spicy', 'Refreshing kick'],
  },
  {
    slug: 'shahi-paneer-masala',
    name: 'Shahi Paneer Masala',
    description: 'Premium spice blend crafted for rich, royal-style paneer dishes and creamy gravies.',
    image: '/masalas/shahi%20paneer%20masala.jpeg',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Shahi Paneer', 'Paneer Butter Masala', 'Creamy gravies'],
  },
  {
    slug: 'fish-masala',
    name: 'Fish Masala',
    description: 'Authentic Malvani-style blend with carefully roasted coastal spices.',
    image: '/masalas/14.Malvani_Fish_Fry_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Balanced heat and aroma', 'No artificial additives', 'Coastal flavour'],
  },
  {
    slug: 'goda-masala',
    name: 'Goda Masala',
    description: 'Known for its mildly sweet, roasted character and aromatic warmth.',
    image: '/masalas/13.Goda_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Balanced sweetness', 'Roasted character', 'Aromatic warmth'],
  },
  {
    slug: 'kala-masala',
    name: 'Kala Masala',
    description: 'Known for its intense roasted profile and layered depth.',
    image: '/masalas/12.Kala_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Layered depth', 'Authentic character', 'Rich Maharashtrian flavour'],
  },
  {
    slug: 'misal-usal-masala',
    name: 'Misal / Usal Masala',
    description: 'Inspired by Kolhapur’s iconic flavours with sharp heat and deep spice strength.',
    image: '/masalas/9.Misal_Masala.png',
    sizes: ['100 GM', '250 GM', '500 GM', '1 KG'],
    highlights: ['Carefully roasted spice base', 'Balanced intensity', 'Signature misal flavour'],
  },
];

export function getShopProductBySlug(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

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


