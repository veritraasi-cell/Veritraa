import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function CollectionsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Catalog"
      title="Collections"
      description="This route will manage manual and automated collections with product assignment, ordering, and SEO fields."
      stats={[
        { label: 'Primary job', value: 'Curate groups', note: 'Build collection pages and automate merchandising.' },
        { label: 'Source of truth', value: 'Shopify', note: 'Collections and assignment remain Shopify-managed.' },
        { label: 'Next step', value: 'Collection builder', note: 'Add manual and automated collection editors.' },
      ]}
    />
  );
}
