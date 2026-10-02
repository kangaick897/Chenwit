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
