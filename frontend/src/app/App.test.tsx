import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App & AppShell Layout Tests', () => {
  it('renders top ribbon, header and footer properly', () => {
    render(<App initialLang="ar" initialTab="map" />);

    expect(screen.getByTestId('top-ribbon')).toBeInTheDocument();
    expect(screen.getByTestId('main-header')).toBeInTheDocument();
    expect(screen.getByTestId('main-footer')).toBeInTheDocument();

    // Check brand name in header and footer
    const brandOccurrences = screen.getAllByText('جامعة فهد بن سلطان');
    expect(brandOccurrences.length).toBeGreaterThanOrEqual(1);
  });

  it('switches language between Arabic and English when toggle is clicked', () => {
    render(<App initialLang="ar" />);

    const langToggleBtn = screen.getByTitle('Switch to English');
    fireEvent.click(langToggleBtn);

    expect(screen.getByText('Smart Campus & ALPR Vision Platform')).toBeInTheDocument();
  });

  it('changes active tab when quick navigation buttons are clicked', () => {
    render(<App initialLang="en" initialTab="map" />);

    expect(screen.getByText(/Current Active View: \[map\]/i)).toBeInTheDocument();

    const bookPermitBtn = screen.getByRole('button', { name: /Book Permit/i });
    fireEvent.click(bookPermitBtn);

    expect(screen.getByText(/Current Active View: \[booking\]/i)).toBeInTheDocument();
  });
});
