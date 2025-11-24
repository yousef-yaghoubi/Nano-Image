import mongoose from 'mongoose';

// Role Enum
export const Role = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

// Prompts Schema
const promptsSchema = new mongoose.Schema(
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
      index: true,
    },
    layout: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    model: {
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
  }
);

// Compound indexes for common queries
promptsSchema.index({ tags: 1, createdAt: -1 });
promptsSchema.index({ likes: -1, createdAt: -1 });
promptsSchema.index({ creatorName: 1, createdAt: -1 });

// Virtual for favorites count
promptsSchema.virtual('favoritesCount', {
  ref: 'PromptFavorite',
  localField: '_id',
  foreignField: 'promptId',
  count: true,
});

// Users Schema
const usersSchema = new mongoose.Schema(
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
      index: true,
    },
    image: {
      type: String,
    },
    waitFoRAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Compound index for admin queries
usersSchema.index({ role: 1, waitForSuperAdmin: 1 });

// Favorite Schema
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    collection: 'favorites',
  }
);

// Virtual for prompts in favorite
favoriteSchema.virtual('prompts', {
  ref: 'PromptFavorite',
  localField: '_id',
  foreignField: 'favoriteId',
});

// PromptFavorite Schema (Junction table)
const promptFavoriteSchema = new mongoose.Schema(
  {
    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prompts',
      required: true,
      index: true,
    },
    favoriteId: {
      type: mongoose.Schema.Types.ObjectId,
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

// Compound unique index to prevent duplicate favorites
promptFavoriteSchema.index({ promptId: 1, favoriteId: 1 }, { unique: true });

// Individual indexes for queries
promptFavoriteSchema.index({ favoriteId: 1, createdAt: -1 });
promptFavoriteSchema.index({ promptId: 1 });

// Static method to get user's favorite prompts efficiently
favoriteSchema.statics.getUserFavoritePrompts = async function (
  userId,
  options = {}
) {
  const {
    skip = 0,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1,
  } = options;

  const favorite = await this.findOne({ userId }).lean();
  if (!favorite) return [];

  return mongoose
    .model('PromptFavorite')
    .find({ favoriteId: favorite._id })
    .populate('promptId')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Static method to check if prompt is favorited
favoriteSchema.statics.isPromptFavorited = async function (userId, promptId) {
  const favorite = await this.findOne({ userId }).lean();
  if (!favorite) return false;

  const exists = await mongoose
    .model('PromptFavorite')
    .exists({ favoriteId: favorite._id, promptId });

  return !!exists;
};

// Static method to toggle favorite
favoriteSchema.statics.toggleFavorite = async function (userId, promptId) {
  let favorite = await this.findOne({ userId });

  if (!favorite) {
    favorite = await this.create({ userId });
  }

  const existing = await mongoose
    .model('PromptFavorite')
    .findOne({ favoriteId: favorite._id, promptId });

  if (existing) {
    await existing.deleteOne();
    return { action: 'removed', favorite };
  } else {
    await mongoose.model('PromptFavorite').create({
      favoriteId: favorite._id,
      promptId,
    });
    return { action: 'added', favorite };
  }
};

// Enable virtuals in JSON output
promptsSchema.set('toJSON', { virtuals: true });
promptsSchema.set('toObject', { virtuals: true });
favoriteSchema.set('toJSON', { virtuals: true });
favoriteSchema.set('toObject', { virtuals: true });

// Create and export models (prevents recompilation in dev)
export const Prompts =
  mongoose.models.Prompts || mongoose.model('Prompts', promptsSchema);
export const Users =
  mongoose.models.Users || mongoose.model('Users', usersSchema);
export const Favorite =
  mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
export const PromptFavorite =
  mongoose.models.PromptFavorite ||
  mongoose.model('PromptFavorite', promptFavoriteSchema);
