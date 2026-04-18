export function Skeleton({ className }: Readonly<{ className?: string }>) {
  return <div className={["animate-pulse rounded-2xl bg-[#eedcc6]", className].filter(Boolean).join(' ')} />;
}
