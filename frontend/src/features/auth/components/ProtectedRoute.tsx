import { FC, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../../../shared/types/auth';

export interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requiredRoles?: Role[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          color: 'var(--text-muted)',
        }}
        data-testid="auth-loading"
      >
        <span>جاري التحقق من هوية الدخول...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div
        className="glass-panel"
        style={{ padding: '2rem', textAlign: 'center', margin: '2rem auto', maxWidth: '480px' }}
        data-testid="auth-required"
      >
        <h3 style={{ color: 'var(--status-occupied)', marginBottom: '0.5rem' }}>
          تسجيل الدخول مطلوب
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          يجب تسجيل الدخول بالرقم الجامعي أو البريد للوصول إلى هذا القسم.
        </p>
      </div>
    );
  }

  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <div
        className="glass-panel"
        style={{ padding: '2rem', textAlign: 'center', margin: '2rem auto', maxWidth: '480px' }}
        data-testid="auth-forbidden"
      >
        <h3 style={{ color: 'var(--gold-text)', marginBottom: '0.5rem' }}>صلاحية غير كافية</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          حسابك الحالي لا يمتلك الصلاحيات المطلوبة لعرض هذا المورد.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
