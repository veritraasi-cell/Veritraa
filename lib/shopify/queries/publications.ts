import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

export interface ShopifyPublication {
  id: string;
  name: string;
}

interface PublicationsQueryResponse {
  publications: {
    nodes: ShopifyPublication[];
  };
}

export async function listPublications() {
  const query = `
    query PublicationsList {
      publications(first: 25) {
        nodes {
          id
          name
        }
      }
    }
  `;

  const data = await shopifyGraphQL<PublicationsQueryResponse>(query);
  return data.publications.nodes;
}
