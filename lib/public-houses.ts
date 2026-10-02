import type { House } from "@/data/houses";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type HouseRow = {
  bathrooms: number | null;
  bedrooms: number | null;
  code: string;
  cover_image_url: string | null;
  description: string | null;
  floors: string | null;
  house_size: string | null;
  id: string;
  land_size: string | null;
  location: string | null;
  name: string;
  parking: number | null;
  slug: string;
  starting_price: string | null;
  style: string | null;
  usable_area: string | null;
};

type FloorPlanRow = {
  image_url: string | null;
  title: string | null;
};

const houseFields =
  "id,slug,code,name,cover_image_url,style,location,starting_price,floors,usable_area,house_size,land_size,description,bedrooms,bathrooms,parking";

function mapHouse(row: HouseRow, floorPlans: FloorPlanRow[] = []): House {
  return {
    slug: row.slug,
    code: row.code,
    name: row.name,
    image: row.cover_image_url ?? "",
    style: row.style ?? "",
    location: row.location ?? "",
    startingPrice: row.starting_price ?? "สอบถามราคา",
    floors: row.floors ?? "",
    usableArea: row.usable_area ?? "",
    houseSize: row.house_size ?? "",
    landSize: row.land_size ?? "",
    description: row.description ?? "",
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    parking: row.parking ?? 0,
    floorPlans: floorPlans
      .filter((plan) => plan.image_url)
      .map((plan) => ({
        title: plan.title ?? "",
        image: plan.image_url ?? "",
      })),
  };
}

export async function getPublishedHouses() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("houses")
    .select(houseFields)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapHouse(row as HouseRow));
}

export async function getFeaturedHouses(limit = 4) {
  const houses = await getPublishedHouses();

  return houses.slice(0, limit);
}

export async function getPublishedHouseBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: house, error: houseError } = await supabase
    .from("houses")
    .select(houseFields)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (houseError) {
    throw new Error(houseError.message);
  }

  if (!house) {
    return null;
  }

  const { data: floorPlans, error: floorPlansError } = await supabase
    .from("house_floor_plans")
    .select("title,image_url")
    .eq("house_id", house.id)
    .order("sort_order", { ascending: true });

  if (floorPlansError) {
    throw new Error(floorPlansError.message);
  }

  return mapHouse(house as HouseRow, (floorPlans ?? []) as FloorPlanRow[]);
}
