import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    const first = screen.getByText('Secondary');
    expect(first.className).toContain('bg-secondary');
    rerender(<Badge variant="destructive">Destructive</Badge>);
    const second = screen.getByText('Destructive');
    expect(second.className).toContain('bg-destructive');
    rerender(<Badge variant="outline">Outline</Badge>);
    const third = screen.getByText('Outline');
    expect(third.className).toContain('text-foreground');
  });
});
