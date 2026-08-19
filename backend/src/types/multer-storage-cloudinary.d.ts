declare module 'multer-storage-cloudinary' {
  import type { v2 as CloudinaryV2 } from 'cloudinary';
  import type { Request } from 'express';
  import type { StorageEngine } from 'multer';

  export interface CloudinaryStorageParams {
    folder?: string;
    allowed_formats?: string[];
    public_id?: string;
    transformation?: Record<string, unknown>[];
    [key: string]: unknown;
  }

  /**
   * The real (`lib/index.js`) `_handleFile` implementation hands each of these functions
   * straight to `run-parallel` as `fn(req, file, cb)` and blocks on `cb(err, result)` being
   * called — it does NOT await a returned Promise. A 2-arg `async (req, file) => value`
   * function silently never resolves the upload (the callback is never invoked, so
   * `run-parallel` never completes and the file's stream never gets piped to Cloudinary,
   * hanging the request indefinitely). Must be the Node-style 3-arg callback form.
   */
  type CloudinaryParamCallback<T> = (error: unknown, result?: T) => void;

  export interface CloudinaryStorageOptions {
    /** The library reaches into `cloudinary.v2.uploader` internally — pass `{ v2: cloudinaryV2 }`, not the v2 object itself. */
    cloudinary: { v2: typeof CloudinaryV2 };
    params?:
      | CloudinaryStorageParams
      | ((req: Request, file: Express.Multer.File, callback: CloudinaryParamCallback<CloudinaryStorageParams>) => void);
    filename?: string | ((req: Request, file: Express.Multer.File, callback: CloudinaryParamCallback<string>) => void);
    folder?: string | ((req: Request, file: Express.Multer.File, callback: CloudinaryParamCallback<string>) => void);
    transformation?:
      | Record<string, unknown>
      | ((req: Request, file: Express.Multer.File, callback: CloudinaryParamCallback<Record<string, unknown>>) => void);
    allowedFormats?: string[];
  }

  /** Factory — returns a multer StorageEngine (not a class constructor). */
  function cloudinaryStorage(options: CloudinaryStorageOptions): StorageEngine;

  export = cloudinaryStorage;
}
