import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

export async function updateInventoryTracking(input: {
  inventoryItemId: string;
  tracked: boolean;
}) {
  const mutation = `
    mutation InventoryItemUpdate($id: ID!, $input: InventoryItemInput!) {
      inventoryItemUpdate(id: $id, input: $input) {
        inventoryItem {
          id
          tracked
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    inventoryItemUpdate: {
      inventoryItem: {
        id: string;
        tracked: boolean;
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, {
    id: input.inventoryItemId,
    input: {
      tracked: input.tracked,
    },
  });

  const errorMessage = data.inventoryItemUpdate.userErrors.map((entry) => entry.message).join('; ');
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.inventoryItemUpdate.inventoryItem;
}

export async function activateInventoryAtLocation(input: {
  inventoryItemId: string;
  locationId: string;
  available: number;
}) {
  const mutation = `
    mutation ActivateInventoryItem($inventoryItemId: ID!, $locationId: ID!, $available: Int, $idempotencyKey: String!) {
      inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId, available: $available) @idempotent(key: $idempotencyKey) {
        inventoryLevel {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    inventoryActivate: {
      inventoryLevel: { id: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    inventoryItemId: input.inventoryItemId,
    locationId: input.locationId,
    available: input.available,
    idempotencyKey: crypto.randomUUID(),
  });

  const errorMessage = formatUserErrors(data.inventoryActivate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.inventoryActivate.inventoryLevel;
}

export async function setInventoryQuantity(input: {
  inventoryItemId: string;
  locationId: string;
  quantity: number;
}) {
  const mutation = `
    mutation SetInventoryQuantity($input: InventorySetQuantitiesInput!, $idempotencyKey: String!) {
      inventorySetQuantities(input: $input) @idempotent(key: $idempotencyKey) {
        inventoryAdjustmentGroup {
          createdAt
          reason
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    inventorySetQuantities: {
      inventoryAdjustmentGroup: {
        createdAt: string;
        reason: string;
      } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    idempotencyKey: crypto.randomUUID(),
    input: {
      name: 'available',
      reason: 'correction',
      referenceDocumentUri: `veritraa://inventory-sync/${input.inventoryItemId}/${input.locationId}`,
      quantities: [
        {
          changeFromQuantity: null,
          inventoryItemId: input.inventoryItemId,
          locationId: input.locationId,
          quantity: input.quantity,
        },
      ],
    },
  });

  const errorMessage = formatUserErrors(data.inventorySetQuantities.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.inventorySetQuantities.inventoryAdjustmentGroup;
}
