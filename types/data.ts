import { ObjectId } from 'mongoose';

export interface PromptType {
  _id: ObjectId;
  title: string;
  prompt: string;
  image: string;
  likes: number;
  layout: string;
  creatorName: string;
  model: null | string;
  notes: null | string;
  tags: null | string[];
  isLiked: boolean;
  isPremium: boolean;
  isFavorited: boolean;
}

export interface DataFullType {
  success: boolean;
  message: string;
  data: PromptType[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UploadImageType {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: unknown[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}
