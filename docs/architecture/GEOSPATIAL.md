# Geospatial

**Status:** PostGIS columns and indexes **Implemented as SQL, not applied**.
Map UI and proximity queries **Planned** (Milestone 2).

## Storage

- PostGIS extension in the `extensions` schema.
- `geography(Point, 4326)` for points (`contractor_profiles.map_point`, `service_areas.center`,
  `resource_requests.location`); `geography(MultiPolygon, 4326)` for `service_areas.boundary`.
- Coordinates are **longitude, latitude** everywhere (PostGIS, GeoJSON, Mapbox). `lngLatSchema` in
  `src/modules/network` enforces ranges.
- GiST indexes on every geography column.

## Privacy

`map_point` is an approximate location the contractor chooses (town or ZIP centroid, or a pin they
place). We do not store contractor home or shop addresses in public tables. Resource request
locations should be job-site level only when the requester chooses to share them.

## Queries (planned)

Proximity and map-viewport searches will be Postgres functions called with `supabase.rpc()`, e.g.
`search_contractors(lng, lat, radius_m, trade_slug)` using `ST_DWithin` on geography, and
`contractors_in_bbox(west, south, east, north)` using `ST_MakeEnvelope`. Functions run as
`SECURITY INVOKER` so RLS still applies.

## Launch market

`LANCASTER_COUNTY_BOUNDS` and `LANCASTER_COUNTY_CENTER` in `src/modules/network/schemas.ts` set the
default map view. The bounding box is approximate and used only for UX defaults, not authorization.

## Mapbox

Mapbox GL JS runs in the browser with a public, URL-restricted token. It does not touch the Worker
runtime. See [../features/network/CONTRACTOR_MAP.md](../features/network/CONTRACTOR_MAP.md).
