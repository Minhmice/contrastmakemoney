import { ContrastLogo } from '@/components/brand/ContrastLogo'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div>
          <a className="footer-brand" href="#top">
            <ContrastLogo variant="wordmark-dark" className="brand-logo brand-logo--footer" />
          </a>
          <p>KIÊN TRÌ — KỶ LUẬT</p>
        </div>
        <div className="footer-links">
          <div>
            <span>KHÁM PHÁ</span>
            <a href="#space">KHÔNG GIAN</a>
            <a href="/menu">MENU</a>
            <a href="#locations">CƠ SỞ</a>
          </div>
          <div>
            <span>KẾT NỐI</span>
            <span className="footer-placeholder">SOCIAL LINKS / VERIFIED SOON</span>
          </div>
        </div>
        <div className="footer-red-block">
          CONTRAST
          <br />
          COFFEE
          <br />
          <span>24H</span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© CONTRAST COFFEE</span>
        <span>[LEGAL / PRIVACY IF REQUIRED]</span>
        <span>HỒ CHÍ MINH CITY / VIỆT NAM</span>
      </div>
    </footer>
  )
}
