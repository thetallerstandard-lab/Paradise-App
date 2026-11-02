/**
 * Supabase database types.
 *
 * HAND-WRITTEN to mirror supabase/migrations/20261102000000_initial_schema.sql
 * because no Supabase project exists yet. Once the migration is applied,
 * replace this file with generated output:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.ts
 * PostGIS geography columns are returned by PostgREST as GeoJSON/EWKB; typed as `unknown` here.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

type Table<Row, Required extends keyof Row, Generated extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required | Generated>> & Partial<Pick<Row, Generated>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type MembershipRole = "owner" | "admin" | "member";
export type MembershipStatus = "invited" | "active" | "removed";
export type ProfileVisibility = "draft" | "published";
export type ResourceRequestKind = "equipment_rental" | "labor" | "materials" | "subcontracting";
export type ResourceRequestStatus = "draft" | "open" | "fulfilled" | "cancelled" | "expired";
export type ExchangeOfferStatus = "pending" | "accepted" | "declined" | "withdrawn";

export type ProfileRow = Timestamps & {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
};

export type OrganizationRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  website: string | null;
  created_by: string;
  archived_at: string | null;
};

export type OrganizationMembershipRow = Timestamps & {
  id: string;
  organization_id: string;
  user_id: string;
  role: MembershipRole;
  status: MembershipStatus;
};

export type TradeCategoryRow = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type ContractorProfileRow = Timestamps & {
  id: string;
  organization_id: string;
  headline: string | null;
  bio: string | null;
  years_in_business: number | null;
  license_number: string | null;
  is_insured: boolean;
  map_point: unknown;
  visibility: ProfileVisibility;
};

export type ContractorProfileTradeRow = {
  contractor_profile_id: string;
  trade_category_id: string;
  is_primary: boolean;
};

export type ServiceAreaRow = Timestamps & {
  id: string;
  organization_id: string;
  name: string;
  center: unknown;
  radius_meters: number | null;
  boundary: unknown;
};

export type ResourceRequestRow = Timestamps & {
  id: string;
  organization_id: string;
  created_by: string;
  kind: ResourceRequestKind;
  trade_category_id: string | null;
  title: string;
  description: string;
  location: unknown;
  needed_from: string | null;
  needed_until: string | null;
  budget_points: number | null;
  status: ResourceRequestStatus;
};

export type ExchangeOfferRow = Timestamps & {
  id: string;
  request_id: string;
  organization_id: string;
  created_by: string;
  points_amount: number;
  message: string;
  status: ExchangeOfferStatus;
  responded_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, "id", "created_at" | "updated_at">;
      organizations: Table<OrganizationRow, "name" | "slug" | "created_by", "id" | "created_at" | "updated_at">;
      organization_memberships: Table<
        OrganizationMembershipRow,
        "organization_id" | "user_id",
        "id" | "created_at" | "updated_at"
      >;
      trade_categories: Table<TradeCategoryRow, "slug" | "name", "id" | "created_at">;
      contractor_profiles: Table<ContractorProfileRow, "organization_id", "id" | "created_at" | "updated_at">;
      contractor_profile_trades: Table<ContractorProfileTradeRow, "contractor_profile_id" | "trade_category_id", never>;
      service_areas: Table<ServiceAreaRow, "organization_id" | "name", "id" | "created_at" | "updated_at">;
      resource_requests: Table<
        ResourceRequestRow,
        "organization_id" | "created_by" | "kind" | "title",
        "id" | "created_at" | "updated_at"
      >;
      exchange_offers: Table<
        ExchangeOfferRow,
        "request_id" | "organization_id" | "created_by" | "points_amount",
        "id" | "created_at" | "updated_at" | "responded_at"
      >;
    };
    Views: Record<never, never>;
    Functions: {
      is_org_member: { Args: { org_id: string }; Returns: boolean };
      has_org_role: { Args: { org_id: string; roles: MembershipRole[] }; Returns: boolean };
    };
    Enums: {
      membership_role: MembershipRole;
      membership_status: MembershipStatus;
      profile_visibility: ProfileVisibility;
      resource_request_kind: ResourceRequestKind;
      resource_request_status: ResourceRequestStatus;
      exchange_offer_status: ExchangeOfferStatus;
    };
    CompositeTypes: Record<never, never>;
  };
};
