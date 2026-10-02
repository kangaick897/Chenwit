import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions";
import { siteConfig } from "@/config/site";

type AdminSection = "dashboard" | "houses" | "projects" | "settings";

type AdminShellProps = {
  active: AdminSection;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
};

const adminNavigation = [
  { key: "dashboard", label: "ภาพรวม", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "houses", label: "แบบบ้าน", href: "/admin/houses", icon: Home },
  { key: "projects", label: "ผลงาน", href: "/admin/projects", icon: FolderKanban },
  { key: "settings", label: "ตั้งค่าเว็บ", href: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({
  active,
  eyebrow = "Admin Console",
  title,
  description,
  children,
}: AdminShellProps) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar" aria-label="เมนูหลังบ้าน">
        <Link className="admin-brand" href="/admin/dashboard" aria-label="กลับหน้าแอดมิน">
          <Image
            src={siteConfig.logoBanner}
            alt={siteConfig.companyName}
            width={210}
            height={70}
            priority
          />
        </Link>

        <nav className="admin-nav">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                className={`admin-nav-link${isActive ? " is-active" : ""}`}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <Link className="admin-mini-link" href="/">
            <ArrowLeft size={16} strokeWidth={1.8} />
            กลับไปหน้าเว็บ
          </Link>
          <form action={logoutAdmin}>
            <button className="admin-mini-link" type="submit">
              <LogOut size={16} strokeWidth={1.8} />
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="admin-client-pill">
            <Building2 size={16} strokeWidth={1.8} />
            {siteConfig.companyName}
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}

