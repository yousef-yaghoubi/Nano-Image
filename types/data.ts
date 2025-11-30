import { ObjectId } from "mongoose";

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
