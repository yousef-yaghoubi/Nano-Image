'use server';

import * as yup from 'yup';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { IUser } from '@/types/models';
import { bustCache, CacheTags } from '@/lib/cache';
import { PromptType } from '@/types/data';
import { status } from '@/models/enums';
import { auth } from '@clerk/nextjs/server';
import { SchemaSendPrompt } from '@/validation/Form';

interface AddPromptInput {
  prompt: {
    title: string;
    prompt: string;
    image: string;
    tags?: string[];
  };
}

export async function AddPrompt({ prompt }: AddPromptInput) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { success: false, message: 'isNotAuthenticated' };
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
      return { success: false, message: 'userNotFound' };
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
      success: true,
      message: 'createPrompt',
      data: JSON.parse(JSON.stringify(newPrompt)),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'generic' };
  }
}

type SourcePrompt = Partial<PromptType> & { isPremium?: boolean };

interface ImportPrompt {
  title: string;
  prompt: string;
  image: string;
  likes: number;
  tags: string[];
  status: typeof status.Pending;
  creatorId: IUser['_id'];
}

const IMPORT_BATCH_SIZE = 200;
const IMPORT_FETCH_TIMEOUT_MS = 30_000;
const IMPORT_PAGE_SIZE = 100;
const IMPORT_MAX_PAGES = 2; // 5 * 100 = up to 500 prompts per run
const IMPORT_START_OFFSET = 0; // set to 5 * 100 to start after the first 500

function normalizeTitle(title: string) {
  return title.trim().toLocaleLowerCase('en');
}

function toImportPrompt(
  item: SourcePrompt,
  creatorId: IUser['_id']
): ImportPrompt | null {
  if (
    typeof item.title !== 'string' ||
    typeof item.prompt !== 'string' ||
    typeof item.image !== 'string'
  ) {
    return null;
  }

  const title = item.title.trim();
  const prompt = item.prompt.trim();
  const image = item.image.trim();

  if (!title || !prompt || !image) {
    return null;
  }

  const likes =
    typeof item.likes === 'number' && Number.isFinite(item.likes)
      ? Math.max(0, Math.floor(item.likes))
      : 0;

  const tags = Array.isArray(item.tags)
    ? item.tags
        .filter((tag): tag is string => typeof tag === 'string' && !!tag.trim())
        .map((tag) => tag.trim())
    : [];

  return {
    title,
    prompt,
    image,
    likes,
    tags,
    status: status.Pending,
    creatorId,
  };
}

export async function AddPromptsList(): Promise<{
  success: boolean;
  message: string;
  inserted?: number;
  skipped?: number;
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

    const apiBase = process.env.API_PROMPT;
    if (!apiBase) {
      console.error('❌ API_PROMPT is not configured');
      return { success: false, message: 'generic' };
    }

    console.log('🚀 Fetching prompts from Prompts API...');

    const sourceItems: SourcePrompt[] = [];
    let offset = IMPORT_START_OFFSET;
    let page = 0;

    while (page < IMPORT_MAX_PAGES) {
      const res = await fetch(
        `${apiBase}/api/prompts?date=month&limit=${IMPORT_PAGE_SIZE}&offset=${offset}`,
        {
          cache: 'no-store',
          signal: AbortSignal.timeout(IMPORT_FETCH_TIMEOUT_MS),
        }
      );

      if (!res.ok) {
        console.error(
          `❌ Prompts API responded with ${res.status} (offset ${offset})`
        );
        if (page === 0) {
          return { success: false, message: 'generic' };
        }
        break;
      }

      const data = (await res.json()) as {
        items?: unknown;
        hasMore?: unknown;
        nextOffset?: unknown;
      };

      if (!Array.isArray(data?.items)) {
        console.error('❌ Prompts API returned an unexpected payload');
        if (page === 0) {
          return {
            success: false,
            message: 'generic',
          };
        }
        break;
      }

      page += 1;

      const pageItems = (data.items as SourcePrompt[]).filter(
        (item) => item?.isPremium === false
      );
      sourceItems.push(...pageItems);

      const itemsLength = data.items.length;
      const nextOffset =
        typeof data.nextOffset === 'number'
          ? data.nextOffset
          : offset + itemsLength;

      console.log(
        `📥 Page ${page}: offset ${offset}, received ${itemsLength}, non-premium ${pageItems.length}`
      );

      if (data.hasMore === false || itemsLength === 0 || nextOffset <= offset) {
        break;
      }

      offset = nextOffset;
    }

    // Deduplicate the fetched payload before touching the database.
    const uniquePrompts = new Map<string, ImportPrompt>();
    for (const item of sourceItems) {
      const prompt = toImportPrompt(item, user._id);
      if (!prompt) continue;

      const key = normalizeTitle(prompt.title);
      if (!uniquePrompts.has(key)) {
        uniquePrompts.set(key, prompt);
      }
    }

    const prompts = [...uniquePrompts.values()];

    console.log(
      `📦 Candidates: ${prompts.length} (fetched non-premium: ${sourceItems.length})`
    );

    async function insertBatch(batch: ImportPrompt[]): Promise<number> {
      try {
        const created = await Prompts.insertMany(batch, { ordered: false });
        return created.length;
      } catch (error) {
        console.error(
          '⚠️ Batch insert failed, retrying missing documents...',
          error
        );
        await dbConnect();

        // A partial insert may have succeeded; only retry what is still missing.
        const existing = await Prompts.find({
          title: { $in: batch.map((p) => p.title) },
        })
          .collation({ locale: 'en', strength: 2 })
          .select('title')
          .lean();

        const existingTitles = new Set(
          existing.map((e) => normalizeTitle(e.title))
        );
        const missing = batch.filter(
          (p) => !existingTitles.has(normalizeTitle(p.title))
        );

        if (missing.length === 0) {
          return 0;
        }

        try {
          const retried = await Prompts.insertMany(missing, {
            ordered: false,
          });
          return retried.length;
        } catch (retryError) {
          console.error('❌ Batch retry failed, skipping batch:', retryError);
          return 0;
        }
      }
    }

    let inserted = 0;

    for (let i = 0; i < prompts.length; i += IMPORT_BATCH_SIZE) {
      const batch = prompts.slice(i, i + IMPORT_BATCH_SIZE);

      const existing = await Prompts.find({
        title: { $in: batch.map((p) => p.title) },
      })
        .collation({ locale: 'en', strength: 2 })
        .select('title')
        .lean();

      const existingTitles = new Set(
        existing.map((e) => normalizeTitle(e.title))
      );
      const newDocs = batch.filter(
        (p) => !existingTitles.has(normalizeTitle(p.title))
      );

      if (newDocs.length === 0) {
        continue;
      }

      const batchInserted = await insertBatch(newDocs);
      inserted += batchInserted;

      console.log(
        `➡️ Batch ${i / IMPORT_BATCH_SIZE + 1}: inserted ${batchInserted}, skipped ${
          batch.length - newDocs.length
        }`
      );
    }

    try {
      bustCache(CacheTags.prompts, CacheTags.quantities, CacheTags.admin);
    } catch (cacheError) {
      // The write already succeeded; never report the whole import as failed.
      console.error('⚠️ Cache invalidation failed:', cacheError);
    }

    return {
      success: true,
      message: 'createPromptsList',
      inserted,
      skipped: prompts.length - inserted,
    };
  } catch (error) {
    console.error('❌ Failed to add prompts list:', error);
    return { success: false, message: 'generic' };
  }
}
