export type CatalogVariantPricing = {
  label: string;
  price: string;
  quantity: number;
};

export type CatalogPricing = {
  basePrice: string;
  sizes: string[];
  variantDefinitions: CatalogVariantPricing[];
};

export const productPricingBySlug: Record<string, CatalogPricing> = {
  'dry-red-chilli-powder-kashmiri-lal': {
    basePrice: '700.00',
    sizes: ['1 KG', '500 GM', '250 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '700.00', quantity: 20 },
      { label: '500 GM', price: '350.00', quantity: 20 },
      { label: '250 GM', price: '185.00', quantity: 20 },
    ],
  },
  'dry-red-chilli-powder-lal-tikhat': {
    basePrice: '600.00',
    sizes: ['1 KG', '500 GM', '250 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '600.00', quantity: 20 },
      { label: '500 GM', price: '300.00', quantity: 20 },
      { label: '250 GM', price: '160.00', quantity: 20 },
    ],
  },
  'dry-red-chilli-powder-tej': {
    basePrice: '500.00',
    sizes: ['1 KG', '500 GM', '250 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '500.00', quantity: 20 },
      { label: '500 GM', price: '250.00', quantity: 20 },
      { label: '250 GM', price: '135.00', quantity: 20 },
    ],
  },
  'kanda-lasun-chutney': {
    basePrice: '600.00',
    sizes: ['1 KG', '500 GM', '250 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '600.00', quantity: 20 },
      { label: '500 GM', price: '340.00', quantity: 20 },
      { label: '250 GM', price: '160.00', quantity: 20 },
    ],
  },
  'turmeric-powder': {
    basePrice: '400.00',
    sizes: ['1 KG', '500 GM', '250 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '400.00', quantity: 20 },
      { label: '500 GM', price: '200.00', quantity: 20 },
      { label: '250 GM', price: '110.00', quantity: 20 },
    ],
  },
  'coriander-powder': {
    basePrice: '300.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '300.00', quantity: 20 },
      { label: '500 GM', price: '150.00', quantity: 20 },
      { label: '250 GM', price: '85.00', quantity: 20 },
      { label: '100 GM', price: '45.00', quantity: 20 },
    ],
  },
  'cumin-powder': {
    basePrice: '600.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '600.00', quantity: 20 },
      { label: '500 GM', price: '300.00', quantity: 20 },
      { label: '250 GM', price: '160.00', quantity: 20 },
      { label: '100 GM', price: '70.00', quantity: 20 },
    ],
  },
  'shahi-garam-masala': {
    basePrice: '700.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '700.00', quantity: 20 },
      { label: '500 GM', price: '350.00', quantity: 20 },
      { label: '250 GM', price: '185.00', quantity: 20 },
      { label: '100 GM', price: '80.00', quantity: 20 },
    ],
  },
  'sabji-masala': {
    basePrice: '500.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '500.00', quantity: 20 },
      { label: '500 GM', price: '250.00', quantity: 20 },
      { label: '250 GM', price: '135.00', quantity: 20 },
      { label: '100 GM', price: '60.00', quantity: 20 },
    ],
  },
  'chicken-masala': {
    basePrice: '700.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '700.00', quantity: 20 },
      { label: '500 GM', price: '350.00', quantity: 20 },
      { label: '250 GM', price: '185.00', quantity: 20 },
      { label: '100 GM', price: '80.00', quantity: 20 },
    ],
  },
  'mutton-masala': {
    basePrice: '800.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '800.00', quantity: 20 },
      { label: '500 GM', price: '400.00', quantity: 20 },
      { label: '250 GM', price: '210.00', quantity: 20 },
      { label: '100 GM', price: '90.00', quantity: 20 },
    ],
  },
  'shahi-biryani-masala': {
    basePrice: '1000.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '1000.00', quantity: 20 },
      { label: '500 GM', price: '500.00', quantity: 20 },
      { label: '250 GM', price: '260.00', quantity: 20 },
      { label: '100 GM', price: '110.00', quantity: 20 },
    ],
  },
  'chaat-masala': {
    basePrice: '420.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '420.00', quantity: 20 },
      { label: '500 GM', price: '210.00', quantity: 20 },
      { label: '250 GM', price: '115.00', quantity: 20 },
      { label: '100 GM', price: '52.00', quantity: 20 },
    ],
  },
  'shahi-paneer-masala': {
    basePrice: '600.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '600.00', quantity: 20 },
      { label: '500 GM', price: '300.00', quantity: 20 },
      { label: '250 GM', price: '160.00', quantity: 20 },
      { label: '100 GM', price: '70.00', quantity: 20 },
    ],
  },
  'fish-masala': {
    basePrice: '540.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '540.00', quantity: 20 },
      { label: '500 GM', price: '270.00', quantity: 20 },
      { label: '250 GM', price: '145.00', quantity: 20 },
      { label: '100 GM', price: '64.00', quantity: 20 },
    ],
  },
  'goda-masala': {
    basePrice: '700.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '700.00', quantity: 20 },
      { label: '500 GM', price: '350.00', quantity: 20 },
      { label: '250 GM', price: '185.00', quantity: 20 },
      { label: '100 GM', price: '80.00', quantity: 20 },
    ],
  },
  'kala-masala': {
    basePrice: '900.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '900.00', quantity: 20 },
      { label: '500 GM', price: '450.00', quantity: 20 },
      { label: '250 GM', price: '235.00', quantity: 20 },
      { label: '100 GM', price: '100.00', quantity: 20 },
    ],
  },
  'misal-usal-masala': {
    basePrice: '1000.00',
    sizes: ['1 KG', '500 GM', '250 GM', '100 GM'],
    variantDefinitions: [
      { label: '1 KG', price: '1000.00', quantity: 20 },
      { label: '500 GM', price: '500.00', quantity: 20 },
      { label: '250 GM', price: '260.00', quantity: 20 },
      { label: '100 GM', price: '110.00', quantity: 20 },
    ],
  },
};

export function applyCatalogPricing<T extends { slug: string; sizes: string[]; price?: string; variantDefinitions?: CatalogVariantPricing[] }>(product: T): T {
  const pricing = productPricingBySlug[product.slug];

  if (!pricing) {
    return product;
  }

  return {
    ...product,
    price: pricing.basePrice,
    sizes: [...pricing.sizes],
    variantDefinitions: pricing.variantDefinitions.map((variant) => ({ ...variant })),
  };
}