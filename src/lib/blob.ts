import "server-only";
import { put } from "@vercel/blob";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Uploads a single user-submitted photo to Vercel Blob and returns its public
// URL, or null if the field was empty (file inputs submit an empty File when
// nothing was picked, so this filters those out rather than erroring).
export async function uploadPhoto(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Photos must be under 8MB.");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Photos must be JPEG, PNG, WEBP, or GIF.");
  }

  const ext = file.type.split("/")[1];
  const filename = `${folder}/${crypto.randomUUID()}.${ext}`;
  const blob = await put(filename, file, { access: "public" });
  return blob.url;
}

export async function uploadPhotos(files: File[], folder: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadPhoto(file, folder);
    if (url) urls.push(url);
  }
  return urls;
}
