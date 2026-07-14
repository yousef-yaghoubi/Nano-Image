'use server';

import * as yup from 'yup';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { IUser } from '@/types/models';
import { bustCache, CacheTags } from '@/lib/cache';
import { PromptType } from '@/types/data';
import mongoose from 'mongoose';
import { status } from '@/models/enums';
import { auth } from '@clerk/nextjs/server';
import { SchemaSendPrompt } from '@/validation/Form';

interface AddPromptInput {
  clerkId: string;
  prompt: {
    title: string;
    prompt: string;
    image: string;
    tags?: string[];
  };
}

export async function AddPrompt({ clerkId, prompt }: AddPromptInput) {
  try {
    if (!clerkId) {
      return { status: false, message: 'isNotAuthenticated' };
    }

    const validatedPrompt = await SchemaSendPrompt.validate({
      namePrompt: prompt.title,
      imageUrl: prompt.image,
      promptText: prompt.prompt,
      tags: prompt.tags,
    });

    await dbConnect();

    const user = (await Users.findOne({ clerkId }).lean()) as IUser | null;
    if (!user) {
      return { status: false, message: 'userNotFound' };
    }

    const newPrompt = await Prompts.create({
      title: validatedPrompt.namePrompt,
      prompt: validatedPrompt.promptText,
      image: validatedPrompt.imageUrl,
      creatorId: user._id,
      tags: validatedPrompt.tags || [],
      status: 'Pending',
    });

    bustCache(CacheTags.prompts, CacheTags.admin);

    return {
      status: true,
      message: 'createPrompt',
      data: JSON.parse(JSON.stringify(newPrompt)),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { status: false, message: error.message };
    }
    return { status: false, message: 'generic' };
  }
}

export async function AddPromptsList(): Promise<{
  success: boolean;
  message: string;
  inserted?: number;
}> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return {
        success: false,
        message: 'isNotAuthenticated',
      };
    }

    await dbConnect();

    const user = (await Users.findOne({
      clerkId,
    }).lean()) as IUser | null;

    if (!user) {
      return {
        success: false,
        message: 'userNotFound',
      };
    }

    if (user.role !== 'SUPER_ADMIN') {
      return {
        success: false,
        message: 'dontAccess',
      };
    }

    console.log('🚀 Fetching prompts from Prompts API...');

    const res = await fetch(
      `${process.env.API_PROMPT}/api/prompts?limit=2000`,
      { cache: 'no-store' }
    );

    const data = await res.json();

    if (!Array.isArray(data?.items)) {
      return {
        success: false,
        message: 'generic',
      };
    }

    const filteredItems = data.items.filter(
      (item: PromptType & { isPremium: boolean }) => item.isPremium === false
    );

    console.log(`📦 Total fetched: ${filteredItems.length}`);

    const prompts = filteredItems.map(
      (item: PromptType & { isPremium: boolean }) => ({
        title: item.title,
        prompt: item.prompt,
        image: item.image,
        likes: item.likes,
        tags: item.tags,
        status: status.Pending,
        creatorId: '69347231d35b238694c04b1c',
      })
    );

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
        const newDocsOrderedFalse = await Prompts.insertMany(newDocs, {
          ordered: false,
        });
        inserted += newDocsOrderedFalse.length;
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

    bustCache(CacheTags.prompts, CacheTags.admin);

    return {
      success: true,
      message: 'createPromptsList',
      inserted,
      // skipped,
    };
  } catch (error: unknown) {
    return { success: false, message: 'generic' };
  }
}
