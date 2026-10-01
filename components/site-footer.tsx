import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-brand-name">{siteConfig.companyName}</p>
            <p className="footer-brand-subtitle">{siteConfig.brandSubtitle}</p>
            <p className="footer-copy">
              {siteConfig.tagline}. ออกแบบและสร้างบ้านด้วยความใส่ใจในทุกรายละเอียด
            </p>
          </div>
          <div>
            <p className="footer-title">Explore</p>
            <nav className="footer-links" aria-label="เมนูส่วนท้าย">
              {siteConfig.navigation.slice(1, 5).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="footer-title">Contact</p>
            <div className="footer-links">
              <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              <span>{siteConfig.contact.address}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.companyName}</span>
          <span>House Design / Construction</span>
        </div>
      </div>
    </footer>
  );
}
