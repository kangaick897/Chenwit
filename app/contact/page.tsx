import { Building2, Clock, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อทีมออกแบบและสร้างบ้านเพื่อเริ่มต้นพูดคุย",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="page-hero contact-hero">
          <div className="container">
            <p className="eyebrow">{siteConfig.companyName}</p>
            <h1>เรายินดีให้คำปรึกษา ติดต่อสอบถามเรา</h1>
            <p>Contact us</p>
          </div>
        </section>

        <section className="contact-info-section">
          <div className="container contact-info-grid">
            <div className="contact-office">
              <div>
                <Building2 size={26} strokeWidth={1.5} />
                <h2>สำนักงานใหญ่</h2>
                <p>{siteConfig.contact.address}</p>
              </div>
              <div>
                <Clock size={26} strokeWidth={1.5} />
                <h2>วันทำการ</h2>
                <p>
                  วันจันทร์-วันเสาร์ ให้บริการตั้งแต่ 08.30-17.30
                  <br />
                  วันอาทิตย์ นัดหมายล่วงหน้า
                </p>
              </div>
            </div>

            <div className="contact-details contact-details-list">
              <div className="contact-item">
                <Phone size={21} strokeWidth={1.4} />
                <div>
                  <strong>โทร:</strong>
                  <a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
                </div>
              </div>
              <div className="contact-item">
                <MessageCircle size={21} strokeWidth={1.4} />
                <div>
                  <strong>Line:</strong>
                  <a href={siteConfig.contact.lineUrl} target="_blank" rel="noreferrer">
                    {siteConfig.contact.lineId}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={21} strokeWidth={1.4} />
                <div>
                  <strong>อีเมล:</strong>
                  <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <Share2 size={21} strokeWidth={1.4} />
                <div>
                  <strong>Facebook:</strong>
                  <a href={siteConfig.contact.facebook} target="_blank" rel="noreferrer">
                    CHENWIT HOUSE BUILDER
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={21} strokeWidth={1.4} />
                <div>
                  <strong>พื้นที่ให้บริการ:</strong>
                  <span>{siteConfig.contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
