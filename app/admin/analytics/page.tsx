import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function AnalyticsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Insights"
      title="Analytics"
      description="This route will surface revenue, orders, customer cohorts, and traffic views from local analytics and Shopify data."
      stats={[
        { label: 'Primary job', value: 'Understand performance', note: 'Track revenue, conversion, and customer trends.' },
        { label: 'Source of truth', value: 'Local DB', note: 'Custom reporting and snapshots live locally.' },
        { label: 'Next step', value: 'Charts + filters', note: 'Add date range selectors and chart components.' },
      ]}
    />
  );
}
