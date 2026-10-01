import type { Metadata } from "next";
import { Mail, MapPin, Phone, Save } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "ตั้งค่าข้อมูลบริษัทและช่องทางติดต่อ",
};

export default function AdminSettingsPage() {
  return (
    <AdminShell
      active="settings"
      title="ตั้งค่าเว็บ"
      description="ข้อมูลบริษัท ช่องทางติดต่อ โลโก้ และข้อความหลักที่จะแสดงบนเว็บไซต์"
    >
      <section className="admin-settings-grid">
        <form className="admin-form-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Company</p>
              <h2>ข้อมูลบริษัท</h2>
            </div>
          </div>

          <label>
            <span>ชื่อบริษัท</span>
            <input defaultValue={siteConfig.companyName} />
          </label>

          <label>
            <span>คำโปรย</span>
            <input defaultValue={siteConfig.tagline} />
          </label>

          <label>
            <span>คำอธิบาย SEO</span>
            <textarea defaultValue={siteConfig.seo.description} rows={4} />
          </label>

          <button type="button" className="admin-primary-button">
            <Save size={16} strokeWidth={1.8} />
            บันทึกฉบับร่าง
          </button>
        </form>

        <div className="admin-form-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Contact</p>
              <h2>ช่องทางติดต่อ</h2>
            </div>
          </div>

          <div className="admin-contact-preview">
            <span>
              <Phone size={17} strokeWidth={1.8} />
              {siteConfig.contact.phone}
            </span>
            <span>
              <Mail size={17} strokeWidth={1.8} />
              {siteConfig.contact.email}
            </span>
            <span>
              <MapPin size={17} strokeWidth={1.8} />
              {siteConfig.contact.address}
            </span>
          </div>

          <label>
            <span>Line ID</span>
            <input defaultValue={siteConfig.contact.lineId} />
          </label>

          <label>
            <span>วันทำการ</span>
            <input defaultValue="จันทร์-เสาร์ 08.30-17.30" />
          </label>
        </div>
      </section>
    </AdminShell>
  );
}

