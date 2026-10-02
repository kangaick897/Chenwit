import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Eye, Plus, Search, Tags, Trash2 } from "lucide-react";

import { ConfirmDeleteButton } from "@/app/admin/_components/confirm-delete-button";
import { deleteProject } from "@/app/admin/actions";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getAdminProjects, getProjectCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin Projects",
  description: "จัดการผลงานและอัปเดตไซต์งาน",
};

type AdminProjectsPageProps = {
  searchParams?: Promise<{ deleted?: string; error?: string; q?: string }>;
};

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const [projects, projectCategoryOptions, query] = await Promise.all([
    getAdminProjects(),
    getProjectCategories(),
    searchParams,
  ]);
  const searchQuery = (query?.q ?? "").trim().toLowerCase();
  const visibleProjects = searchQuery
    ? projects.filter((project) =>
        [project.title, project.location, project.status, project.area, project.scope]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery),
      )
    : projects;
  const categoryLabelBySlug = new Map(projectCategoryOptions.map((category) => [category.slug, category.label]));

  return (
    <AdminShell
      active="projects"
      title="จัดการผลงาน"
      description="รวมผลงานก่อสร้าง ต่อเติม รีโนเวท และไซต์งานที่จะแสดงบนหน้าเว็บไซต์"
    >
      <section className="admin-toolbar" aria-label="เครื่องมือจัดการผลงาน">
        <form className="admin-search" action="/admin/projects">
          <Search size={17} strokeWidth={1.8} />
          <input name="q" type="search" placeholder="ค้นหาผลงานหรือสถานที่" defaultValue={query?.q ?? ""} />
        </form>
        <div className="admin-toolbar-actions">
          <Link href="/admin/projects/new" className="admin-primary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มผลงาน
          </Link>
        </div>
      </section>

      {query?.deleted === "1" ? <p className="admin-form-status is-success">ลบผลงานเรียบร้อยแล้ว</p> : null}
      {query?.error === "delete" ? <p className="admin-form-status is-error">ลบผลงานไม่สำเร็จ กรุณาลองอีกครั้ง</p> : null}
      {searchQuery ? <p className="admin-list-result">พบ {visibleProjects.length} รายการจากคำค้น “{query?.q}”</p> : null}

      <details className="admin-package-panel admin-collapsible-panel" aria-labelledby="admin-project-categories-title">
        <summary className="admin-collapsible-summary">
          <div>
            <p className="admin-eyebrow">Categories</p>
            <h2 id="admin-project-categories-title">หมวดหมู่ผลงาน</h2>
          </div>
          <span>ย่อ/ขยาย</span>
        </summary>

        <div className="admin-collapsible-body">
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

        {visibleProjects.map((project) => (
          <article className="admin-table-row admin-project-table-row" key={project.slug}>
            <div className="admin-item-cell">
              <div className="admin-thumb">
                <Image src={project.coverImageUrl} alt={project.title} fill sizes="96px" />
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
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
                <ConfirmDeleteButton
                  label={`ลบ ${project.title}`}
                  message={`ลบผลงาน "${project.title}" และรูปที่เกี่ยวข้องทั้งหมดใช่ไหม?`}
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </ConfirmDeleteButton>
              </form>
            </div>
          </article>
        ))}
        {visibleProjects.length === 0 ? <div className="admin-empty-state">ยังไม่มีผลงานในระบบ</div> : null}
      </section>
    </AdminShell>
  );
}

