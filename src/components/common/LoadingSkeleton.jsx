import { cn } from "@/lib/utils/cn";

/** Generic shimmer block. Compose it for cards, table rows, charts, etc. */
export default function LoadingSkeleton({ className }) {
  return <div aria-hidden="true" className={cn("skeleton h-4 w-full", className)} />;
}
