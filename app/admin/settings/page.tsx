import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function SettingsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Configuration"
      title="Settings"
      description="This route will hold admin users, payments, email settings, shipping defaults, SEO, and checkout configuration."
      stats={[
        { label: 'Primary job', value: 'Configure the store', note: 'Manage system-wide admin and storefront settings.' },
        { label: 'Source of truth', value: 'Local DB + env', note: 'Sensitive credentials remain in environment variables.' },
        { label: 'Next step', value: 'Tabbed settings', note: 'Split settings into the PRD sub-sections.' },
      ]}
    />
  );
}
