import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QR } from './QR';

describe('QR Component', () => {
  it('renders QR code SVG with appropriate accessible role', () => {
    render(<QR value="FBSU-PASS-A101-4040" title="Gate Access Pass" />);
    const qrElement = screen.getByRole('img', { name: 'Gate Access Pass' });
    expect(qrElement).toBeInTheDocument();
    expect(screen.getByTestId('fbsu-qr')).toBeInTheDocument();
  });

  it('renders SVG with requested dimensions', () => {
    const { container } = render(<QR value="FBSU-TEST" size={240} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '240');
    expect(svg).toHaveAttribute('height', '240');
  });
});
