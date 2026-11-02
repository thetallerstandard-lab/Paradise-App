import * as React from "react";

import { cn } from "@/lib/utils";

/** Mobile-first page gutter: 16px on phones, widening on larger screens. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
