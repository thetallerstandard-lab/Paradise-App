# Contractor map

**Status: Planned.** Mapbox is not installed; no token exists.

## Behaviour

- Opens centred on Lancaster County (`LANCASTER_COUNTY_CENTER`).
- Shows published contractor profiles as pins at their approximate `map_point`, clustered when dense.
- Filter by trade; search near a place.
- Selecting a pin shows a profile summary linking to the full profile.
- A list view mirrors the map for accessibility and small screens.

## Implementation plan

- `mapbox-gl` in a client component, loaded with `next/dynamic` (`ssr: false`) to keep it out of the Worker bundle.
- Data from a Postgres function such as `contractors_in_bbox(...)` via `supabase.rpc()`, returning GeoJSON.
- Public Mapbox token restricted to Paradise domains.
- Verify on `npm run preview` and mobile viewport.

Related: [GEOSPATIAL](../../architecture/GEOSPATIAL.md), [CONTRACTOR_PROFILES.md](CONTRACTOR_PROFILES.md).
