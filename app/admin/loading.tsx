import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <Skeleton className="h-36 w-full rounded-[2rem]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-[1.5rem]" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Skeleton className="h-[30rem] rounded-[2rem]" />
          <Skeleton className="h-[30rem] rounded-[2rem]" />
        </div>
      </div>
    </section>
  );
}
