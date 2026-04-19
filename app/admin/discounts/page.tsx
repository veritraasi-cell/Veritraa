import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function DiscountsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Promotions"
      title="Discounts & promotions"
      description="This route will power custom discount rules, usage tracking, and validation tooling layered on top of Shopify."
      stats={[
        { label: 'Primary job', value: 'Run promotions', note: 'Create codes, schedules, and usage controls.' },
        { label: 'Source of truth', value: 'Local DB + Shopify', note: 'Custom rules live locally and can map to Shopify discounts.' },
        { label: 'Next step', value: 'Rules engine', note: 'Store promotion definitions and usage history.' },
      ]}
    />
  );
}
