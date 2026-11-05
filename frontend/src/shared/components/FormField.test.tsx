import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField Component', () => {
  it('renders label and children input', () => {
    render(
      <FormField label="University ID" htmlFor="uniId">
        <input id="uniId" placeholder="Enter ID" />
      </FormField>
    );

    expect(screen.getByText('University ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ID')).toBeInTheDocument();
  });

  it('renders required indicator when required is true', () => {
    render(
      <FormField label="Password" required>
        <input type="password" />
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders error message with alert role', () => {
    render(
      <FormField label="Email" error="Invalid institutional email">
        <input type="email" />
      </FormField>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid institutional email');
  });

  it('renders hint text when provided and no error exists', () => {
    render(
      <FormField label="Phone" hint="Saudi mobile starting with 05">
        <input type="tel" />
      </FormField>
    );

    expect(screen.getByTestId('form-field-hint')).toHaveTextContent('Saudi mobile starting with 05');
  });
});
