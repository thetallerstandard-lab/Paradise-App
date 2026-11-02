import type { LngLat } from "@/modules/network/schemas";

/**
 * Towns used as deliberately approximate map points for contractor profiles.
 * Coordinates are rounded town centres — never a contractor's address.
 */
export const LANCASTER_TOWNS: ReadonlyArray<{ name: string } & LngLat> = [
  { name: "Akron", lng: -76.2022, lat: 40.1568 },
  { name: "Christiana", lng: -75.9969, lat: 39.9548 },
  { name: "Columbia", lng: -76.5044, lat: 40.0337 },
  { name: "Denver", lng: -76.1372, lat: 40.2334 },
  { name: "Elizabethtown", lng: -76.6027, lat: 40.1529 },
  { name: "Ephrata", lng: -76.1788, lat: 40.1798 },
  { name: "Intercourse", lng: -76.106, lat: 40.0376 },
  { name: "Lancaster", lng: -76.3055, lat: 40.0379 },
  { name: "Landisville", lng: -76.4119, lat: 40.0954 },
  { name: "Leola", lng: -76.1852, lat: 40.0876 },
  { name: "Lititz", lng: -76.3069, lat: 40.1573 },
  { name: "Manheim", lng: -76.3952, lat: 40.1634 },
  { name: "Marietta", lng: -76.5524, lat: 40.057 },
  { name: "Millersville", lng: -76.3541, lat: 39.9979 },
  { name: "Mount Joy", lng: -76.5033, lat: 40.1101 },
  { name: "Mountville", lng: -76.4308, lat: 40.0393 },
  { name: "New Holland", lng: -76.0852, lat: 40.1018 },
  { name: "Quarryville", lng: -76.1636, lat: 39.8968 },
  { name: "Strasburg", lng: -76.1841, lat: 39.9832 },
  { name: "Willow Street", lng: -76.2755, lat: 39.9787 },
];

export function findTown(name: string | null | undefined) {
  if (!name) return undefined;
  return LANCASTER_TOWNS.find((town) => town.name === name);
}

/** Service radius options offered in the profile form, in miles. */
export const SERVICE_RADIUS_MILES = [10, 25, 50] as const;
export const METERS_PER_MILE = 1609.344;

export function milesToMeters(miles: number): number {
  return Math.round(miles * METERS_PER_MILE);
}

export function metersToMiles(meters: number): number {
  return Math.round(meters / METERS_PER_MILE);
}
