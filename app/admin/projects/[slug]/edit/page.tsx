import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, FileImage, Plus, Save, Upload, X } from "lucide-react";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { projectCategories, projects } from "@/data/projects";

type AdminProjectEditPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: AdminProjectEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project ? `Edit ${project.title}` : "Edit Project",
  };
}

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const showDetails = project.showDetails ?? true;
  const categoryOptions = projectCategories.filter((category) => category.slug !== "all");

  return (
    <AdminShell
      active="projects"
      title={`แก้ไข ${project.title}`}
      description="จัดการข้อมูลผลงาน รูปภาพ หมวดหมู่ และ field ที่จะแสดงบนหน้ารายละเอียดผลงาน"
    >
      <div className="admin-detail-actions">
        <Link className="admin-secondary-button" href="/admin/projects">
          <ArrowLeft size={16} strokeWidth={1.8} />
          กลับไปหน้ารายการ
        </Link>
        <Link className="admin-secondary-button" href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">
          <Eye size={16} strokeWidth={1.8} />
          ดูหน้าผลงาน
        </Link>
      </div>

      <section className="admin-house-editor" aria-labelledby="admin-project-editor-title">
        <form className="admin-form-panel admin-house-main-form">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Project Editor</p>
              <h2 id="admin-project-editor-title">ข้อมูลผลงาน</h2>
            </div>
          </div>

          <div className="admin-house-cover-row">
            <div className="admin-house-cover">
              <Image src={project.image} alt={project.title} fill sizes="260px" />
            </div>
            <label className="admin-upload-dropzone">
              <Upload size={18} strokeWidth={1.8} />
              <span>เปลี่ยนรูปหน้าปก</span>
              <input type="file" accept="image/*" />
            </label>
          </div>

          <div className="admin-form-grid two-cols">
            <label>
              <span>ชื่อผลงาน</span>
              <input defaultValue={project.title} />
            </label>
            <label>
              <span>หมวดหมู่</span>
              <select defaultValue={project.category}>
                {categoryOptions.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>สถานที่</span>
              <input defaultValue={project.location} />
            </label>
          </div>
        </form>
      </section>

      <section className="admin-floorplan-panel" aria-labelledby="admin-project-gallery-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Gallery</p>
            <h2 id="admin-project-gallery-title">รูปเพิ่มเติม</h2>
          </div>
        </div>

        <div className="admin-project-gallery-grid">
          {project.gallery.slice(0, 9).map((image, index) => (
            <article className="admin-project-gallery-card" key={`${image}-${index}`}>
              <div className="admin-project-gallery-image">
                <Image src={image} alt={`${project.title} รูปที่ ${index + 1}`} fill sizes="180px" />
              </div>
              <button type="button" className="admin-gallery-remove" aria-label={`ลบรูปที่ ${index + 1}`}>
                <X size={16} strokeWidth={2} />
              </button>
              <label className="admin-project-gallery-change">
                <FileImage size={16} strokeWidth={1.8} />
                <span>เปลี่ยนรูปที่ {index + 1}</span>
                <input type="file" accept="image/*" />
              </label>
            </article>
          ))}
          <label className="admin-project-gallery-add">
            <Plus size={26} strokeWidth={1.8} />
            <span>เพิ่มรูปภาพ</span>
            <small>รองรับรูปผลงาน Gallery</small>
            <input type="file" accept="image/*" />
          </label>
        </div>
      </section>

      <section className="admin-package-panel" aria-labelledby="admin-project-options-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Project Detail</p>
            <h2 id="admin-project-options-title">รายละเอียดผลงาน</h2>
          </div>
          <label className="admin-toggle-row admin-toggle-row-standalone">
            <input type="checkbox" defaultChecked={showDetails} />
            <span>เปิดใช้งาน</span>
          </label>
        </div>

        <div className="admin-display-option-grid">
          <label className="admin-display-option">
            <span>สถานะ</span>
            <input defaultValue={project.status} />
          </label>
          <label className="admin-display-option">
            <span>ปีที่ดำเนินงาน</span>
            <input defaultValue={project.year} />
          </label>
          <label className="admin-display-option">
            <span>พื้นที่โดยประมาณ</span>
            <input defaultValue={project.area} />
          </label>
          <label className="admin-display-option">
            <span>ขอบเขตงาน</span>
            <input defaultValue={project.scope} />
          </label>
        </div>
      </section>

      <section className="admin-save-panel" aria-label="บันทึกการแก้ไขผลงาน">
        <div>
          <p className="admin-eyebrow">Save Changes</p>
          <h2>บันทึกข้อมูลผลงานทั้งหมด</h2>
          <p>ตอนนี้เป็นหน้าแก้ไขแบบ mock UI ก่อนเชื่อมฐานข้อมูลจริง</p>
        </div>
        <button type="button" className="admin-primary-button">
          <Save size={16} strokeWidth={1.8} />
          บันทึกการแก้ไขทั้งหมด
        </button>
      </section>
    </AdminShell>
  );
}
