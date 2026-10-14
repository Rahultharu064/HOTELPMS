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

  export interface CloudinaryStorageOptions {
    cloudinary: typeof CloudinaryV2;
    params?:
      | CloudinaryStorageParams
      | ((
          req: Request,
          file: Express.Multer.File
        ) => CloudinaryStorageParams | Promise<CloudinaryStorageParams>);
    filename?: string | ((req: Request, file: Express.Multer.File) => string | Promise<string>);
    folder?: string | ((req: Request, file: Express.Multer.File) => string | Promise<string>);
    transformation?:
      | Record<string, unknown>
      | ((req: Request, file: Express.Multer.File) => Record<string, unknown> | Promise<Record<string, unknown>>);
    allowedFormats?: string[];
  }

  /** Factory — returns a multer StorageEngine (not a class constructor). */
  function cloudinaryStorage(options: CloudinaryStorageOptions): StorageEngine;

  export = cloudinaryStorage;
}
