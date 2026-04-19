import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function BlogAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="CMS"
      title="Blog"
      description="This route will manage blog posts, categories, featured images, and publish scheduling."
      stats={[
        { label: 'Primary job', value: 'Manage content', note: 'Write posts that support SEO and brand storytelling.' },
        { label: 'Source of truth', value: 'Local DB', note: 'Blog content is authored and published from the admin.' },
        { label: 'Next step', value: 'Post editor', note: 'Add rich text content and featured image support.' },
      ]}
    />
  );
}
