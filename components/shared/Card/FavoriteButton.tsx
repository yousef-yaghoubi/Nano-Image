'use client';
import useToggleFavorite from '@/hooks/mutations/useToggleFavorite';
import { useUser } from '@clerk/nextjs';
import { Heart } from 'lucide-react';
import { ObjectId } from 'mongoose';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function FavoriteButton({
  promptId,
  promptIsFavorit = false,
  likes,
}: {
  promptId: ObjectId;
  promptIsFavorit?: boolean;
  likes: number;
}) {
  const { user } = useUser();
  const { mutate } = useToggleFavorite();
  const tMessages = useTranslations('Messages');

  const handleToggle = () => {
    if (!user) {
      toast.error(tMessages('isNotAuthenticated'));
      return;
    }
    mutate({ promptId });
  };

  return (
    <button
      onClick={handleToggle}
      className="group flex cursor-pointer items-center gap-2 transition-transform active:scale-95"
      type="button"
    >
      <span
        className={`text-sm font-medium ${promptIsFavorit ? 'text-red-600' : 'text-gray-600'}`}
      >
        {likes}
      </span>

      <Heart
        size={18}
        className={`transition-all ${
          promptIsFavorit
            ? 'fill-red-600 text-red-600'
            : 'text-gray-500 group-hover:text-gray-700'
        }`}
      />
    </button>
  );
}
