// @/models/index.ts
import {
  IFavorite,
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

// ---------------------- EXPORTS ----------------------
export const Prompts =
  mongoose.models.Prompts || mongoose.model<IPrompt>('Prompts', promptsSchema);

export const Users =
  mongoose.models.Users || mongoose.model<IUser>('Users', usersSchema);

export const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>('Favorite', favoriteSchema);

export const PromptFavorite =
  mongoose.models.PromptFavorite ||
  mongoose.model<IPromptFavorite>('PromptFavorite', promptFavoriteSchema);
