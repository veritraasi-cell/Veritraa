import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function ShippingAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Fulfillment"
      title="Shipping"
      description="Configure shipping zones, rates, and carrier settings for the Shopify-connected storefront."
      stats={[
        { label: 'Status', value: 'Planned', note: 'This section is being wired into Shopify shipping profiles.' },
        { label: 'Source', value: 'Shopify Admin', note: 'Shipping settings live inside Shopify until custom rules are added.' },
        { label: 'Next step', value: 'Profiles & rates', note: 'Expose zones, rates, and delivery promises here.' },
      ]}
    />
  );
}
