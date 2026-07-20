// @/models/index.ts
import { IFavorite, IPrompt, IPromptFavorite } from '@/types/models';
import { status, Role } from './enums';
import mongoose, { Schema } from 'mongoose';
import { UserType } from '@/types/data';

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
      required: true,
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
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.Pending,
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
promptsSchema.index({ status: 1, likes: -1 });
promptsSchema.index({ creatorId: 1, createdAt: -1 });

// Virtual: Count favorites
promptsSchema.virtual('favoritesCount', {
  ref: 'PromptFavorite',
  localField: '_id',
  foreignField: 'promptId',
  count: true,
});

// ---------------------- USERS SCHEMA ----------------------
const usersSchema = new Schema<UserType>(
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
    image: {
      type: String,
      required: false,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    lastName: {
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
  mongoose.models.Users || mongoose.model<UserType>('Users', usersSchema);

export const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>('Favorite', favoriteSchema);

export const PromptFavorite =
  mongoose.models.PromptFavorite ||
  mongoose.model<IPromptFavorite>('PromptFavorite', promptFavoriteSchema);
