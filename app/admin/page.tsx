import type { Metadata } from "next";
import Image from "next/image";
import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

import { loginAdmin } from "@/app/admin/actions";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "เข้าสู่ระบบหลังบ้านสำหรับจัดการข้อมูลเว็บไซต์",
};

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessageByCode: Record<string, string> = {
  invalid: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  missing: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
  unauthorized: "บัญชีนี้ยังไม่ได้รับสิทธิ์เข้าใช้งานหลังบ้าน",
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error ? errorMessageByCode[params.error] : null;

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

        <form className="admin-login-form" action={loginAdmin}>
          <input type="hidden" name="next" value={params?.next ?? "/admin/dashboard"} />
          <label>
            <span>ชื่อผู้ใช้</span>
            <span className="admin-input-wrap">
              <UserRound size={17} strokeWidth={1.8} />
              <input name="username" type="text" placeholder="อีเมลผู้ดูแลระบบ" autoComplete="username" />
            </span>
          </label>

          <label>
            <span>รหัสผ่าน</span>
            <span className="admin-input-wrap">
              <LockKeyhole size={17} strokeWidth={1.8} />
              <input name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            </span>
          </label>

          {errorMessage ? <p className="admin-login-error">{errorMessage}</p> : null}

          <button className="admin-login-submit" type="submit">
            เข้าสู่หลังบ้าน
          </button>
        </form>

        <div className="admin-login-note">
          <ShieldCheck size={18} strokeWidth={1.8} />
          เชื่อมต่อ Supabase Auth และตรวจสิทธิ์แอดมินแล้ว
        </div>
      </section>
    </main>
  );
}
