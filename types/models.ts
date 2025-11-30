import { Types, Document } from 'mongoose';
import type { RoleType } from '@/models/roles';
// ---------------------- USER TYPES ----------------------
export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  role: RoleType;
  image?: string;
  waitForAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserLean = {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  role: RoleType;
  image?: string;
  waitForAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ---------------------- PROMPT TYPES ----------------------
export interface IPrompt extends Document {
  _id: Types.ObjectId;
  title: string;
  prompt?: string;
  image: string;
  likes: number;
  layout: string;
  creatorName: string;
  aiModel: string;
  notes?: string;
  tags: string[];
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  favoritesCount?: number;
}

export type PromptLean = {
  _id: Types.ObjectId;
  title: string;
  prompt?: string;
  image: string;
  likes: number;
  layout: string;
  creatorName: string;
  model: string;
  notes?: string;
  tags: string[];
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  favoritesCount?: number;
};

// ---------------------- FAVORITE TYPES ----------------------
export interface IFavorite extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  prompts?: IPromptFavorite[];
}

export type FavoriteLean = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
};

// ---------------------- PROMPT FAVORITE TYPES ----------------------
export interface IPromptFavorite extends Document {
  _id: Types.ObjectId;
  promptId: Types.ObjectId;
  favoriteId: Types.ObjectId;
  createdAt: Date;
}

export type PromptFavoriteLean = {
  _id: Types.ObjectId;
  promptId: Types.ObjectId;
  favoriteId: Types.ObjectId;
  createdAt: Date;
};

// ---------------------- STATIC METHODS INTERFACE ----------------------
export interface GetUserFavoritePromptsOptions {
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

export interface ToggleFavoriteResult {
  action: 'added' | 'removed';
  favorite: FavoriteLean;
}

//  ---------------------- POPULATED TYPES ----------------------
export interface IPromptFavoritePopulated
  extends Omit<IPromptFavorite, 'promptId'> {
  promptId: IPrompt;
}

export type PromptFavoritePopulatedLean = {
  _id: Types.ObjectId;
  promptId: PromptLean;
  favoriteId: Types.ObjectId;
  createdAt: Date;
};

export interface IFavoritePopulated extends Omit<IFavorite, 'prompts'> {
  prompts: IPromptFavoritePopulated[];
}

// ---------------------- API RESPONSE TYPES ----------------------
export interface PaginationResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  pagination?: PaginationResponse;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ---------------------- AGGREGATION RESULT TYPES ----------------------
export interface CountResult {
  total: number;
}

// ---------------------- SORT TYPES ----------------------
export type SortField = 'likes' | 'createdAt';
export type SortOrder = 1 | -1;
export type SortParam =
  | 'likes asc'
  | 'likes desc'
  | 'date asc'
  | 'date desc'
  | null;
