import { Heart, Plus, Shield, User } from 'lucide-react';
import { FilterOption } from '@/types/filter';
import { ProfileMenuItem, StatusPrompt } from '@/types/data';
import { SlideContent } from '@/types/slider';
import { RoleType } from '@/models/enums';

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
  {
    id: 6,
    label: 'Language',
    options: ['Arabic', 'English', 'French', 'Portuguese', 'Spanish'],
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
    {
      id: 4,
      title: 'requestRole',
      link: `/${locale}/profile/requestRole`,
      icon: Shield,
    },
  ];
}

export const slides: SlideContent[] = [
  { title: 'Slide 1', image: '/images/slide1.webp', imagePriority: true },
  { title: 'Slide 2', image: '/images/slide2.webp', imagePriority: true },
  { title: 'Slide 3', image: '/images/slide3.webp', imagePriority: true },
  { title: 'Slide 4', image: '/images/slide4.webp', imagePriority: true },
  { title: 'Slide 6', image: '/images/slide6.webp', imagePriority: true },
  { title: 'Slide 7', image: '/images/slide7.webp', imagePriority: true },
  { title: 'Slide 8', image: '/images/slide8.webp', imagePriority: true },
  { title: 'Slide 9', image: '/images/slide9.webp', imagePriority: true },
  { title: 'Slide 10', image: '/images/slide10.webp', imagePriority: true },
  { title: 'Slide 11', image: '/images/slide11.webp', imagePriority: true },
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

export const statusPrompt: StatusPrompt[] = [
  { title: 'status.True', value: 'True' },
  { title: 'status.False', value: 'False' },
  { title: 'status.Pending', value: 'Pending' },
];

export const roleUser: { title: string; value: RoleType }[] = [
  { title: 'role.ADMIN', value: 'ADMIN' },
  { title: 'role.MEMBER', value: 'MEMBER' },
  { title: 'role.SUPER_ADMIN', value: 'SUPER_ADMIN' },
];
