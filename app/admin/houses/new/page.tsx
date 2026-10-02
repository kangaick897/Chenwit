import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { HouseCreateForm } from "@/app/admin/houses/_components/house-create-form";

type AdminHouseNewPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Add House",
  description: "เพิ่มแบบบ้านใหม่ในหลังบ้าน",
};

const errorMessages: Record<string, string> = {
  cover: "กรุณาเลือกรูปหน้าปกก่อนสร้างแบบบ้าน",
  missing: "กรุณากรอกชื่อและรหัสแบบบ้าน",
  save: "สร้างแบบบ้านไม่สำเร็จ กรุณาลองอีกครั้ง",
  upload: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
};

export default async function AdminHouseNewPage({ searchParams }: AdminHouseNewPageProps) {
  const query = await searchParams;
  const errorMessage = query?.error ? errorMessages[query.error] : null;

  return (
    <AdminShell
      active="houses"
      eyebrow="House Editor"
      title="เพิ่มแบบบ้าน"
      description="สร้างแบบบ้านใหม่ อัปโหลดรูปหน้าปก แล้วเข้าไปเติมรูปแปลนและรายละเอียดเพิ่มเติมต่อ"
    >
      <div className="admin-detail-actions">
        <Link className="admin-secondary-button" href="/admin/houses">
          <ArrowLeft size={16} strokeWidth={1.8} />
          กลับไปหน้ารายการ
        </Link>
      </div>

      {errorMessage ? <p className="admin-form-status is-error">{errorMessage}</p> : null}
      <HouseCreateForm />
    </AdminShell>
  );
}
