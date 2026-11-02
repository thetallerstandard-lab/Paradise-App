"use client";

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ONBOARDING_STEPS } from "@/modules/network";

export function OnboardingProgress() {
  const pathname = usePathname();
  const current = Math.max(
    0,
    ONBOARDING_STEPS.findIndex((s) => pathname.startsWith(s.path)),
  );

  return (
    <nav aria-label="Setup progress">
      <p className="mb-3 text-sm font-medium text-brass">
        Step {current + 1} of {ONBOARDING_STEPS.length}
      </p>
      <ol className="grid grid-cols-3 gap-2">
        {ONBOARDING_STEPS.map((step, i) => {
          const state = i < current ? "done" : i === current ? "current" : "todo";
          return (
            <li key={step.key} aria-current={state === "current" ? "step" : undefined} className="flex flex-col gap-2">
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  state === "todo" ? "bg-muted" : "bg-primary",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  state === "current" ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="size-3.5" aria-label="Done" /> : null}
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
