import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface FooterProps {
  onTabChange?: ((tab: string) => void) | undefined;
}

export const Footer: FC<FooterProps> = ({ onTabChange }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language ? i18n.language.startsWith('ar') : true;

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
            <div className="footer-brand-row">
              <img src="/assets/branding/fbsu-logo.png" alt="FBSU Logo" />
              <h4>{t('common.universityName')}</h4>
            </div>
            <p className="footer-desc">{t('footer.description')}</p>
          </div>

          <div>
            <h5>{t('footer.collegesTitle')}</h5>
            <ul className="footer-links">
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/computing-college"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('footer.computingCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/engineering-college"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('footer.engineeringCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('footer.businessCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Medicine"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('footer.medicineCollege')}
                </a>
              </li>
              <li>
                <a
                  href="https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('footer.sciencesCollege')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5>{t('footer.linksTitle')}</h5>
            <ul className="footer-links">
              <li>
                <a
                  href="#booking"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('booking');
                    }
                  }}
                >
                  {t('footer.bookPass')}
                </a>
              </li>
              <li>
                <a
                  href="#share"
                  onClick={e => {
                    if (onTabChange) {
                      e.preventDefault();
                      handleNavClick('share');
                    }
                  }}
                >
                  {isAr ? 'منظومة التبادل الذكي Flex Share' : 'AI Flex Share'}
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
                >
                  {t('footer.alprGates')}
                </a>
              </li>
              <li>
                <a href="https://fbsu.edu.sa" target="_blank" rel="noreferrer">
                  {t('footer.officialPortal')}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h5>{t('footer.contactTitle')}</h5>
            <p>{t('footer.address')}</p>
            <p>{t('footer.phone')}</p>
            <p>{t('footer.email')}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>{t('footer.copyright')}</div>
          <div className="footer-legal-links">
            <span>{t('footer.privacy')}</span>
            <span>{t('footer.terms')}</span>
            <span>{t('footer.institutionalContact')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
