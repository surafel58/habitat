import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-9 w-2/3" />
      <Skeleton className="mt-2 h-5 w-40" />
      <Skeleton className="mt-6 aspect-video w-full rounded-2xl" />
    </main>
  );
}
