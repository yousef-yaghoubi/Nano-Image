import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prismaClient';
import { PromptType } from '@/types/data';
import type { Prompts } from '@prisma/client';

export async function GET() {
  try {
    console.log('🚀 Fetching prompts from Prompts API...');

    const res = await fetch(`${process.env.API_PROMPT}/api/prompts?limit=2000`);
    const data = await res.json();

    if (!Array.isArray(data?.items)) {
      return NextResponse.json(
        { error: 'Invalid data format from API' },
        { status: 400 }
      );
    }

    const prompts = data.items.map((item: PromptType) => ({
      title: item.title,
      prompt: item.prompt ?? '',
      image: item.image ?? '',
      likes: item.likes ?? 0,
      layout: item.layout,
      creatorName: item.creatorName ?? 'yousef',
      model: item.model ?? '',
      notes: item.notes ?? '',
      tags: item.tags ?? [],
      isLiked: item.isLiked ?? false,
      isPremium: item.isPremium ?? false,
    }));

    console.log(`📦 Total fetched: ${prompts.length}`);

    const batchSize = 1000;
    let insertedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < prompts.length; i += batchSize) {
      const batch = prompts.slice(i, i + batchSize);

      // 🔍 پیدا کردن پرامپت‌هایی که از قبل وجود دارن (بر اساس title)
      const existing = await prisma.prompts.findMany({
        where: {
          title: {
            in: batch.map((p: { title: unknown }) => p.title),
          },
        },
        // select: { title: true },
      });

      const existingTitles = new Set(existing.map((e: Prompts) => e.title));
      const newPrompts = batch.filter(
        (p: { title: string }) => !existingTitles.has(p.title)
      );

      if (newPrompts.length > 0) {
        await prisma.prompts.createMany({ data: newPrompts });
        insertedCount += newPrompts.length;
      }

      skippedCount += batch.length - newPrompts.length;

      console.log(
        `✅ Batch ${i / batchSize + 1}: Inserted ${
          newPrompts.length
        }, Skipped ${batch.length - newPrompts.length}`
      );
    }

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      skipped: skippedCount,
      message: 'Prompts synced successfully 🚀',
    });
  } catch (error) {
    console.error('❌ Error fetching/saving prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or save data' },
      { status: 500 }
    );
  }
}
