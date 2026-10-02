import { Building2, Clock, Mail, MessageCircle, Phone, Share2 } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อทีมออกแบบและสร้างบ้านเพื่อเริ่มต้นพูดคุย",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  const { contact } = settings;

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="page-hero contact-hero">
          <div className="container">
            <p className="eyebrow">{settings.companyName}</p>
            <h1>เรายินดีให้คำปรึกษา ติดต่อสอบถามเรา</h1>
            <p>Contact us</p>
          </div>
        </section>

        <section className="contact-info-section">
          <div className="container contact-info-grid">
            <div className="contact-office">
              <div>
                <Building2 size={26} strokeWidth={1.5} />
                <h2>{contact.officeTitle}</h2>
                <p>{contact.address}</p>
              </div>
              <div>
                <Clock size={26} strokeWidth={1.5} />
                <h2>วันทำการ</h2>
                <p>
                  {contact.businessHours.map((line, index) => (
                    <span key={line}>
                      {line}
                      {index < contact.businessHours.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="contact-details contact-details-list">
              <div className="contact-item">
                <Phone size={21} strokeWidth={1.4} />
                <div>
                  <strong>โทร:</strong>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              </div>
              <div className="contact-item">
                <MessageCircle size={21} strokeWidth={1.4} />
                <div>
                  <strong>Line:</strong>
                  <a href={contact.lineUrl} target="_blank" rel="noreferrer">
                    {contact.lineId}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={21} strokeWidth={1.4} />
                <div>
                  <strong>อีเมล:</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <Share2 size={21} strokeWidth={1.4} />
                <div>
                  <strong>Facebook:</strong>
                  <a href={contact.facebook} target="_blank" rel="noreferrer">
                    {contact.facebookLabel}
                  </a>
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
