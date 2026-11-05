import { FC } from 'react';

export interface FooterProps {
  isAr: boolean;
}

export const Footer: FC<FooterProps> = ({ isAr }) => {
  return (
    <footer className="main-footer" data-testid="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img
                src="/assets/branding/fbsu-logo.png"
                style={{ height: '40px' }}
                alt="FBSU Logo"
              />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                {isAr ? 'جامعة فهد بن سلطان' : 'Fahad Bin Sultan University'}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: '#e2e8f0', maxWidth: '380px' }}>
              {isAr
                ? 'منظومة المواقف الذكية التفاعلية بالذكاء الاصطناعي وإنترنت الأشياء. صُممت خصيصاً لتواكب رؤية المملكة 2030 وتوفر تجربة تنقل أكاديمية فائقة الذكاء لطلاب ومنسوبي الجامعة في تبوك.'
                : 'Intelligent IoT & AI parking management engineered for Fahad Bin Sultan University in Tabuk, aligned with Saudi Vision 2030.'}
            </p>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {isAr ? 'كليات الجامعة' : 'University Colleges'}
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
              <li>
                <a href="https://fbsu.edu.sa/Ar/All/computing-college" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>
                  {isAr ? 'كلية الحاسب الآلي' : 'College of Computing'}
                </a>
              </li>
              <li>
                <a href="https://fbsu.edu.sa/Ar/All/engineering-college" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>
                  {isAr ? 'كلية الهندسة' : 'College of Engineering'}
                </a>
              </li>
              <li>
                <a href="https://fbsu.edu.sa/Ar/All/College-of-Business-and-Management" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>
                  {isAr ? 'كلية الأعمال والإدارة' : 'College of Business'}
                </a>
              </li>
              <li>
                <a href="https://fbsu.edu.sa/Ar/All/College-of-Medicine" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>
                  {isAr ? 'كلية الطب' : 'College of Medicine'}
                </a>
              </li>
              <li>
                <a href="https://fbsu.edu.sa/Ar/All/College-of-Sciences-and-Humanities" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>
                  {isAr ? 'كلية العلوم والدراسات الإنسانية' : 'Sciences & Humanities'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {isAr ? 'روابط المنظومة' : 'Platform Links'}
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
              <li><a href="#booking" style={{ color: '#e2e8f0' }}>{isAr ? 'حجز تصريح مواقف' : 'Book Parking Pass'}</a></li>
              <li><a href="#simulator" style={{ color: '#e2e8f0' }}>{isAr ? 'محاكاة التبادل الذكي' : 'Flex Swap Simulator'}</a></li>
              <li><a href="#wallet" style={{ color: '#e2e8f0' }}>{isAr ? 'المحفظة الجامعية والاشتراكات' : 'Campus Wallet & Tuition'}</a></li>
              <li><a href="#gate" style={{ color: '#e2e8f0' }}>{isAr ? 'بوابات ALPR والتحقق التلقائي' : 'ALPR Automated Gates'}</a></li>
              <li><a href="https://fbsu.edu.sa" target="_blank" rel="noreferrer" style={{ color: '#e2e8f0' }}>{isAr ? 'بوابة الجامعة الرسمية' : 'FBSU Official Portal'}</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
              {isAr ? 'موقع الجامعة والتواصل' : 'Location & Contact'}
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
              {isAr ? 'طريق الملك خالد، تبوك 47721، المملكة العربية السعودية' : 'King Khalid Road, Tabuk 47721, Saudi Arabia'}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
              {isAr ? 'هاتف: 2500 425 14 966+' : 'Tel: +966 14 425 2500'}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
              info@fbsu.edu.sa
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 {isAr ? 'جميع الحقوق محفوظة - جامعة فهد بن سلطان (منظومة المواقف والخدمات الذكية)' : 'All rights reserved - Fahad Bin Sultan University (FBSU Smart Campus)'}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span>{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
            <span>{isAr ? 'الاتصال المؤسسي' : 'Institutional Contact'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

