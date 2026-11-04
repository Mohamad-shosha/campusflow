import React, { useState } from 'react';

export interface AppProps {
  initialTitle?: string;
}

export const App: React.FC<AppProps> = ({
  initialTitle = 'منظومة الحرم الجامعي والمواقف الذكية - جامعة فهد بن سلطان',
}) => {
  const [counter, setCounter] = useState(0);

  return (
    <main
      style={{
        padding: '2rem',
        fontFamily: 'Tajawal, sans-serif',
        textAlign: 'center',
        direction: 'rtl',
      }}
    >
      <header>
        <h1 style={{ color: '#116E63', marginBottom: '0.5rem' }}>{initialTitle}</h1>
        <p style={{ color: '#d7a237', fontWeight: 'bold' }}>
          FBSU Smart Campus & Parking System (React + TypeScript)
        </p>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <p>مرحباً بك في المنظومة الأكاديمية الذكية.</p>
        <button
          onClick={() => setCounter(c => c + 1)}
          style={{
            background: '#116E63',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          العداد التفاعلي: {counter}
        </button>
      </section>
    </main>
  );
};
