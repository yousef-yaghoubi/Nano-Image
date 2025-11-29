// @/models/index.ts
import {
  IFavorite,
  IFavoriteModel,
  IUser,
  IPrompt,
  IPromptFavorite,
} from '@/types/models';
import { Role } from './roles';
import mongoose, { Schema } from 'mongoose';

// ---------------------- PROMPTS SCHEMA ----------------------
const promptsSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    prompt: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    layout: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
      trim: true,
    },
    aiModel: {
      // ✅ Changed from 'model' to 'aiModel'
      type: String,
      required: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'prompts',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Performance Indexes
promptsSchema.index({ tags: 1, createdAt: -1 });
promptsSchema.index({ likes: -1, createdAt: -1 });
promptsSchema.index({ creatorName: 1, createdAt: -1 });

// Virtual: Count favorites
promptsSchema.virtual('favoritesCount', {
  ref: 'PromptFavorite',
  localField: '_id',
  foreignField: 'promptId',
  count: true,
});

// ---------------------- USERS SCHEMA ----------------------
const usersSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.MEMBER,
    },
    image: {
      type: String,
    },
    waitForAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Compound index for Admin Dashboard
usersSchema.index({ role: 1, waitForAdmin: 1 });

// ---------------------- FAVORITE SCHEMA ----------------------
const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    collection: 'favorites',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

favoriteSchema.virtual('prompts', {
  ref: 'PromptFavorite',
  localField: '_id',
  foreignField: 'favoriteId',
});

// ---------------------- PROMPT FAVORITE SCHEMA ----------------------
const promptFavoriteSchema = new Schema<IPromptFavorite>(
  {
    promptId: {
      type: Schema.Types.ObjectId,
      ref: 'Prompts',
      required: true,
      index: true,
    },
    favoriteId: {
      type: Schema.Types.ObjectId,
      ref: 'Favorite',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'promptFavorites',
  }
);

// Indexes
promptFavoriteSchema.index({ promptId: 1, favoriteId: 1 }, { unique: true });
promptFavoriteSchema.index({ favoriteId: 1, createdAt: -1 });

// ---------------------- STATIC METHODS ----------------------
import type {
  GetUserFavoritePromptsOptions,
  ToggleFavoriteResult,
} from '@/types/models';
import { Types } from 'mongoose';

favoriteSchema.statics.getUserFavoritePrompts = async function (
  userId: Types.ObjectId,
  options: GetUserFavoritePromptsOptions = {}
): Promise<IPromptFavorite[]> {
  const {
    skip = 0,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1,
  } = options;

  const favorite = await this.findOne({ userId }).lean();
  if (!favorite) return [];

  return mongoose
    .model<IPromptFavorite>('PromptFavorite')
    .find({ favoriteId: favorite._id })
    .populate({
      path: 'promptId',
      select: 'title image likes creatorName tags',
    })
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();
};

favoriteSchema.statics.isPromptFavorited = async function (
  userId: Types.ObjectId,
  promptId: Types.ObjectId
): Promise<boolean> {
  const favorite = await this.findOne({ userId }).select('_id').lean();
  if (!favorite) return false;

  const exists = await mongoose
    .model<IPromptFavorite>('PromptFavorite')
    .exists({ favoriteId: favorite._id, promptId });

  return !!exists;
};

favoriteSchema.statics.toggleFavorite = async function (
  userId: Types.ObjectId,
  promptId: Types.ObjectId
): Promise<ToggleFavoriteResult> {
  const favorite = await this.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { upsert: true, new: true, lean: true }
  );

  if (!favorite) {
    throw new Error('Failed to create or find favorite');
  }

  const existing = await mongoose
    .model<IPromptFavorite>('PromptFavorite')
    .findOne({ favoriteId: favorite._id, promptId });

  if (existing) {
    await existing.deleteOne();
    await mongoose
      .model<IPrompt>('Prompts')
      .updateOne({ _id: promptId }, { $inc: { likes: -1 } });
    return { action: 'removed', favorite };
  } else {
    await mongoose.model<IPromptFavorite>('PromptFavorite').create({
      favoriteId: favorite._id,
      promptId,
    });
    await mongoose
      .model<IPrompt>('Prompts')
      .updateOne({ _id: promptId }, { $inc: { likes: 1 } });
    return { action: 'added', favorite };
  }
};

// ---------------------- EXPORTS ----------------------
export const Prompts =
  mongoose.models.Prompts || mongoose.model<IPrompt>('Prompts', promptsSchema);

export const Users =
  mongoose.models.Users || mongoose.model<IUser>('Users', usersSchema);

export const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite, IFavoriteModel>('Favorite', favoriteSchema);

export const PromptFavorite =
  mongoose.models.PromptFavorite ||
  mongoose.model<IPromptFavorite>('PromptFavorite', promptFavoriteSchema);
