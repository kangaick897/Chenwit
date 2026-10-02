import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getPublicSiteSettings } from "@/lib/site-settings";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-brand-name">{settings.companyName}</p>
            <p className="footer-brand-subtitle">{siteConfig.brandSubtitle}</p>
            <p className="footer-copy">
              {settings.tagline}. ออกแบบและสร้างบ้านด้วยความใส่ใจในทุกรายละเอียด
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
              <a href={`tel:${settings.contact.phone}`}>{settings.contact.phone}</a>
              <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a>
              <span>{settings.contact.address}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.companyName}</span>
          <span>House Design / Construction</span>
        </div>
      </div>
    </footer>
  );
}
