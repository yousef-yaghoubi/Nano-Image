import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import { Prompts } from '@/models';
import { PromptType } from '@/types/data';
import { GetBlurData } from '../../actions/GetBlurHash';

export async function GET() {
  try {
    console.log('🚀 Fetching prompts from Prompts API...');
    await dbConnect();

    const res = await fetch(
      `${process.env.API_PROMPT}/api/prompts?limit=2000`,
      { cache: 'no-store' }
    );

    console.log(res);
    const data = await res.json();

    if (!Array.isArray(data?.items)) {
      return NextResponse.json(
        { error: 'Invalid data format from API' },
        { status: 400 }
      );
    }

    const filteredItems = data.items.filter(
      (item: PromptType & {isPremium: boolean}) => item.isPremium === false
    );

    console.log(`📦 Total fetched: ${filteredItems.length}`);

    // Generate blur data for all prompts with concurrency limit
    console.log('🖼️ Generating blur data for images...');

    // Process in smaller batches to avoid overwhelming the CDN
    const blurBatchSize = 10;
    const promptsWithBlur: Array<{
      title: string;
      prompt: string;
      image: string;
      imageBlur: string;
      likes: number;
      tags: string[];
      creatorId: string;
    }> = [];

    for (let i = 0; i < filteredItems.length; i += blurBatchSize) {
      const batch = filteredItems.slice(i, i + blurBatchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (item: PromptType) => {
          let imageBlur = '';
          if (item.image) {
            try {
              const { blurDataURL } = await GetBlurData(item.image, 3, 15000);
              imageBlur = blurDataURL || '';
            } catch (error) {
              // Silently fail - we'll just use empty string
              // Only log if it's not a network error to avoid spam
              if (error instanceof Error && !error.message.includes('fetch')) {
                console.warn(
                  `⚠️ Failed to generate blur for image: ${item.image}`,
                  error.message
                );
              }
            }
          }

          return {
            title: item.title,
            prompt: item.prompt ?? '',
            image: item.image ?? '',
            imageBlur,
            likes: item.likes ?? 0,
            tags: item.tags ?? [],
            creatorId: '69347231d35b238694c04b1c',
          };
        })
      );

      // Add successful results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          promptsWithBlur.push(result.value);
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + blurBatchSize < filteredItems.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `🖼️ Processed ${Math.min(i + blurBatchSize, filteredItems.length)}/${filteredItems.length} images...`
      );
    }

    const prompts = promptsWithBlur;

    console.log(`✅ Blur data generated for ${prompts.length} prompts`);

    // ========= FIX #1 — smaller batch size =========
    const batchSize = 200;

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);

      // ========= FIX #2 — detect duplicates first =========
      const exists = await Prompts.find({
        title: { $in: batch.map((p: { title: string }) => p.title) },
      })
        .select('title')
        .lean();

      const existsSet = new Set(exists.map((e) => e.title));
      const newDocs = batch.filter(
        (p: { title: string }) => !existsSet.has(p.title)
      );

      if (newDocs.length === 0) {
        skipped += batch.length;
        continue;
      }

      // ========= FIX #3 — insertMany with ordered:false + retry =========
      try {
        await Prompts.insertMany(newDocs, { ordered: false });
        inserted += newDocs.length;
      } catch (err) {
        console.error('⚠️ Bulk insert failed, retrying...', err);

        // retry once
        try {
          await dbConnect();
          await Prompts.insertMany(newDocs, { ordered: false });
          inserted += newDocs.length;
        } catch (finalErr) {
          console.error('❌ FINAL FAIL for this batch:', finalErr);
          skipped += newDocs.length;
        }
      }

      // ========= FIX #4 — reconnect between batches =========
      if (mongoose.connection.readyState !== 1) {
        console.log('🔄 Reconnecting MongoDB...');
        await dbConnect();
      }

      console.log(
        `➡️ Batch ${i / batchSize + 1} inserted: ${newDocs.length}, skipped: ${
          batch.length - newDocs.length
        }`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully 🎉',
      inserted,
      skipped,
    });
  } catch (error: unknown) {
    console.error('❌ Error in fetch-prompts:', error);

    return NextResponse.json(
      { error: error || 'Failed to process data' },
      { status: 500 }
    );
  }
}
