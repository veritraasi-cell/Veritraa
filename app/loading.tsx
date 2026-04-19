import Loader from '@/components/ui/loader';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(248,240,228,0.96)] px-4 py-10 backdrop-blur-sm sm:px-6 lg:px-8">
      <Loader />
    </div>
  );
}