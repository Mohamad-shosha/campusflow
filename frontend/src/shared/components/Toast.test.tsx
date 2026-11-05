import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast Component', () => {
  it('renders title and message correctly', () => {
    render(<Toast title="نجاح العملية" message="تم تفعيل قارئ البوابة بنجاح" type="success" />);

    expect(screen.getByText('نجاح العملية')).toBeInTheDocument();
    expect(screen.getByText('تم تفعيل قارئ البوابة بنجاح')).toBeInTheDocument();
    expect(screen.getByTestId('fbsu-toast')).toHaveClass('fbsu-toast-success');
  });

  it('calls onClose when close button is clicked', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="رصيدك غير كافٍ" type="error" onClose={onClose} />);

    const closeBtn = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeBtn);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
