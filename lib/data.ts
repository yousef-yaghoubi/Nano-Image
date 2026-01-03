import { Heart, Plus, User } from 'lucide-react';
import { FilterOption } from '@/types/filter';
import { ProfileMenuItem } from '@/types/data';
import { SlideContent } from '@/types/slider';

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
    {
      id: 3,
      title: 'myPrompts',
      link: `/${locale}/profile/myPrompts`,
      icon: Plus,
    },
  ];
}

export const slides: SlideContent[] = [
  { title: 'Slide 1', image: '/images/slide1.webp' },
  { title: 'Slide 2', image: '/images/slide2.webp' },
  { title: 'Slide 3', image: '/images/slide3.webp' },
  { title: 'Slide 4', image: '/images/slide4.webp' },
  { title: 'Slide 5', image: '/images/slide5.webp' },
  { title: 'Slide 6', image: '/images/slide6.webp' },
  { title: 'Slide 7', image: '/images/slide7.webp' },
  { title: 'Slide 8', image: '/images/slide8.webp' },
  { title: 'Slide 9', image: '/images/slide9.webp' },
  { title: 'Slide 10', image: '/images/slide10.webp' },
  { title: 'Slide 11', image: '/images/slide11.webp' },
];

export const slideTexts = [
  { text: 'Gemini' },
  { text: 'ChatGPT' },
  { text: 'Firefly' },
  { text: 'Bing' },
  { text: 'Leonardo' },
  { text: 'Krea' },
  { text: 'Ideogram' },
  { text: 'Midjourney' },
  { text: 'Fotor' },
  { text: 'DALL·E' },
  { text: 'Phot Ai' },
];
