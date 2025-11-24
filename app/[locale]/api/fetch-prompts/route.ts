import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import { Prompts } from '@/models';
import { PromptType } from '@/types/data';

export async function GET() {
  try {
    console.log('🚀 Fetching prompts from Prompts API...');
    await dbConnect();

    const res = await fetch(
      `${process.env.API_PROMPT}/api/prompts?limit=2000`,
      { cache: 'no-store' }
    );

    const data = await res.json();

    if (!Array.isArray(data?.items)) {
      return NextResponse.json(
        { error: 'Invalid data format from API' },
        { status: 400 }
      );
    }

    const prompts = data.items
      .filter((item: PromptType) => item.isPremium === false)
      .map((item: PromptType) => ({
        title: item.title,
        prompt: item.prompt ?? '',
        image: item.image ?? '',
        likes: item.likes ?? 0,
        layout: item.layout,
        creatorName: 'yousef',
        model: item.model ?? '',
        notes: item.notes ?? '',
        tags: item.tags ?? [],
        isPremium: item.isPremium ?? false,
      }));

    console.log(`📦 Total fetched: ${prompts.length}`);

    // ========= FIX #1 — smaller batch size =========
    const batchSize = 200;

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);

      // ========= FIX #2 — detect duplicates first =========
      const exists = await Prompts.find({
        title: { $in: batch.map((p) => p.title) },
      })
        .select('title')
        .lean();

      const existsSet = new Set(exists.map((e) => e.title));
      const newDocs = batch.filter((p) => !existsSet.has(p.title));

      if (newDocs.length === 0) {
        skipped += batch.length;
        continue;
      }

      // ========= FIX #3 — insertMany with ordered:false + retry =========
      try {
        await Prompts.insertMany(newDocs, { ordered: false });
        inserted += newDocs.length;
      } catch (err) {
        console.error('⚠️ Bulk insert failed, retrying...', err?.message);

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
  } catch (error: any) {
    console.error('❌ Error in fetch-prompts:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to process data' },
      { status: 500 }
    );
  }
}
