import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface FooterProps {
  onTabChange?: ((tab: string) => void) | undefined;
}

export const Footer: FC<FooterProps> = ({ onTabChange }) => {
  const { t } = useTranslation();

  const handleNavClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="main-footer" data-testid="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <img
                src="/assets/branding/fbsu-logo.png"
                style={{ height: '40px' }}
                alt="FBSU Logo"
              />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                {t('common.universityName')}
              </h4>
            </div>
            <p
              style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#e2e8f0', maxWidth: '380px' }}
            >
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {t('footer.collegesTitle')}
            </h5>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                fontSize: '0.85rem',
              }}
            >
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/computing-college"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.computingCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/engineering-college"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.engineeringCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.businessCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Medicine"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.medicineCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.sciencesCollege')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {t('footer.linksTitle')}
            </h5>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                fontSize: '0.85rem',
              }}
            >
              <li>
                <a
                  href="#booking"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('booking');
                    }
                  }}
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.bookPass')}
                </a>
              </li>
              <li>
                <a
                  href="#simulator"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('simulator');
                    }
                  }}
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.flexSim')}
                </a>
              </li>
              <li>
                <a
                  href="#wallet"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('wallet');
                    }
                  }}
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.walletAndFees')}
                </a>
              </li>
              <li>
                <a
                  href="#gate"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('gate');
                    }
                  }}
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.alprGates')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#e2e8f0' }}
                >
                  {t('footer.officialPortal')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {t('footer.contactTitle')}
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
              {t('footer.address')}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
              {t('footer.phone')}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{t('footer.email')}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>{t('footer.copyright')}</div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.institutionalContact')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
