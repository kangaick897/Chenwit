import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Eye, Plus, Search, Tags, Trash2 } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { projectCategories, projectCategoryOptions, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Admin Projects",
  description: "จัดการผลงานและอัปเดตไซต์งาน",
};

const categoryLabelBySlug = new Map(projectCategories.map((category) => [category.slug, category.label]));

export default function AdminProjectsPage() {
  return (
    <AdminShell
      active="projects"
      title="จัดการผลงาน"
      description="รวมผลงานก่อสร้าง ต่อเติม รีโนเวท และไซต์งานที่จะแสดงบนหน้าเว็บไซต์"
    >
      <section className="admin-toolbar" aria-label="เครื่องมือจัดการผลงาน">
        <label className="admin-search">
          <Search size={17} strokeWidth={1.8} />
          <input type="search" placeholder="ค้นหาผลงานหรือสถานที่" />
        </label>
        <div className="admin-toolbar-actions">
          <button type="button" className="admin-primary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มผลงาน
          </button>
        </div>
      </section>

      <details className="admin-package-panel admin-collapsible-panel" aria-labelledby="admin-project-categories-title">
        <summary className="admin-collapsible-summary">
          <div>
            <p className="admin-eyebrow">Categories</p>
            <h2 id="admin-project-categories-title">หมวดหมู่ผลงาน</h2>
          </div>
          <span>ย่อ/ขยาย</span>
        </summary>

        <div className="admin-collapsible-body">
          <button type="button" className="admin-secondary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มหมวดหมู่
          </button>

          <div className="admin-category-list">
            {projectCategoryOptions.map((category) => {
              const count = projects.filter((project) => project.category === category.slug).length;

              return (
                <div className="admin-category-row" key={category.slug}>
                  <div>
                    <Tags size={17} strokeWidth={1.8} />
                    <strong>{category.label}</strong>
                    <span>{count} ผลงาน</span>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" aria-label={`แก้ไขหมวด ${category.label}`}>
                      <Edit3 size={16} strokeWidth={1.8} />
                    </button>
                    <button type="button" aria-label={`ลบหมวด ${category.label}`}>
                      <Trash2 size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </details>

      <section className="admin-table-panel" aria-label="รายการผลงาน">
        <div className="admin-table-head admin-project-table-head">
          <span>ผลงาน</span>
          <span>หมวดหมู่</span>
          <span>จัดการ</span>
        </div>

        {projects.map((project) => (
          <article className="admin-table-row admin-project-table-row" key={project.slug}>
            <div className="admin-item-cell">
              <div className="admin-thumb">
                <Image src={project.image} alt={project.title} fill sizes="96px" />
              </div>
              <div>
                <strong>{project.title}</strong>
                <span>{project.location}</span>
              </div>
            </div>
            <div className="admin-muted-cell">{categoryLabelBySlug.get(project.category) ?? project.category}</div>
            <div className="admin-row-actions">
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`ดูตัวอย่าง ${project.title}`}
              >
                <Eye size={16} strokeWidth={1.8} />
              </Link>
              <Link href={`/admin/projects/${project.slug}/edit`} aria-label={`แก้ไข ${project.title}`}>
                <Edit3 size={16} strokeWidth={1.8} />
              </Link>
              <button type="button" aria-label={`ลบ ${project.title}`}>
                <Trash2 size={16} strokeWidth={1.8} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

