import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "เข้าสู่ระบบหลังบ้านสำหรับจัดการข้อมูลเว็บไซต์",
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <div className="admin-login-brand">
          <Image
            src={siteConfig.logoBanner}
            alt={siteConfig.companyName}
            width={260}
            height={86}
            priority
          />
        </div>

        <div className="admin-login-copy">
          <p className="admin-eyebrow">Admin Console</p>
          <h1 id="admin-login-title">เข้าสู่ระบบหลังบ้าน</h1>
          <p>สำหรับแก้แบบบ้าน ผลงาน รูปภาพ และข้อมูลติดต่อของเว็บไซต์</p>
        </div>

        <form className="admin-login-form">
          <label>
            <span>อีเมล</span>
            <span className="admin-input-wrap">
              <Mail size={17} strokeWidth={1.8} />
              <input type="email" placeholder="admin@chenwit.com" autoComplete="email" />
            </span>
          </label>

          <label>
            <span>รหัสผ่าน</span>
            <span className="admin-input-wrap">
              <LockKeyhole size={17} strokeWidth={1.8} />
              <input type="password" placeholder="••••••••" autoComplete="current-password" />
            </span>
          </label>

          <Link className="admin-login-submit" href="/admin/dashboard">
            เข้าสู่หลังบ้านตัวอย่าง
          </Link>
        </form>

        <div className="admin-login-note">
          <ShieldCheck size={18} strokeWidth={1.8} />
          ตอนนี้เป็นหน้า prototype ก่อนต่อ Supabase Auth จริง
        </div>
      </section>
    </main>
  );
}

