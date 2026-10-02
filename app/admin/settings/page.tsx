import type { Metadata } from "next";
import { Building2, Clock, ExternalLink, Mail, MapPin, MessageCircle, Palette, Phone, Save, Share2 } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "ตั้งค่าข้อมูลบริษัทและช่องทางติดต่อ",
};

export default function AdminSettingsPage() {
  const themeFields = [
    { key: "navy", label: "สีกรม / ตัวอักษรหลัก", value: siteConfig.theme.navy },
    { key: "gold", label: "สีทอง / Accent", value: siteConfig.theme.gold },
    { key: "ivory", label: "สีพื้นขาว", value: siteConfig.theme.ivory },
    { key: "cream", label: "สีพื้นรอง", value: siteConfig.theme.cream },
    { key: "taupe", label: "สีน้ำตาลเทา", value: siteConfig.theme.taupe },
    { key: "grayBeige", label: "สีเส้นขอบ", value: siteConfig.theme.grayBeige },
    { key: "charcoal", label: "สีปุ่มหลัก", value: siteConfig.theme.charcoal },
  ];

  return (
    <AdminShell
      active="settings"
      title="ตั้งค่าเว็บ"
      description="ข้อมูลบริษัท ช่องทางติดต่อ และสีธีมที่ต้องปรับได้เมื่อขายให้ลูกค้าหลายเจ้า"
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

        <form className="admin-form-panel">
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

          <div className="admin-form-grid two-cols">
            <label>
              <span>เบอร์โทร</span>
              <span className="admin-field-icon">
                <Phone size={16} strokeWidth={1.8} />
                <input defaultValue={siteConfig.contact.phone} />
              </span>
            </label>

            <label>
              <span>อีเมล</span>
              <span className="admin-field-icon">
                <Mail size={16} strokeWidth={1.8} />
                <input defaultValue={siteConfig.contact.email} />
              </span>
            </label>
          </div>

          <label>
            <span>Line ID</span>
            <span className="admin-field-icon">
              <MessageCircle size={16} strokeWidth={1.8} />
              <input defaultValue={siteConfig.contact.lineId} />
            </span>
          </label>

          <label>
            <span>Line URL</span>
            <span className="admin-field-icon">
              <ExternalLink size={16} strokeWidth={1.8} />
              <input defaultValue={siteConfig.contact.lineUrl} />
            </span>
          </label>

          <div className="admin-form-grid two-cols">
            <label>
              <span>Facebook URL</span>
              <span className="admin-field-icon">
                <Share2 size={16} strokeWidth={1.8} />
                <input defaultValue={siteConfig.contact.facebook} />
              </span>
            </label>

            <label>
              <span>ชื่อที่แสดงบน Facebook</span>
              <input defaultValue={siteConfig.contact.facebookLabel} />
            </label>
          </div>

          <label>
            <span>ชื่อสำนักงาน</span>
            <span className="admin-field-icon">
              <Building2 size={16} strokeWidth={1.8} />
              <input defaultValue={siteConfig.contact.officeTitle} />
            </span>
          </label>

          <label>
            <span>ที่อยู่สำนักงาน</span>
            <textarea defaultValue={siteConfig.contact.address} rows={3} />
          </label>

          <label>
            <span>วันทำการ</span>
            <span className="admin-field-icon align-start">
              <Clock size={16} strokeWidth={1.8} />
              <textarea defaultValue={siteConfig.contact.businessHours.join("\n")} rows={3} />
            </span>
          </label>
        </form>

        <form className="admin-form-panel admin-settings-wide">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Theme</p>
              <h2>สีธีมเว็บ</h2>
            </div>
            <Palette size={22} strokeWidth={1.7} />
          </div>

          <div className="admin-theme-grid">
            {themeFields.map((field) => (
              <label className="admin-theme-field" key={field.key}>
                <span>{field.label}</span>
                <div className="admin-color-control">
                  <input type="color" defaultValue={field.value} aria-label={`${field.label} color`} />
                  <input defaultValue={field.value} aria-label={`${field.label} hex`} />
                </div>
              </label>
            ))}
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
