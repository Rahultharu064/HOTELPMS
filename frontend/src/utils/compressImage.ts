/**
 * Downscales and re-encodes an image file entirely in the browser before upload.
 *
 * Phone photos are routinely 3-10MB at 4000px+; uploading them as-is over typical
 * home upload bandwidth (often 1-5 Mbps) is what makes room photo uploads feel like
 * they hang. The backend's Cloudinary transform already caps stored images at 1200px
 * wide, but that only resizes AFTER the full original has been uploaded — it does
 * nothing for transfer time. Shrinking client-side fixes the actual bottleneck.
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  // Skip formats canvas can't safely re-encode (animated GIFs would lose their animation).
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;

  // Already small — not worth the re-encode.
  if (file.size < 400_000) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.\w+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch {
    // If the browser can't decode it client-side, let the server handle the original.
    return file;
  }
}

/** Compresses a batch of images, skipping any that fail individually. */
export async function compressImages(files: File[], maxDimension?: number, quality?: number): Promise<File[]> {
  return Promise.all(files.map((f) => compressImage(f, maxDimension, quality)));
}
