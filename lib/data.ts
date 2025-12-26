import { Heart, Plus, User } from 'lucide-react';
import { FilterOption } from '@/types/filter';
import { ProfileMenuItem } from '@/types/data';

export const FILTERING_OPTIONS: FilterOption[] = [
  {
    id: 1,
    label: 'Artistic Styles',
    options: [
      'Realistic',
      'Cinematic',
      'Anime',
      'Architecture',
      'Cartoon',
      '3D Render',
      'Vector',
      'Watercolor',
      'Sketch / Line Art',
      'Oil Painting',
      'Abstract',
      'Surreal',
      'Fashion',
      'Photography',
      'Portrait',
    ],
  },
  {
    id: 2,
    label: 'Corporate & professional',
    options: [
      'Corporate',
      'Business',
      'Minimalist',
      'Modern',
      'Product / Poster',
      'Logo',
      'Infographic',
      'Concept art',
    ],
  },
  {
    id: 3,
    label: 'Genre & themes',
    options: ['Fantasy', 'Sci-Fi', 'Cyberpunk', 'Retro / Vintage', 'Grunge'],
  },
  {
    id: 4,
    label: 'Mood & tone',
    options: ['Vibrant / Colorful', 'Dark / Moody', 'Elegant'],
  },
  {
    id: 5,
    label: 'Optional add-ons',
    options: ['Glitch', 'Neon', 'Flat Design'],
  },
];

export function getProfileMenuItems(locale: string): ProfileMenuItem[] {
  return [
    { id: 1, title: 'profile', link: `/${locale}/profile`, icon: User },
    {
      id: 2,
      title: 'myFavorites',
      link: `/${locale}/profile/myFavorites`,
      icon: Heart,
    },
    { id: 3, title: 'myPrompts', link: `/${locale}/profile/myPrompts`, icon: Plus },
  ];
}
