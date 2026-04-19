import Loader from '@/components/ui/loader';

export default function AdminLoading() {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(248,240,228,0.96)] px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8">
      <Loader />
    </section>
  );
}
