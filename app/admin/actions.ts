"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";
import { resolveAdminEmail } from "@/lib/admin-auth";
import { isUploadableImage, removeAdminImages, uploadAdminImage } from "@/lib/admin-image-storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getRedirectTarget(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/admin/")) {
    return "/admin/dashboard";
  }

  return value;
}

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const next = getRedirectTarget(formData.get("next"));

  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    redirect("/admin?error=missing");
  }

  const supabase = await createServerSupabaseClient();
  const email = resolveAdminEmail(username);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin?error=invalid");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }

  redirect(next);
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/admin");
}

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getTextValues(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => (typeof value === "string" ? value.trim() : ""));
}

function getNumberValue(formData: FormData, key: string) {
  const value = Number.parseInt(getTextValue(formData, key), 10);

  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ก-๙]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function getUniqueHouseSlug(baseValue: string) {
  const supabase = await createServerSupabaseClient();
  const baseSlug = slugify(baseValue) || `house-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase.from("houses").select("id").eq("slug", slug).maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function getUniqueProjectSlug(baseValue: string) {
  const supabase = await createServerSupabaseClient();
  const baseSlug = slugify(baseValue) || `project-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function saveProjectGalleryImages(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  projectId: string,
  slug: string,
  title: string,
  formData: FormData,
  pendingImageDeletes: string[],
) {
  const galleryImageUrls = getTextValues(formData, "galleryImageUrl");
  const galleryImageUploads = formData.getAll("galleryImageUpload");
  const originalProjectImageUrls = getTextValues(formData, "originalProjectImageUrl");
  const galleryRows: Array<{
    alt_text: string;
    image_url: string;
    project_id: string;
    sort_order: number;
  }> = [];

  for (let index = 0; index < galleryImageUrls.length; index += 1) {
    const upload = galleryImageUploads[index];
    const currentImageUrl = galleryImageUrls[index] ?? "";
    const nextImageUrl = isUploadableImage(upload)
      ? await uploadAdminImage(supabase, upload, `projects/${slug}/gallery`, `image-${index + 1}`)
      : currentImageUrl;

    if (!nextImageUrl) {
      continue;
    }

    if (nextImageUrl !== currentImageUrl && currentImageUrl) {
      pendingImageDeletes.push(currentImageUrl);
    }

    galleryRows.push({
      alt_text: `${title} รูปที่ ${index + 1}`,
      image_url: nextImageUrl,
      project_id: projectId,
      sort_order: index + 1,
    });
  }

  originalProjectImageUrls.forEach((imageUrl) => {
    const stillUsed = galleryRows.some((row) => row.image_url === imageUrl);

    if (imageUrl && !stillUsed) {
      pendingImageDeletes.push(imageUrl);
    }
  });

  const { error: deleteError } = await supabase.from("project_images").delete().eq("project_id", projectId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (galleryRows.length > 0) {
    const { error: insertError } = await supabase.from("project_images").insert(galleryRows);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
}

export async function saveAdminSettings(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const businessHours = getTextValue(formData, "businessHours")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const contact = {
    officeTitle: getTextValue(formData, "officeTitle"),
    phone: getTextValue(formData, "phone"),
    lineId: getTextValue(formData, "lineId"),
    lineUrl: getTextValue(formData, "lineUrl"),
    email: getTextValue(formData, "email"),
    facebook: getTextValue(formData, "facebook"),
    facebookLabel: getTextValue(formData, "facebookLabel"),
    address: getTextValue(formData, "address"),
    businessHours,
  };

  const seo = {
    ...siteConfig.seo,
    description: getTextValue(formData, "seoDescription"),
  };

  const { error } = await supabase
    .from("site_settings")
    .update({
      company_name: getTextValue(formData, "companyName"),
      tagline: getTextValue(formData, "tagline"),
      contact,
      seo,
    })
    .eq("id", "default");

  if (error) {
    redirect("/admin/settings?error=save");
  }

  redirect("/admin/settings?saved=1");
}

export async function createHouse(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const code = getTextValue(formData, "code");
  const name = getTextValue(formData, "name");
  const coverImageFile = formData.get("coverImageFile");

  if (!code || !name) {
    redirect("/admin/houses/new?error=missing");
  }

  if (!isUploadableImage(coverImageFile)) {
    redirect("/admin/houses/new?error=cover");
  }

  let slug: string;

  try {
    slug = await getUniqueHouseSlug(code || name);
  } catch {
    redirect("/admin/houses/new?error=save");
  }

  let coverImageUrl = "";

  try {
    coverImageUrl = await uploadAdminImage(supabase, coverImageFile, `houses/${slug}`, "cover");
  } catch {
    redirect("/admin/houses/new?error=upload");
  }

  const { error } = await supabase.from("houses").insert({
    slug,
    code,
    name,
    cover_image_url: coverImageUrl,
    style: getTextValue(formData, "style"),
    location: getTextValue(formData, "location"),
    starting_price: getTextValue(formData, "startingPrice"),
    floors: `${Math.max(1, getNumberValue(formData, "floorCount"))} ชั้น`,
    description: getTextValue(formData, "description"),
    bedrooms: getNumberValue(formData, "bedrooms"),
    bathrooms: getNumberValue(formData, "bathrooms"),
    parking: getNumberValue(formData, "parking"),
    is_published: true,
  });

  if (error) {
    if (coverImageUrl) {
      await removeAdminImages(supabase, [coverImageUrl]);
    }

    redirect("/admin/houses/new?error=save");
  }

  revalidatePath("/");
  revalidatePath("/houses");
  revalidatePath("/admin/houses");
  revalidatePath("/admin/dashboard");

  redirect(`/admin/houses/${slug}/edit?saved=1`);
}

export async function createProject(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const title = getTextValue(formData, "title");
  const coverImageFile = formData.get("coverImageFile");

  if (!title) {
    redirect("/admin/projects/new?error=missing");
  }

  if (!isUploadableImage(coverImageFile)) {
    redirect("/admin/projects/new?error=cover");
  }

  let slug = "";

  try {
    slug = await getUniqueProjectSlug(title);
  } catch {
    redirect("/admin/projects/new?error=save");
  }

  let coverImageUrl = "";

  try {
    coverImageUrl = await uploadAdminImage(supabase, coverImageFile, `projects/${slug}`, "cover");
  } catch {
    redirect("/admin/projects/new?error=upload");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      slug,
      title,
      cover_image_url: coverImageUrl,
      category_slug: getTextValue(formData, "category"),
      location: getTextValue(formData, "location"),
      status: getTextValue(formData, "status"),
      year: getTextValue(formData, "year"),
      area: getTextValue(formData, "area"),
      scope: getTextValue(formData, "scope"),
      description: getTextValue(formData, "description"),
      show_details: formData.get("showDetails") === "on",
      is_published: formData.get("isPublished") === "on",
    })
    .select("id")
    .single();

  if (error || !project) {
    if (coverImageUrl) {
      await removeAdminImages(supabase, [coverImageUrl]);
    }

    redirect("/admin/projects/new?error=save");
  }

  const pendingImageDeletes: string[] = [];

  try {
    await saveProjectGalleryImages(supabase, project.id, slug, title, formData, pendingImageDeletes);
  } catch {
    redirect(`/admin/projects/${slug}/edit?error=upload`);
  }

  await removeAdminImages(supabase, pendingImageDeletes);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  redirect(`/admin/projects/${slug}/edit?saved=1`);
}

export async function saveProject(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = getTextValue(formData, "id");
  const slug = getTextValue(formData, "slug");

  if (!id || !slug) {
    redirect("/admin/projects?error=save");
  }

  const pendingImageDeletes: string[] = [];
  const coverImageFile = formData.get("coverImageFile");
  const currentCoverImageUrl = getTextValue(formData, "coverImageUrl");
  let coverImageUrl = currentCoverImageUrl;

  try {
    if (isUploadableImage(coverImageFile)) {
      coverImageUrl = await uploadAdminImage(supabase, coverImageFile, `projects/${slug}`, "cover");

      if (currentCoverImageUrl) {
        pendingImageDeletes.push(currentCoverImageUrl);
      }
    }
  } catch {
    redirect(`/admin/projects/${slug}/edit?error=upload`);
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title: getTextValue(formData, "title"),
      cover_image_url: coverImageUrl,
      category_slug: getTextValue(formData, "category"),
      location: getTextValue(formData, "location"),
      status: getTextValue(formData, "status"),
      year: getTextValue(formData, "year"),
      area: getTextValue(formData, "area"),
      scope: getTextValue(formData, "scope"),
      description: getTextValue(formData, "description"),
      show_details: formData.get("showDetails") === "on",
      is_published: formData.get("isPublished") === "on",
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/projects/${slug}/edit?error=save`);
  }

  try {
    await saveProjectGalleryImages(
      supabase,
      id,
      slug,
      getTextValue(formData, "title"),
      formData,
      pendingImageDeletes,
    );
  } catch {
    redirect(`/admin/projects/${slug}/edit?error=save`);
  }

  await removeAdminImages(supabase, pendingImageDeletes);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${slug}/edit`);
  revalidatePath("/admin/dashboard");

  redirect(`/admin/projects/${slug}/edit?saved=1`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = getTextValue(formData, "id");

  if (!id) {
    redirect("/admin/projects?error=delete");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,cover_image_url")
    .eq("id", id)
    .maybeSingle();

  if (projectError || !project) {
    redirect("/admin/projects?error=delete");
  }

  const { data: images, error: imagesError } = await supabase
    .from("project_images")
    .select("image_url")
    .eq("project_id", id);

  if (imagesError) {
    redirect("/admin/projects?error=delete");
  }

  const { error: deleteImagesError } = await supabase.from("project_images").delete().eq("project_id", id);

  if (deleteImagesError) {
    redirect("/admin/projects?error=delete");
  }

  const { error: deleteProjectError } = await supabase.from("projects").delete().eq("id", id);

  if (deleteProjectError) {
    redirect("/admin/projects?error=delete");
  }

  await removeAdminImages(supabase, [
    project.cover_image_url,
    ...(images ?? []).map((image) => image.image_url),
  ].filter((imageUrl): imageUrl is string => Boolean(imageUrl)));

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/dashboard");

  redirect("/admin/projects?deleted=1");
}

export async function saveHouse(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = getTextValue(formData, "id");
  const slug = getTextValue(formData, "slug");

  if (!id || !slug) {
    redirect("/admin/houses?error=save");
  }

  const pendingImageDeletes: string[] = [];
  const coverImageFile = formData.get("coverImageFile");
  const currentCoverImageUrl = getTextValue(formData, "coverImageUrl");
  let coverImageUrl = currentCoverImageUrl;

  try {
    if (isUploadableImage(coverImageFile)) {
      coverImageUrl = await uploadAdminImage(supabase, coverImageFile, `houses/${slug}`, "cover");

      if (currentCoverImageUrl) {
        pendingImageDeletes.push(currentCoverImageUrl);
      }
    }
  } catch {
    redirect(`/admin/houses/${slug}/edit?error=upload`);
  }

  const { error } = await supabase
    .from("houses")
    .update({
      code: getTextValue(formData, "code"),
      name: getTextValue(formData, "name"),
      cover_image_url: coverImageUrl,
      starting_price: getTextValue(formData, "startingPrice"),
      floors: `${Math.max(1, getNumberValue(formData, "floorCount"))} ชั้น`,
      description: getTextValue(formData, "description"),
      house_size: getTextValue(formData, "houseSize"),
      usable_area: getTextValue(formData, "usableArea"),
      land_size: getTextValue(formData, "landSize"),
      bedrooms: getNumberValue(formData, "bedrooms"),
      bathrooms: getNumberValue(formData, "bathrooms"),
      parking: getNumberValue(formData, "parking"),
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/houses/${slug}/edit?error=save`);
  }

  const floorPlanTitles = getTextValues(formData, "floorPlanTitle");
  const floorPlanImages = getTextValues(formData, "floorPlanImageUrl");
  const floorPlanUploads = formData.getAll("floorPlanUpload");
  const originalFloorPlanImages = getTextValues(formData, "originalFloorPlanImageUrl");
  const floorPlanRows: Array<{
    house_id: string;
    title: string;
    image_url: string;
    sort_order: number;
  }> = [];

  try {
    for (let index = 0; index < floorPlanTitles.length; index += 1) {
      const upload = floorPlanUploads[index];
      const currentImageUrl = floorPlanImages[index] ?? "";
      const nextImageUrl = isUploadableImage(upload)
        ? await uploadAdminImage(supabase, upload, `houses/${slug}/floor-plans`, `floor-${index + 1}`)
        : currentImageUrl;

      if (!nextImageUrl) {
        continue;
      }

      if (nextImageUrl !== currentImageUrl && currentImageUrl) {
        pendingImageDeletes.push(currentImageUrl);
      }

      floorPlanRows.push({
        house_id: id,
        title: floorPlanTitles[index] || `ชั้น ${index + 1}`,
        image_url: nextImageUrl,
        sort_order: index + 1,
      });
    }
  } catch {
    redirect(`/admin/houses/${slug}/edit?error=upload`);
  }

  originalFloorPlanImages.forEach((imageUrl) => {
    const stillUsed = floorPlanRows.some((row) => row.image_url === imageUrl);

    if (imageUrl && !stillUsed) {
      pendingImageDeletes.push(imageUrl);
    }
  });

  const floorPlanPayload = floorPlanRows
    .map((plan) => ({
      house_id: id,
      title: plan.title,
      image_url: plan.image_url,
      sort_order: plan.sort_order,
    }))
    .filter((plan) => plan.image_url);

  const { error: deleteError } = await supabase.from("house_floor_plans").delete().eq("house_id", id);

  if (deleteError) {
    redirect(`/admin/houses/${slug}/edit?error=save`);
  }

  if (floorPlanPayload.length > 0) {
    const { error: insertError } = await supabase.from("house_floor_plans").insert(floorPlanPayload);

    if (insertError) {
      redirect(`/admin/houses/${slug}/edit?error=save`);
    }
  }

  await removeAdminImages(supabase, pendingImageDeletes);

  revalidatePath("/admin/houses");
  revalidatePath(`/admin/houses/${slug}/edit`);
  revalidatePath("/houses");
  revalidatePath(`/houses/${slug}`);

  redirect(`/admin/houses/${slug}/edit?saved=1`);
}
