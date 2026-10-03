import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminFloorPlan = {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
};

export type AdminHouse = {
  id: string;
  slug: string;
  code: string;
  name: string;
  coverImageUrl: string;
  style: string;
  location: string;
  startingPrice: string;
  floors: string;
  usableArea: string;
  houseSize: string;
  kitchens: number | null;
  description: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  floorPlans: AdminFloorPlan[];
};

type HouseRow = {
  id: string;
  slug: string;
  code: string;
  name: string;
  cover_image_url: string | null;
  style: string | null;
  location: string | null;
  starting_price: string | null;
  floors: string | null;
  usable_area: string | null;
  house_size: string | null;
  kitchens: number | null;
  description: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort_order: number | null;
};

type FloorPlanRow = {
  id: string;
  title: string | null;
  image_url: string | null;
  sort_order: number | null;
};

const houseFields =
  "id,slug,code,name,cover_image_url,style,location,starting_price,floors,usable_area,house_size,kitchens,description,bedrooms,bathrooms,parking,is_featured,is_published,sort_order";

function decodeRouteSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function mapHouse(row: HouseRow, floorPlans: FloorPlanRow[] = []): AdminHouse {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    name: row.name,
    coverImageUrl: row.cover_image_url ?? "",
    style: row.style ?? "",
    location: row.location ?? "",
    startingPrice: row.starting_price ?? "",
    floors: row.floors ?? "",
    usableArea: row.usable_area ?? "",
    houseSize: row.house_size ?? "",
    kitchens: row.kitchens ?? null,
    description: row.description ?? "",
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    parking: row.parking ?? 0,
    isFeatured: row.is_featured ?? false,
    isPublished: row.is_published ?? false,
    sortOrder: row.sort_order ?? 0,
    floorPlans: floorPlans.map((plan) => ({
      id: plan.id,
      title: plan.title ?? "",
      imageUrl: plan.image_url ?? "",
      sortOrder: plan.sort_order ?? 0,
    })),
  };
}

export async function getAdminHouses(): Promise<AdminHouse[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("houses")
    .select(houseFields)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapHouse(row as HouseRow));
}

export async function getAdminHouseBySlug(slug: string): Promise<AdminHouse | null> {
  const supabase = await createServerSupabaseClient();
  const { data: house, error: houseError } = await supabase
    .from("houses")
    .select(houseFields)
    .eq("slug", decodeRouteSlug(slug))
    .maybeSingle();

  if (houseError) {
    throw new Error(houseError.message);
  }

  if (!house) {
    return null;
  }

  const { data: floorPlans, error: floorPlansError } = await supabase
    .from("house_floor_plans")
    .select("id,title,image_url,sort_order")
    .eq("house_id", house.id)
    .order("sort_order", { ascending: true });

  if (floorPlansError) {
    throw new Error(floorPlansError.message);
  }

  return mapHouse(house as HouseRow, (floorPlans ?? []) as FloorPlanRow[]);
}
