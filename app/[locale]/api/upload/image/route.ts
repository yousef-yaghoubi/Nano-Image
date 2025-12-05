// app/api/upload/route.ts
import { UploadImageType } from '@/types/data';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { getTranslations } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const t = await getTranslations('Errors');
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: t('noFile') }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<UploadImageType | UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'pramptiko', // Optional: organize uploads in folders
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            if (!result)
              return reject(new Error('Cloudinary returned no result'));
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result?.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: t('generic') }, { status: 500 });
  }
}