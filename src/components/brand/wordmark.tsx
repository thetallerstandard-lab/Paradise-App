import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-serif text-xl font-semibold tracking-tight", className)}>
      <span aria-hidden className="inline-block size-2.5 rotate-45 bg-brass" />
      {BRAND.name}
    </span>
  );
}
