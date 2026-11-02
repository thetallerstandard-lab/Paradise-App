import { z } from "zod";

/** WGS84 point. PostGIS stores (longitude, latitude); keep that order everywhere. */
export const lngLatSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

export type LngLat = z.infer<typeof lngLatSchema>;

/** Generous bounding box around Lancaster County, PA, the launch market. */
export const LANCASTER_COUNTY_BOUNDS = {
  west: -76.73,
  south: 39.71,
  east: -75.86,
  north: 40.32,
} as const;

export const LANCASTER_COUNTY_CENTER: LngLat = { lng: -76.3055, lat: 40.0379 };

export function isInLaunchMarket(point: LngLat): boolean {
  const b = LANCASTER_COUNTY_BOUNDS;
  return point.lng >= b.west && point.lng <= b.east && point.lat >= b.south && point.lat <= b.north;
}

export const contractorProfileInputSchema = z.object({
  headline: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(4000).optional(),
  yearsInBusiness: z.number().int().min(0).max(150).optional(),
  licenseNumber: z.string().trim().max(64).optional(),
  isInsured: z.boolean().default(false),
  mapPoint: lngLatSchema.optional(),
  tradeCategoryIds: z.array(z.uuid()).max(10).default([]),
});

export const serviceAreaInputSchema = z.discriminatedUnion("shape", [
  z.object({
    shape: z.literal("radius"),
    name: z.string().trim().min(1).max(120),
    center: lngLatSchema,
    radiusMeters: z.number().int().min(1).max(200_000),
  }),
  z.object({
    shape: z.literal("polygon"),
    name: z.string().trim().min(1).max(120),
    // GeoJSON MultiPolygon coordinates; validated further by PostGIS.
    coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])).min(4))).min(1),
  }),
]);

export type ContractorProfileInput = z.infer<typeof contractorProfileInputSchema>;
export type ServiceAreaInput = z.infer<typeof serviceAreaInputSchema>;
