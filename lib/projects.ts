import type { Project, ProjectCategory } from "@/data/projects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminProject = Project & {
  id: string;
  coverImageUrl: string;
  isPublished: boolean;
  sortOrder: number;
};

type ProjectRow = {
  area: string | null;
  category_slug: string | null;
  cover_image_url: string | null;
  description: string | null;
  highlights: string[] | null;
  id: string;
  is_published: boolean | null;
  location: string | null;
  scope: string | null;
  show_details: boolean | null;
  slug: string;
  sort_order: number | null;
  status: string | null;
  title: string;
  year: string | null;
};

type ProjectImageRow = {
  alt_text: string | null;
  image_url: string | null;
  sort_order: number | null;
};

type CategoryRow = {
  label: string;
  show_in_filter: boolean | null;
  slug: string;
};

const projectFields =
  "id,slug,title,location,cover_image_url,category_slug,status,year,area,scope,description,highlights,show_details,is_published,sort_order";

function decodeRouteSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function mapProject(row: ProjectRow, gallery: ProjectImageRow[] = []): AdminProject {
  const galleryImages = gallery
    .filter((image) => image.image_url)
    .map((image) => image.image_url ?? "");

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location ?? "",
    image: row.cover_image_url ?? "",
    coverImageUrl: row.cover_image_url ?? "",
    category: row.category_slug ?? "completed",
    status: row.status ?? "",
    year: row.year ?? "",
    area: row.area ?? "",
    scope: row.scope ?? "",
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    gallery: galleryImages,
    showDetails: row.show_details ?? true,
    isPublished: row.is_published ?? false,
    sortOrder: row.sort_order ?? 0,
  };
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("project_categories")
    .select("slug,label,show_in_filter")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((category) => ({
    slug: (category as CategoryRow).slug,
    label: (category as CategoryRow).label,
    showInFilter: (category as CategoryRow).show_in_filter ?? true,
  }));
}

export async function getAdminProjects() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectFields)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProject(row as ProjectRow));
}

export async function getPublishedProjects() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectFields)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapProject(row as ProjectRow));
}

export async function getProjectBySlug(slug: string, publishedOnly = true) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("projects").select(projectFields).eq("slug", decodeRouteSlug(slug));

  if (publishedOnly) {
    query = query.eq("is_published", true);
  }

  const { data: project, error: projectError } = await query.maybeSingle();

  if (projectError) {
    throw new Error(projectError.message);
  }

  if (!project) {
    return null;
  }

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("image_url,alt_text,sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  return mapProject(project as ProjectRow, (images ?? []) as ProjectImageRow[]);
}
