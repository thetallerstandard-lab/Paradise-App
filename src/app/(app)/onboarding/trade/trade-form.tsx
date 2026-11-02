"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FieldError, FormAlert, SubmitButton } from "@/components/forms/form-parts";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SERVICE_RADIUS_MILES } from "@/modules/network";

import { onboardingTradeAction } from "../../actions";

type Trade = { id: string; name: string };

/** Pill-style option backed by a real radio/checkbox, so it works with keyboards and screen readers. */
function Choice({
  type,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
        checked ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

export function TradeForm({
  trades,
  initial,
}: {
  trades: Trade[];
  initial: { primaryTradeId: string; tradeIds: string[]; serviceRadiusMiles: string };
}) {
  const { state, onSubmit, isPending } = useFormAction(onboardingTradeAction);
  const [primary, setPrimary] = useState(initial.primaryTradeId);
  const [others, setOthers] = useState<string[]>(initial.tradeIds);
  const [radius, setRadius] = useState(initial.serviceRadiusMiles);
  const errors = state.fieldErrors;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormAlert error={state.error} />

      <Card>
        <CardContent className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-3" aria-describedby={errors?.primaryTradeId ? "primary-error" : undefined}>
            <legend className="mb-1 font-semibold">Your main trade</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {trades.map((t) => (
                <Choice
                  key={t.id}
                  type="radio"
                  name="primaryTradeId"
                  value={t.id}
                  checked={primary === t.id}
                  onChange={() => {
                    setPrimary(t.id);
                    setOthers((prev) => prev.filter((id) => id !== t.id));
                  }}
                >
                  {t.name}
                </Choice>
              ))}
            </div>
            <FieldError id="primary-error" messages={errors?.primaryTradeId} />
          </fieldset>

          {primary ? (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 font-semibold">
                Anything else you do? <span className="font-normal text-muted-foreground">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {trades
                  .filter((t) => t.id !== primary)
                  .map((t) => (
                    <Choice
                      key={t.id}
                      type="checkbox"
                      name="tradeIds"
                      value={t.id}
                      checked={others.includes(t.id)}
                      onChange={(checked) =>
                        setOthers((prev) => (checked ? [...prev, t.id] : prev.filter((id) => id !== t.id)))
                      }
                    >
                      {t.name}
                    </Choice>
                  ))}
              </div>
              <FieldError id="trades-error" messages={errors?.tradeIds} />
            </fieldset>
          ) : null}

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-semibold">How far will you travel for work?</legend>
            <div className="grid grid-cols-3 gap-2">
              {SERVICE_RADIUS_MILES.map((miles) => (
                <Choice
                  key={miles}
                  type="radio"
                  name="serviceRadiusMiles"
                  value={String(miles)}
                  checked={radius === String(miles)}
                  onChange={() => setRadius(String(miles))}
                >
                  {miles} miles
                </Choice>
              ))}
            </div>
            <FieldError id="radius-error" messages={errors?.serviceRadiusMiles} />
          </fieldset>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="ghost">
          <Link href="/onboarding/business">
            <ArrowLeft aria-hidden />
            Back
          </Link>
        </Button>
        <SubmitButton pending={isPending} pendingLabel="Saving…" size="lg">
          Next: preview
          <ArrowRight aria-hidden />
        </SubmitButton>
      </div>
    </form>
  );
}
