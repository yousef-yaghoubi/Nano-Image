import { describe, it, expect } from 'vitest';
import {
  FILTERING_OPTIONS,
  getProfileMenuItems,
  slides,
  slideTexts,
  statusPrompt,
  roleUser,
} from '@/lib/data';
import { Heart, Plus, Shield, User } from 'lucide-react';

describe('FILTERING_OPTIONS', () => {
  it('returns 6 filter groups', () => {
    expect(FILTERING_OPTIONS).toHaveLength(6);
  });

  it('each group has id, label, and options array', () => {
    for (const group of FILTERING_OPTIONS) {
      expect(group.id).toBeDefined();
      expect(typeof group.label).toBe('string');
      expect(Array.isArray(group.options)).toBe(true);
    }
  });
});

describe('getProfileMenuItems', () => {
  it('returns 4 items with correct icons', () => {
    const items = getProfileMenuItems('en');
    expect(items).toHaveLength(4);
    expect(items[0].icon).toBe(User);
    expect(items[1].icon).toBe(Heart);
    expect(items[2].icon).toBe(Plus);
    expect(items[3].icon).toBe(Shield);
  });

  it('includes locale in links', () => {
    const items = getProfileMenuItems('fa');
    for (const item of items) {
      expect(item.link).toContain('/fa');
    }
  });
});

describe('slides', () => {
  it('returns 10 slides', () => {
    expect(slides).toHaveLength(10);
  });

  it('each slide has title and image', () => {
    for (const slide of slides) {
      expect(slide.title).toBeDefined();
      expect(slide.image).toContain('/images/');
    }
  });
});

describe('slideTexts', () => {
  it('returns 11 items', () => {
    expect(slideTexts).toHaveLength(11);
  });

  it('each item has a text property', () => {
    for (const item of slideTexts) {
      expect(typeof item.text).toBe('string');
    }
  });
});

describe('statusPrompt', () => {
  it('contains True and False', () => {
    expect(statusPrompt).toHaveLength(2);
    expect(statusPrompt.find((s) => s.value === 'True')).toBeDefined();
    expect(statusPrompt.find((s) => s.value === 'False')).toBeDefined();
  });
});

describe('roleUser', () => {
  it('contains all 3 roles', () => {
    expect(roleUser).toHaveLength(3);
    const values = roleUser.map((r) => r.value);
    expect(values).toContain('MEMBER');
    expect(values).toContain('ADMIN');
    expect(values).toContain('SUPER_ADMIN');
  });
});
