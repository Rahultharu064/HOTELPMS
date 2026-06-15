import { v2 as cloudinary } from 'cloudinary';
import type { Request } from 'express';
import createCloudinaryStorage from 'multer-storage-cloudinary';
import { config } from './index';

if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
  console.error('❌ Cloudinary configuration missing!', {
    hasCloudName: !!config.cloudinary.cloudName,
    hasApiKey: !!config.cloudinary.apiKey,
    hasApiSecret: !!config.cloudinary.apiSecret,
  });
}

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

console.log('☁️ Cloudinary initialized with cloud_name:', config.cloudinary.cloudName);

export const cloudinaryStorage = createCloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    // Sanitize filename: remove extension and special characters
    const sanitizedName = file.originalname
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
      
    const folder = (_req.body?.folder as string) || 'hotel-pms-profiles';
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp','mp4','mov','flv','avi','webm','ogg','gif','3gp'],
      public_id: `${Date.now()}-${sanitizedName}`,
      transformation: [{ width: 1200, quality: 80, crop: 'limit' }] // Optimize for web
    };
  },
});

export default cloudinary;
