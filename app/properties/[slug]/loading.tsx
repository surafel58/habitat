import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 grid gap-3 md:h-[460px] md:grid-cols-[2fr_1fr]">
        <Skeleton className="h-72 rounded-2xl md:h-full" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:grid-rows-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 rounded-xl md:aspect-auto md:h-full" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </main>
  );
}
