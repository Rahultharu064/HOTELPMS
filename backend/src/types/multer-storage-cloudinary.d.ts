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
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error?: unknown, info?: Partial<Express.Multer.File>) => void
    ): void;
    _removeFile(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void
    ): void;
  }
}
