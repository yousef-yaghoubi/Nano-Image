'use client';
import useToggleFavorite from '@/hooks/mutations/useToggleFavorite';
import { Heart, Loader2 } from 'lucide-react';
import { ObjectId } from 'mongoose';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function FavoriteButton({
  promptId,
  promptIsFavorit,
}: {
  promptId: ObjectId;
  promptIsFavorit: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { mutate, isPending } = useToggleFavorite();

  useEffect(() => {
    if (promptIsFavorit) {
      setIsFavorite(promptIsFavorit);
    }
  }, [promptIsFavorit]);

  const handleToggle = () => {
    mutate(
      { promptId },
      {
        onSuccess: (result) => {
          if (result.success) {
            setIsFavorite(result.action === 'added');
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        },
        onError: () => {
          toast.error('An error occurred. Please try again.');
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 size={15} className="mb-1 animate-spin text-gray-500" />
        ) : isFavorite ? (
          <Heart size={15} className="mb-1 fill-red-600" />
        ) : (
          <Heart size={15} className="mb-1" />
        )}
      </button>
    </>
  );
}
