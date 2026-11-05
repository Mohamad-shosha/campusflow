import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders children text and default variant class', () => {
    render(<Badge>FBSU Campus</Badge>);
    const badge = screen.getByTestId('fbsu-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('FBSU Campus');
    expect(badge).toHaveClass('badge-fbsu');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="available">Available</Badge>);
    expect(screen.getByTestId('fbsu-badge')).toHaveClass('badge-available');

    rerender(<Badge variant="gold">VIP</Badge>);
    expect(screen.getByTestId('fbsu-badge')).toHaveClass('badge-gold');

    rerender(<Badge variant="occupied">Occupied</Badge>);
    expect(screen.getByTestId('fbsu-badge')).toHaveClass('badge-occupied');
  });

  it('renders status dot when dot prop is true', () => {
    render(<Badge dot>Active Spot</Badge>);
    expect(screen.getByTestId('fbsu-badge-dot')).toBeInTheDocument();
  });
});
