"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryStorage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = __importDefault(require("multer-storage-cloudinary"));
const index_1 = require("./index");
if (!index_1.config.cloudinary.cloudName || !index_1.config.cloudinary.apiKey || !index_1.config.cloudinary.apiSecret) {
    console.error('❌ Cloudinary configuration missing!', {
        hasCloudName: !!index_1.config.cloudinary.cloudName,
        hasApiKey: !!index_1.config.cloudinary.apiKey,
        hasApiSecret: !!index_1.config.cloudinary.apiSecret,
    });
}
cloudinary_1.v2.config({
    cloud_name: index_1.config.cloudinary.cloudName,
    api_key: index_1.config.cloudinary.apiKey,
    api_secret: index_1.config.cloudinary.apiSecret,
    secure: true
});
console.log('☁️ Cloudinary initialized with cloud_name:', index_1.config.cloudinary.cloudName);
exports.cloudinaryStorage = (0, multer_storage_cloudinary_1.default)({
    // multer-storage-cloudinary@2.x calls `this.cloudinary.v2.uploader.upload_stream(...)`
    // internally — it expects the *whole* cloudinary module (with a `.v2` namespace), not
    // the v2 API object itself. Passing `cloudinary` (already `import { v2 as cloudinary }`)
    // directly made `.v2` resolve to `undefined`, so every upload threw synchronously deep
    // inside a stream callback where Express's error handler never sees it — the request
    // just hangs until Render's proxy eventually kills it with a 502. Wrapping it in `{ v2 }`
    // gives the library the shape it actually expects.
    cloudinary: { v2: cloudinary_1.v2 },
    // multer-storage-cloudinary@2.x does NOT support a Promise-returning `params` function
    // despite how naturally that reads — internally it hands this straight to `run-parallel`,
    // which calls it as `params(req, file, cb)` and waits for `cb(err, result)` to be invoked.
    // An `async (req, file) => {...}` function never calls that `cb` (it doesn't even declare
    // it), so run-parallel's task never completes, `_handleFile`'s callback never fires,
    // `upload_stream(...)` never gets created, and the busboy file stream never gets piped
    // anywhere — the request just hangs until something upstream (Render's proxy, or the
    // frontend's own AbortController) eventually kills it. Every image upload through this
    // storage — room photos included — was silently hanging for exactly this reason. Needs
    // the old-school Node callback signature, called synchronously since none of this work
    // is actually async.
    params: (req, file, callback) => {
        // Sanitize filename: remove extension and special characters
        const sanitizedName = file.originalname
            .split('.')[0]
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase();
        const folder = req.body?.folder || 'hotel-pms-profiles';
        callback(null, {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'flv', 'avi', 'webm', 'ogg', 'gif', '3gp'],
            public_id: `${Date.now()}-${sanitizedName}`,
            transformation: [{ width: 1200, quality: 80, crop: 'limit' }] // Optimize for web
        });
    },
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map