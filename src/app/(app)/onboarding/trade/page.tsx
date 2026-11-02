import type { Metadata } from "next";

import { metersToMiles } from "@/modules/network";
import { listTradeCategories } from "@/modules/network/server";

import { guardStep } from "../state";
import { TradeForm } from "./trade-form";

export const metadata: Metadata = { title: "Your trade" };

export default async function TradeStepPage() {
  const [{ profile }, trades] = await Promise.all([guardStep("trade"), listTradeCategories()]);
  return (
    <>
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">What do you do?</h1>
        <p className="text-muted-foreground">Contractors nearby will find you by trade.</p>
      </header>
      <TradeForm
        trades={trades}
        initial={{
          primaryTradeId: profile?.primaryTradeId ?? "",
          tradeIds: profile?.tradeIds ?? [],
          serviceRadiusMiles: profile?.serviceRadiusMeters ? String(metersToMiles(profile.serviceRadiusMeters)) : "25",
        }}
      />
    </>
  );
}
