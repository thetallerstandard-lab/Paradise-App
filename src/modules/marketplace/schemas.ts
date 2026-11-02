import { z } from "zod";

import { lngLatSchema } from "@/modules/network";

/** Upper bound on a single offer until the points ledger defines real limits. */
export const MAX_OFFER_POINTS = 1_000_000;

export const resourceRequestKindSchema = z.enum(["equipment_rental", "labor", "materials", "subcontracting"]);
export const exchangeOfferStatusSchema = z.enum(["pending", "accepted", "declined", "withdrawn"]);

export type ResourceRequestKind = z.infer<typeof resourceRequestKindSchema>;
export type ExchangeOfferStatus = z.infer<typeof exchangeOfferStatusSchema>;

const isoDate = z.iso.date();

export const resourceRequestInputSchema = z
  .object({
    kind: resourceRequestKindSchema,
    title: z.string().trim().min(4).max(140),
    description: z.string().trim().max(4000).default(""),
    tradeCategoryId: z.uuid().optional(),
    location: lngLatSchema.optional(),
    neededFrom: isoDate.optional(),
    neededUntil: isoDate.optional(),
    budgetPoints: z.number().int().min(0).max(MAX_OFFER_POINTS).optional(),
  })
  .refine((v) => !v.neededFrom || !v.neededUntil || v.neededUntil >= v.neededFrom, {
    message: "End date must be on or after the start date",
    path: ["neededUntil"],
  });

export const exchangeOfferInputSchema = z.object({
  requestId: z.uuid(),
  pointsAmount: z.number().int().positive().max(MAX_OFFER_POINTS),
  message: z.string().trim().max(2000).default(""),
});

export type ResourceRequestInput = z.infer<typeof resourceRequestInputSchema>;
export type ExchangeOfferInput = z.infer<typeof exchangeOfferInputSchema>;

/** Which side of an offer the acting user is on, and their role there. */
export type OfferActor =
  | { side: "offering" }
  | { side: "requesting"; role: "owner" | "admin" | "member" };

/**
 * Mirrors the enforce_exchange_offer_rules trigger. The database is the
 * authority; this exists so the UI only shows actions that will succeed.
 */
export function canTransitionOffer(from: ExchangeOfferStatus, to: ExchangeOfferStatus, actor: OfferActor): boolean {
  if (from !== "pending" || to === "pending") return false;
  if (to === "withdrawn") return actor.side === "offering";
  return actor.side === "requesting" && (actor.role === "owner" || actor.role === "admin");
}
