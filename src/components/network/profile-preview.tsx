import { MapPin, Phone, ShieldCheck, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type ProfilePreviewData = {
  name: string;
  headline: string | null;
  baseTown: string | null;
  radiusMiles: number | null;
  trades: { name: string; isPrimary: boolean }[];
  yearsInBusiness: number | null;
  isInsured: boolean;
  phone: string | null;
};

/** Compact card showing a contractor the way other members will see them. */
export function ProfilePreview({ data }: { data: ProfilePreviewData }) {
  const primary = data.trades.find((t) => t.isPrimary);
  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
      <header className="flex flex-col gap-1">
        {primary ? <p className="text-xs font-semibold tracking-wide text-brass uppercase">{primary.name}</p> : null}
        <h2 className="font-serif text-2xl font-semibold">{data.name}</h2>
        {data.headline ? <p className="text-muted-foreground">{data.headline}</p> : null}
      </header>
      {data.trades.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Trades">
          {data.trades.map((t) => (
            <li key={t.name}>
              <Badge variant={t.isPrimary ? "default" : "outline"}>{t.name}</Badge>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="grid gap-2 text-sm">
        {data.baseTown ? (
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-brass" aria-hidden />
            {data.baseTown}
            {data.radiusMiles ? ` · works within ${data.radiusMiles} miles` : ""}
          </li>
        ) : null}
        {data.yearsInBusiness != null ? (
          <li className="flex items-center gap-2">
            <Timer className="size-4 text-brass" aria-hidden />
            {data.yearsInBusiness} {data.yearsInBusiness === 1 ? "year" : "years"} in business
          </li>
        ) : null}
        {data.isInsured ? (
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brass" aria-hidden />
            Insured
          </li>
        ) : null}
        {data.phone ? (
          <li className="flex items-center gap-2">
            <Phone className="size-4 text-brass" aria-hidden />
            {data.phone}
          </li>
        ) : null}
      </ul>
    </article>
  );
}
