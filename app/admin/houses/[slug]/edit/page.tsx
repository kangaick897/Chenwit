import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { HouseEditorForm } from "@/app/admin/houses/_components/house-editor-form";
import { houses } from "@/data/houses";

type AdminHouseEditPageProps = {
  params: Promise<{ slug: string }>;
};

function findHouse(slug: string) {
  return houses.find((house) => house.slug === slug) ?? null;
}

export function generateStaticParams() {
  return houses.map((house) => ({ slug: house.slug }));
}

export async function generateMetadata({ params }: AdminHouseEditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const house = findHouse(slug);

  return {
    title: house ? `Edit ${house.code}` : "Edit House",
    description: "แก้ไขข้อมูลแบบบ้านในหลังบ้าน",
  };
}

export default async function AdminHouseEditPage({ params }: AdminHouseEditPageProps) {
  const { slug } = await params;
  const house = findHouse(slug);

  if (!house) {
    notFound();
  }

  return (
    <AdminShell
      active="houses"
      eyebrow="House Editor"
      title={`แก้ไข ${house.code}`}
      description="จัดการชื่อ ราคา คำอธิบาย ข้อมูลแพ็กเกจ รูปแปลน และ field ที่ใช้กับตัวกรองหน้าบ้าน"
    >
      <div className="admin-detail-actions">
        <Link className="admin-secondary-button" href="/admin/houses">
          <ArrowLeft size={16} strokeWidth={1.8} />
          กลับไปหน้ารายการ
        </Link>
        <Link
          className="admin-secondary-button"
          href={`/houses/${house.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <Eye size={16} strokeWidth={1.8} />
          ดูหน้าบ้าน
        </Link>
      </div>

      <HouseEditorForm house={house} />
    </AdminShell>
  );
}

