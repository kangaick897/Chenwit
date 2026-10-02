import type { Metadata } from "next";
import { Building2, Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone, Save, Share2 } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { saveAdminSettings } from "@/app/admin/actions";
import { siteConfig } from "@/config/site";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "ตั้งค่าข้อมูลบริษัทและช่องทางติดต่อ",
};

type AdminSettingsPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

type ContactSettings = {
  officeTitle?: string;
  phone?: string;
  lineId?: string;
  lineUrl?: string;
  email?: string;
  facebook?: string;
  facebookLabel?: string;
  address?: string;
  businessHours?: string[];
};

type SeoSettings = {
  description?: string;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("company_name, tagline, contact, seo")
    .eq("id", "default")
    .maybeSingle();

  const contact = (settings?.contact ?? siteConfig.contact) as ContactSettings;
  const seo = (settings?.seo ?? siteConfig.seo) as SeoSettings;
  const companyName = settings?.company_name ?? siteConfig.companyName;
  const tagline = settings?.tagline ?? siteConfig.tagline;
  const businessHours = contact.businessHours ?? [...siteConfig.contact.businessHours];

  return (
    <AdminShell
      active="settings"
      title="ตั้งค่าเว็บ"
      description="ข้อมูลบริษัท ช่องทางติดต่อ และรายละเอียดหลักที่จะแสดงบนหน้าเว็บไซต์"
    >
      {params?.saved ? <p className="admin-form-status is-success">บันทึกข้อมูลตั้งค่าเว็บแล้ว</p> : null}
      {params?.error === "save" ? <p className="admin-form-status is-error">บันทึกไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่แล้วลองอีกครั้ง</p> : null}

      <form className="admin-settings-grid" action={saveAdminSettings}>
        <section className="admin-form-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Company</p>
              <h2>ข้อมูลบริษัท</h2>
            </div>
          </div>

          <label>
            <span>ชื่อบริษัท</span>
            <input name="companyName" defaultValue={companyName} />
          </label>

          <label>
            <span>คำโปรย</span>
            <input name="tagline" defaultValue={tagline} />
          </label>

          <label>
            <span>คำอธิบาย SEO</span>
            <textarea name="seoDescription" defaultValue={seo.description ?? siteConfig.seo.description} rows={4} />
          </label>

          <button type="submit" className="admin-primary-button">
            <Save size={16} strokeWidth={1.8} />
            บันทึกการตั้งค่า
          </button>
        </section>

        <section className="admin-form-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Contact</p>
              <h2>ช่องทางติดต่อ</h2>
            </div>
          </div>

          <div className="admin-contact-preview">
            <span>
              <Phone size={17} strokeWidth={1.8} />
              {contact.phone ?? siteConfig.contact.phone}
            </span>
            <span>
              <Mail size={17} strokeWidth={1.8} />
              {contact.email ?? siteConfig.contact.email}
            </span>
            <span>
              <MapPin size={17} strokeWidth={1.8} />
              {contact.address ?? siteConfig.contact.address}
            </span>
          </div>

          <div className="admin-form-grid two-cols">
            <label>
              <span>เบอร์โทร</span>
              <span className="admin-field-icon">
                <Phone size={16} strokeWidth={1.8} />
                <input name="phone" defaultValue={contact.phone ?? siteConfig.contact.phone} />
              </span>
            </label>

            <label>
              <span>อีเมล</span>
              <span className="admin-field-icon">
                <Mail size={16} strokeWidth={1.8} />
                <input name="email" defaultValue={contact.email ?? siteConfig.contact.email} />
              </span>
            </label>
          </div>

          <label>
            <span>Line ID</span>
            <span className="admin-field-icon">
              <MessageCircle size={16} strokeWidth={1.8} />
              <input name="lineId" defaultValue={contact.lineId ?? siteConfig.contact.lineId} />
            </span>
          </label>

          <label>
            <span>Line URL</span>
            <span className="admin-field-icon">
              <ExternalLink size={16} strokeWidth={1.8} />
              <input name="lineUrl" defaultValue={contact.lineUrl ?? siteConfig.contact.lineUrl} />
            </span>
          </label>

          <div className="admin-form-grid two-cols">
            <label>
              <span>Facebook URL</span>
              <span className="admin-field-icon">
                <Share2 size={16} strokeWidth={1.8} />
                <input name="facebook" defaultValue={contact.facebook ?? siteConfig.contact.facebook} />
              </span>
            </label>

            <label>
              <span>ชื่อที่แสดงบน Facebook</span>
              <input name="facebookLabel" defaultValue={contact.facebookLabel ?? siteConfig.contact.facebookLabel} />
            </label>
          </div>

          <label>
            <span>ชื่อสำนักงาน</span>
            <span className="admin-field-icon">
              <Building2 size={16} strokeWidth={1.8} />
              <input name="officeTitle" defaultValue={contact.officeTitle ?? siteConfig.contact.officeTitle} />
            </span>
          </label>

          <label>
            <span>ที่อยู่สำนักงาน</span>
            <textarea name="address" defaultValue={contact.address ?? siteConfig.contact.address} rows={3} />
          </label>

          <label>
            <span>วันทำการ</span>
            <span className="admin-field-icon align-start">
              <Clock size={16} strokeWidth={1.8} />
              <textarea name="businessHours" defaultValue={businessHours.join("\n")} rows={3} />
            </span>
          </label>
        </section>
      </form>
    </AdminShell>
  );
}
