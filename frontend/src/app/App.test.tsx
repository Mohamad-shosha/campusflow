import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  it('renders university title correctly in Arabic', () => {
    render(<App />);
    expect(
      screen.getByText('منظومة الحرم الجامعي والمواقف الذكية - جامعة فهد بن سلطان')
    ).toBeInTheDocument();
    expect(
      screen.getByText('FBSU Smart Campus & Parking System (React + TypeScript)')
    ).toBeInTheDocument();
  });

  it('increments counter when button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /العداد التفاعلي: 0/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /العداد التفاعلي: 1/i })).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /العداد التفاعلي: 2/i })).toBeInTheDocument();
  });
});
