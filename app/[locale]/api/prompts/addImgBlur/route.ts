import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Prompts } from '@/models';
import { GetBlurData } from '../../../actions/GetBlurHash';

export async function POST() {
  try {
    console.log('🚀 Starting to add imageBlur to prompts...');
    await dbConnect();
    // Find prompts that don't have imageBlur or have empty imageBlur
    const promptsToUpdate = await Prompts.find({
      $or: [
        { imageBlur: { $exists: false } },
        { imageBlur: '' },
        { imageBlur: null },
      ],
    })
      .limit(10)
      .select('_id image imageBlur')
      .lean();

    if (promptsToUpdate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No prompts need imageBlur update',
        updated: 0,
      });
    }

    console.log(`📦 Found ${promptsToUpdate.length} prompts to update`);

    let updated = 0;
    let failed = 0;

    // Process in smaller batches to avoid overwhelming the CDN
    const batchSize = 10;

    for (let i = 0; i < promptsToUpdate.length; i += batchSize) {
      const batch = promptsToUpdate.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (prompt) => {
          if (!prompt.image) {
            throw new Error('No image URL found');
          }

          // Generate blur data using GetBlurData
          const { blurDataURL } = await GetBlurData(prompt.image, 3, 15000);

          // Update the prompt with the generated blur data
          await Prompts.updateOne(
            { _id: prompt._id },
            { $set: { imageBlur: blurDataURL || '' } }
          );

          return prompt._id;
        })
      );

      // Count successes and failures
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          updated++;
        } else {
          failed++;
          console.error(
            `⚠️ Failed to generate blur for prompt:`,
            result.reason
          );
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < promptsToUpdate.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `🖼️ Processed ${Math.min(i + batchSize, promptsToUpdate.length)}/${promptsToUpdate.length} prompts...`
      );
    }

    console.log(`✅ Updated ${updated} prompts, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'ImageBlur update completed',
      updated,
      failed,
      total: promptsToUpdate.length,
    });
  } catch (error: unknown) {
    console.error('❌ Error in addImgBlur:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update imageBlur',
      },
      { status: 500 }
    );
  }
}
