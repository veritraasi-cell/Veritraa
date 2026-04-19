import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function InventoryAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Operations"
      title="Inventory"
      description="This route will manage low-stock alerts, inventory levels, and bulk quantity updates across Shopify locations."
      stats={[
        { label: 'Primary job', value: 'Control stock', note: 'Update inventory levels and monitor low stock products.' },
        { label: 'Source of truth', value: 'Shopify', note: 'Inventory quantities and locations are Shopify-managed.' },
        { label: 'Next step', value: 'Low-stock board', note: 'Add low-stock filters and bulk update actions.' },
      ]}
    />
  );
}
