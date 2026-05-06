import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from './index';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    // Sanitize filename: remove extension and special characters
    const sanitizedName = file.originalname
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
      
    const folder = (_req.body?.folder as string) || 'hotel-pms-profiles';
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `${Date.now()}-${sanitizedName}`,
      transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optimize for profile pics
    };
  },
});

export default cloudinary;
