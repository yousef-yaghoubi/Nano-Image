import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LangSwicher from '@/components/shared/Navbar/LangSwicher';

describe('LangSwicher', () => {
  it('renders locale switcher button', () => {
    render(<LangSwicher />);
    const btn = screen.getByLabelText('Select language');
    expect(btn).toBeInTheDocument();
  });

  it('renders language options', () => {
    render(<LangSwicher />);
    expect(screen.getByText('fa')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('ar')).toBeInTheDocument();
  });
});
