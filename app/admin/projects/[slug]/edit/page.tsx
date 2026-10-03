import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { ProjectEditorForm } from "@/app/admin/projects/_components/project-editor-form";
import { getProjectBySlug, getProjectCategories } from "@/lib/projects";

type AdminProjectEditPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
};

export async function generateMetadata({ params }: AdminProjectEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, false);

  return {
    title: project ? `Edit ${project.title}` : "Edit Project",
  };
}

export default async function AdminProjectEditPage({ params, searchParams }: AdminProjectEditPageProps) {
  const { slug } = await params;
  const [project, categories, query] = await Promise.all([
    getProjectBySlug(slug, false),
    getProjectCategories(),
    searchParams,
  ]);

  if (!project) {
    notFound();
  }

  return (
    <AdminShell
      active="projects"
      title={`แก้ไข ${project.title}`}
      description="จัดการข้อมูลผลงาน รูปภาพ หมวดหมู่ และรายละเอียดเสริมที่จะแสดงบนหน้าบ้าน"
    >
      <div className="admin-detail-actions">
        <Link className="admin-secondary-button" href="/admin/projects">
          <ArrowLeft size={16} strokeWidth={1.8} />
          กลับไปหน้ารายการ
        </Link>
        <Link
          className="admin-secondary-button"
          href={`/projects/${encodeURIComponent(project.slug)}`}
          target="_blank"
          rel="noreferrer"
        >
          <Eye size={16} strokeWidth={1.8} />
          ดูหน้าผลงาน
        </Link>
      </div>

      {query?.saved === "1" ? <p className="admin-form-status is-success">บันทึกผลงานเรียบร้อยแล้ว</p> : null}
      {query?.error === "upload" ? <p className="admin-form-status is-error">อัปโหลดรูปไม่สำเร็จ กรุณาลองอีกครั้ง</p> : null}
      {query?.error === "save" ? <p className="admin-form-status is-error">บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง</p> : null}
      <ProjectEditorForm project={project} categories={categories} />
    </AdminShell>
  );
}
