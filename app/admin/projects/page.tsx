import type { Metadata } from "next";
import Image from "next/image";
import { Edit3, Eye, Plus, Search, Upload } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { projectCategories, projects } from "@/data/projects";

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
          <button type="button" className="admin-secondary-button">
            <Upload size={16} strokeWidth={1.8} />
            อัปโหลดแกลเลอรี
          </button>
          <button type="button" className="admin-primary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มผลงาน
          </button>
        </div>
      </section>

      <section className="admin-project-grid" aria-label="รายการผลงาน">
        {projects.slice(0, 8).map((project) => (
          <article className="admin-project-card" key={project.slug}>
            <div className="admin-project-image">
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 760px) 100vw, 25vw" />
            </div>
            <div className="admin-project-body">
              <span className="admin-status">{categoryLabelBySlug.get(project.category) ?? project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.location}</p>
              <div className="admin-project-meta">
                <span>{project.status}</span>
                <span>{project.year}</span>
                <span>{project.area}</span>
              </div>
              <div className="admin-project-actions">
                <button type="button">
                  <Eye size={15} strokeWidth={1.8} />
                  ดู
                </button>
                <button type="button">
                  <Edit3 size={15} strokeWidth={1.8} />
                  แก้ไข
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

