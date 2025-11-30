'use client';
import { AddToFavorite } from '@/app/[locale]/actions/AddToFavorite';
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (promptIsFavorit) {
      setIsFavorite(promptIsFavorit);
    }
  }, [promptIsFavorit]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await AddToFavorite({ promptId });
      if (result.success) {
        setIsFavorite(result.action === 'added');
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className="disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
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
