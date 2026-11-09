import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface FooterProps {
  onTabChange?: ((tab: string) => void) | undefined;
}

const COLLEGE_LINKS: { key: string; href: string }[] = [
  { key: 'footer.computingCollege', href: 'https://fbsu.edu.sa/Ar/All/computing-college' },
  { key: 'footer.engineeringCollege', href: 'https://fbsu.edu.sa/Ar/All/engineering-college' },
  {
    key: 'footer.businessCollege',
    href: 'https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management',
  },
  { key: 'footer.medicineCollege', href: 'https://fbsu.edu.sa/Ar/All/College-of-Medicine' },
  {
    key: 'footer.sciencesCollege',
    href: 'https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities',
  },
];

export const Footer: FC<FooterProps> = ({ onTabChange }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language ? i18n.language.startsWith('ar') : true;

  const go = (tab: string) => {
    if (!onTabChange) return;
    onTabChange(tab);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const serviceLinks: { tab: string; label: string }[] = [
    { tab: 'map', label: isAr ? 'خريطة المواقف' : 'Parking map' },
    { tab: 'booking', label: t('footer.bookPass') },
    { tab: 'share', label: isAr ? 'التبادل الذكي' : 'Flex Share' },
    { tab: 'tutoring', label: isAr ? 'الشروحات الطلابية' : 'Peer tutoring' },
    { tab: 'rooms', label: isAr ? 'المعامل والقاعات' : 'Labs & study rooms' },
    { tab: 'wallet', label: t('footer.walletAndFees') },
  ];

  return (
    <footer className="main-footer" data-testid="main-footer">
      <div className="container">
        <div className="cf-footer__grid">
          <div>
            <div className="cf-footer__brand">
              <img src="/assets/branding/fbsu-logo.png" alt="FBSU" />
              <strong>{t('common.universityName')}</strong>
            </div>
            <p className="cf-footer__desc">{t('footer.description')}</p>
          </div>

          <nav aria-label={t('footer.linksTitle')}>
            <h5>{t('footer.linksTitle')}</h5>
            <ul className="cf-footer__links">
              {serviceLinks.map(link => (
                <li key={link.tab}>
                  <a
                    href={`#${link.tab}`}
                    onClick={e => {
                      if (onTabChange) {
                        e.preventDefault();
                        go(link.tab);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h5>{t('footer.collegesTitle')}</h5>
            <ul className="cf-footer__links">
              {COLLEGE_LINKS.map(link => (
                <li key={link.key}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {t(link.key)}
                  </a>
                </li>
              ))}
              <li>
                <a href="https://fbsu.edu.sa" target="_blank" rel="noreferrer">
                  {t('footer.officialPortal')}
                </a>
              </li>
            </ul>
          </div>

          <div className="cf-footer__contact">
            <h5>{t('footer.contactTitle')}</h5>
            <p>{t('footer.address')}</p>
            <p dir="ltr" style={{ textAlign: 'start' }}>
              {t('footer.phone')}
            </p>
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
