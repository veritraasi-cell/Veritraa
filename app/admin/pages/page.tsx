import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function PagesAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="CMS"
      title="Pages"
      description="This route will manage static pages, metadata, and rich text content for the storefront CMS."
      stats={[
        { label: 'Primary job', value: 'Publish pages', note: 'Create and update informational content.' },
        { label: 'Source of truth', value: 'Local DB', note: 'CMS pages are stored and versioned locally.' },
        { label: 'Next step', value: 'Editor + SEO', note: 'Add block editor support and metadata fields.' },
      ]}
    />
  );
}
