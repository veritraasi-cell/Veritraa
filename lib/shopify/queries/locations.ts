import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

export interface ShopifyLocation {
  id: string;
  name: string;
}

interface LocationsQueryResponse {
  locations: {
    nodes: ShopifyLocation[];
  };
}

export async function listLocations() {
  const query = `
    query LocationsQuery {
      locations(first: 25) {
        nodes {
          id
          name
        }
      }
    }
  `;

  const data = await shopifyGraphQL<LocationsQueryResponse>(query);
  return data.locations.nodes;
}
