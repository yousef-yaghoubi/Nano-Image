import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/FormatDate';

describe('formatDate', () => {
  it('formats date in gregorian calendar by default', () => {
    const result = formatDate('2024-03-15');
    expect(result).toBe('15/03/2024');
  });

  it('formats with custom format string', () => {
    const result = formatDate('2024-03-15', { format: 'YYYY-MM-DD' });
    expect(result).toBe('2024-03-15');
  });

  it('accepts a Date object', () => {
    const result = formatDate(new Date(2024, 0, 1));
    expect(result).toBe('01/01/2024');
  });

  it('returns a string', () => {
    const result = formatDate('2024-03-15');
    expect(typeof result).toBe('string');
  });
});
