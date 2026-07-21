'use server';

import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function UploadImage(file: File) {
  try {
    if (!file) {
      return { success: false, error: 'noFile' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nanoImage',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          if (!result) return reject(new Error('Cloudinary returned no result'));
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch {
    return { success: false, error: 'generic' };
  }
}
