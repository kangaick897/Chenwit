import { Mail, MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export function StickyContact() {
  return (
    <div className="sticky-contact" aria-label="ช่องทางติดต่อด่วน">
      <a href={`tel:${siteConfig.contact.phone}`} aria-label="โทรหาเรา" title="โทรหาเรา">
        <Phone size={18} strokeWidth={1.5} />
      </a>
      <a
        href={siteConfig.contact.lineUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="ติดต่อผ่าน Line"
        title="ติดต่อผ่าน Line"
      >
        <MessageCircle size={18} strokeWidth={1.5} />
      </a>
      <a href={`mailto:${siteConfig.contact.email}`} aria-label="ส่งอีเมล" title="ส่งอีเมล">
        <Mail size={18} strokeWidth={1.5} />
      </a>
    </div>
  );
}
