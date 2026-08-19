"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadedFileUrl = getUploadedFileUrl;
/**
 * Resolves the public URL of a file uploaded through `cloudinaryStorage`
 * (see config/cloudinary.ts).
 *
 * multer-storage-cloudinary@2.x merges Cloudinary's raw upload result onto the
 * `Express.Multer.File` object — it does NOT set `.path` the way multer's disk
 * storage does, even though `Express.Multer.File`'s type declares `path` as
 * always present. The real fields are `.secure_url` / `.url` (see the
 * library's README, "File properties"). Reading `.path` silently returns
 * `undefined` here, which is why every image upload across the app (rooms,
 * room types, avatars, gallery venues, review proofs, extra services) was
 * being saved with a missing URL.
 */
function getUploadedFileUrl(file) {
    if (!file)
        return undefined;
    const cloudinaryFile = file;
    return cloudinaryFile.secure_url || cloudinaryFile.url || cloudinaryFile.path;
}
//# sourceMappingURL=uploadedFile.js.map