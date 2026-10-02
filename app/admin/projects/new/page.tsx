import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { ProjectEditorForm } from "@/app/admin/projects/_components/project-editor-form";
import { getProjectCategories } from "@/lib/projects";

type AdminProjectNewPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Add Project",
  description: "เพิ่มผลงานใหม่ในหลังบ้าน",
};

const errorMessages: Record<string, string> = {
  cover: "กรุณาเลือกรูปหน้าปกก่อนสร้างผลงาน",
  missing: "กรุณากรอกชื่อผลงาน",
  save: "สร้างผลงานไม่สำเร็จ กรุณาลองอีกครั้ง",
  upload: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
};

export default async function AdminProjectNewPage({ searchParams }: AdminProjectNewPageProps) {
  const [query, categories] = await Promise.all([searchParams, getProjectCategories()]);
  const errorMessage = query?.error ? errorMessages[query.error] : null;

  return (
    <AdminShell
      active="projects"
      title="เพิ่มผลงาน"
      description="สร้างผลงานใหม่ อัปโหลดรูปหน้าปก และเผยแพร่บนหน้าเว็บไซต์"
    >
      <div className="admin-detail-actions">
        <Link className="admin-secondary-button" href="/admin/projects">
          <ArrowLeft size={16} strokeWidth={1.8} />
          กลับไปหน้ารายการ
        </Link>
      </div>

      {errorMessage ? <p className="admin-form-status is-error">{errorMessage}</p> : null}
      <ProjectEditorForm categories={categories} />
    </AdminShell>
  );
}
