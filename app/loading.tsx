import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-20">
      <Skeleton className="h-6 w-44 rounded-full" />
      <Skeleton className="h-16 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-12 w-full max-w-xl rounded-full" />
    </main>
  );
}
