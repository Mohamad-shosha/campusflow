import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CarSvg } from './CarSvg';

describe('CarSvg Component', () => {
  it('renders SVG with correct viewBox and car color', () => {
    const { container } = render(<CarSvg color="#10695e" plate="س م ر 2020" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 108 134');

    // Body path has stroke #ffffff and fill #10695e
    const bodyPath = container.querySelector('path[fill="#10695e"]');
    expect(bodyPath).toBeInTheDocument();
    expect(bodyPath).toHaveAttribute('stroke', '#ffffff');

    // Headlights have warm yellow fill (#dbd87f)
    const headlights = container.querySelectorAll('path[fill="#dbd87f"]');
    expect(headlights.length).toBe(2);

    // Taillights have vivid red fill (#e44141)
    const taillights = container.querySelectorAll('rect[fill="#e44141"]');
    expect(taillights.length).toBe(2);

    // Mini plate has plate digits
    expect(container.textContent).toContain('2020');
  });

  it('renders SUV variant with roof rails', () => {
    const { container } = render(<CarSvg color="#f1f5f9" type="suv" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', 'suv');
  });

  it('renders EV variant with front light band', () => {
    const { container } = render(<CarSvg color="#0284c7" type="ev" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', 'ev');
  });
});

