import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

export interface ShopifyTaxonomyCategory {
  id: string;
  name: string;
  fullName: string;
  isArchived: boolean;
}

interface TaxonomyCategoriesQueryResponse {
  taxonomy: {
    categories: {
      nodes: ShopifyTaxonomyCategory[];
    };
  };
}

function normalizeCategoryName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function searchTaxonomyCategories(search: string) {
  const query = `
    query SearchTaxonomyCategories($search: String!, $first: Int!) {
      taxonomy {
        categories(search: $search, first: $first) {
          nodes {
            id
            name
            fullName
            isArchived
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<TaxonomyCategoriesQueryResponse>(query, {
    search,
    first: 10,
  });

  return data.taxonomy.categories.nodes;
}

export async function resolveTaxonomyCategoryId(categoryName: string) {
  const normalizedCategoryName = normalizeCategoryName(categoryName);
  const categories = await searchTaxonomyCategories(categoryName);
  const liveCategories = categories.filter((category) => !category.isArchived);

  const exactMatch =
    liveCategories.find((category) => normalizeCategoryName(category.name) === normalizedCategoryName) ??
    liveCategories.find((category) => normalizeCategoryName(category.fullName) === normalizedCategoryName) ??
    liveCategories.find((category) => normalizeCategoryName(category.fullName).endsWith(`> ${normalizedCategoryName}`));

  return exactMatch?.id ?? liveCategories[0]?.id ?? null;
}
