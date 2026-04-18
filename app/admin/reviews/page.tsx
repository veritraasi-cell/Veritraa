import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function ReviewsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Moderation"
      title="Reviews"
      description="This route can moderate product reviews, handle responses, and flag abusive or pending content."
      stats={[
        { label: 'Primary job', value: 'Moderate reviews', note: 'Approve, reject, respond, or remove reviews.' },
        { label: 'Source of truth', value: 'Shop + site data', note: 'Reviews are handled outside Shopify core data.' },
        { label: 'Next step', value: 'Queue + detail', note: 'Add a review table and side panel.' },
      ]}
    />
  );
}
