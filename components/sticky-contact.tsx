import { Mail, MessageCircle, Phone } from "lucide-react";

import { getPublicSiteSettings } from "@/lib/site-settings";

export async function StickyContact() {
  const { contact } = await getPublicSiteSettings();

  return (
    <div className="sticky-contact" aria-label="ช่องทางติดต่อด่วน">
      <a href={`tel:${contact.phone}`} aria-label="โทรหาเรา" title="โทรหาเรา">
        <Phone size={18} strokeWidth={1.5} />
      </a>
      <a
        href={contact.lineUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="ติดต่อผ่าน Line"
        title="ติดต่อผ่าน Line"
      >
        <MessageCircle size={18} strokeWidth={1.5} />
      </a>
      <a href={`mailto:${contact.email}`} aria-label="ส่งอีเมล" title="ส่งอีเมล">
        <Mail size={18} strokeWidth={1.5} />
      </a>
    </div>
  );
}
