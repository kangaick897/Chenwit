import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Home,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { getAdminHouses } from "@/lib/admin-houses";
import { getAdminProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ภาพรวมหลังบ้านสำหรับจัดการเว็บไซต์",
};

export default async function AdminDashboardPage() {
  const [houses, projects] = await Promise.all([getAdminHouses(), getAdminProjects()]);
  const completedProjects = projects.filter((project) => project.status === "ส่งมอบแล้ว").length;

  return (
    <AdminShell
      active="dashboard"
      title="ภาพรวมหลังบ้าน"
      description="เช็คข้อมูลหลักก่อนเผยแพร่ และเตรียม flow สำหรับให้ผู้รับเหมาแก้ข้อมูลเอง"
    >
      <section className="admin-stat-grid" aria-label="สรุปข้อมูล">
        <div className="admin-stat-card">
          <Home size={22} strokeWidth={1.8} />
          <span>แบบบ้านทั้งหมด</span>
          <strong>{houses.length}</strong>
        </div>
        <div className="admin-stat-card">
          <FolderKanban size={22} strokeWidth={1.8} />
          <span>ผลงานทั้งหมด</span>
          <strong>{projects.length}</strong>
        </div>
        <div className="admin-stat-card">
          <CheckCircle2 size={22} strokeWidth={1.8} />
          <span>ผลงานส่งมอบแล้ว</span>
          <strong>{completedProjects}</strong>
        </div>
        <div className="admin-stat-card">
          <ImageIcon size={22} strokeWidth={1.8} />
          <span>พื้นที่รูปภาพ</span>
          <strong>Storage</strong>
        </div>
      </section>

      <section className="admin-dashboard-grid admin-dashboard-grid-single">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Quick Edit</p>
              <h2>ทางลัดจัดการข้อมูล</h2>
            </div>
            <Settings size={22} strokeWidth={1.8} />
          </div>
          <div className="admin-action-list">
            <Link href="/admin/houses">
              จัดการแบบบ้าน
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
            <Link href="/admin/projects">
              จัดการผลงาน
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
            <Link href="/admin/settings">
              ตั้งค่าข้อมูลบริษัท
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

