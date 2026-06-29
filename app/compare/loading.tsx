import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-2 h-5 w-96 max-w-full" />
      <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
      <Skeleton className="mt-8 h-80 w-full rounded-2xl" />
    </main>
  );
}
