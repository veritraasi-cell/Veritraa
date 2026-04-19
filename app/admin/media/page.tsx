import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function MediaAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Assets"
      title="Media library"
      description="This route will provide image uploads, file browsing, metadata editing, and bulk delete tools."
      stats={[
        { label: 'Primary job', value: 'Manage assets', note: 'Upload and reuse media across products and content.' },
        { label: 'Source of truth', value: 'Vercel Blob / Cloudinary', note: 'The PRD allows either storage provider.' },
        { label: 'Next step', value: 'Uploader + grid', note: 'Add drag-and-drop file upload support.' },
      ]}
    />
  );
}
