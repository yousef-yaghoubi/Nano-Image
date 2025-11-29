'use client';
import {
  AddToFavorite,
} from '@/app/[locale]/actions/AddToFavorite';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export function FavoriteButton({ promptId }: { promptId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await AddToFavorite({ promptId });
      if (result.success) {
        setIsFavorite(result.action === 'added');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={isLoading}>
      {isFavorite ? (
        <Heart size={15} className="mb-1 fill-red-600" />
      ) : (
        <Heart size={15} className="mb-1" />
      )}
    </button>
  );
}
