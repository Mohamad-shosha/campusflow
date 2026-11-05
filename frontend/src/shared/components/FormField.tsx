import { FC, ReactNode } from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  testId?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className = '',
  testId = 'form-field',
}) => {
  return (
    <div className={`form-group ${className}`.trim()} data-testid={testId} style={{ marginBottom: '1rem' }}>
      <label
        htmlFor={htmlFor}
        className="form-label"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '0.35rem',
        }}
      >
        <span>{label}</span>
        {required && <span style={{ color: '#f43f5e' }}>*</span>}
      </label>

      {children}

      {hint && !error && (
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'block',
          }}
          data-testid={`${testId}-hint`}
        >
          {hint}
        </span>
      )}

      {error && (
        <span
          role="alert"
          style={{
            color: '#f43f5e',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'block',
            fontWeight: 600,
          }}
          data-testid={`${testId}-error`}
        >
          {error}
        </span>
      )}
    </div>
  );
};
