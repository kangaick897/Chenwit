import type { SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_IMAGE_BUCKET = "site-images";

const STORAGE_PUBLIC_MARKER = `/storage/v1/object/public/${ADMIN_IMAGE_BUCKET}/`;

function getFileExtension(file: File) {
  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/jpeg") {
    return "jpg";
  }

  return "webp";
}

function sanitizePathPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isUploadableImage(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && value.type.startsWith("image/");
}

export async function uploadAdminImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
  label: string,
) {
  const extension = getFileExtension(file);
  const safeFolder = folder
    .split("/")
    .map((part) => sanitizePathPart(part))
    .filter(Boolean)
    .join("/");
  const safeLabel = sanitizePathPart(label) || "image";
  const path = `${safeFolder}/${safeLabel}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(ADMIN_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(ADMIN_IMAGE_BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

export function getAdminImageStoragePath(publicUrl: string) {
  const markerIndex = publicUrl.indexOf(STORAGE_PUBLIC_MARKER);

  if (markerIndex === -1) {
    return null;
  }

  const rawPath = publicUrl.slice(markerIndex + STORAGE_PUBLIC_MARKER.length).split("?")[0];

  try {
    return decodeURIComponent(rawPath);
  } catch {
    return rawPath;
  }
}

export async function removeAdminImages(supabase: SupabaseClient, publicUrls: string[]) {
  const paths = Array.from(
    new Set(publicUrls.map((url) => getAdminImageStoragePath(url)).filter((path): path is string => Boolean(path))),
  );

  if (paths.length === 0) {
    return;
  }

  await supabase.storage.from(ADMIN_IMAGE_BUCKET).remove(paths);
}
