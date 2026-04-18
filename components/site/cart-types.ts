export type CartMoney = {
  amount: string;
  currencyCode: string;
};

export type CartVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: CartMoney;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: CartVariant & {
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText: string | null;
      } | null;
    };
  };
};

export type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: CartMoney;
    totalAmount: CartMoney;
  };
  lines: CartLine[];
};
