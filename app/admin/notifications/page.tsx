import AdminPlaceholderPage from '@/components/admin/AdminPlaceholderPage';

export default function NotificationsAdminPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Operations"
      title="Notifications"
      description="This route will manage admin and customer notifications, unread counts, and broadcast messages."
      stats={[
        { label: 'Primary job', value: 'Surface alerts', note: 'Track new orders, low stock, and review notifications.' },
        { label: 'Source of truth', value: 'Local DB', note: 'Notifications are custom application data.' },
        { label: 'Next step', value: 'Inbox + actions', note: 'Add read/unread states and notification actions.' },
      ]}
    />
  );
}
