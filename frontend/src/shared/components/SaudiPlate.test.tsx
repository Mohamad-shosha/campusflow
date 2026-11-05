import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SaudiPlate } from './SaudiPlate';

describe('SaudiPlate Component', () => {
  it('renders Arabic letters, English letters, and digits', () => {
    render(<SaudiPlate lettersAr="ط ر ق" lettersEn="T R G" digits="4040" isPrimary={true} />);

    expect(screen.getByText('ط ر ق')).toBeInTheDocument();
    expect(screen.getByText('T R G')).toBeInTheDocument();
    const digits = screen.getAllByText('4040');
    expect(digits.length).toBe(2); // In both AR and EN rows
  });

  it('renders primary green border styling when isPrimary is true', () => {
    render(<SaudiPlate lettersAr="أ ب ح" lettersEn="A B J" digits="1234" isPrimary={true} />);
    const plate = screen.getByTestId('saudi-plate');
    expect(plate.style.border).toMatch(/16,\s*185,\s*129|#10b981/);
  });
});
