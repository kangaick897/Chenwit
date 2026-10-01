import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Eye, Plus, Search } from "lucide-react";

import { AdminShell } from "@/app/admin/_components/admin-shell";
import { houses } from "@/data/houses";

export const metadata: Metadata = {
  title: "Admin Houses",
  description: "จัดการแบบบ้านสำหรับเว็บไซต์",
};

export default function AdminHousesPage() {
  return (
    <AdminShell
      active="houses"
      title="จัดการแบบบ้าน"
      description="ค้นหาแบบบ้าน เลือกดูหน้าเว็บจริง หรือเข้าไปแก้ไขรายละเอียดของแต่ละแบบบ้าน"
    >
      <section className="admin-toolbar" aria-label="เครื่องมือจัดการแบบบ้าน">
        <label className="admin-search">
          <Search size={17} strokeWidth={1.8} />
          <input type="search" placeholder="ค้นหา CH B 420" />
        </label>
        <div className="admin-toolbar-actions">
          <button type="button" className="admin-primary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มแบบบ้าน
          </button>
        </div>
      </section>

      <section className="admin-table-panel" aria-label="รายการแบบบ้าน">
        <div className="admin-table-head">
          <span>แบบบ้าน</span>
          <span>ราคา</span>
          <span>สเปกหลัก</span>
          <span>สถานะ</span>
          <span>จัดการ</span>
        </div>

        {houses.map((house) => (
          <article className="admin-table-row" key={house.slug}>
            <div className="admin-item-cell">
              <div className="admin-thumb">
                <Image src={house.image} alt={house.name} fill sizes="96px" />
              </div>
              <div>
                <strong>{house.name}</strong>
                <span>{house.style}</span>
              </div>
            </div>
            <div className="admin-price-cell">{house.startingPrice}</div>
            <div className="admin-muted-cell">
              {house.bedrooms} ห้องนอน · {house.bathrooms} ห้องน้ำ · {house.parking} จอด
            </div>
            <div>
              <span className="admin-status is-live">เผยแพร่</span>
            </div>
            <div className="admin-row-actions">
              <Link
                href={`/houses/${house.slug}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`ดูตัวอย่าง ${house.name}`}
              >
                <Eye size={16} strokeWidth={1.8} />
              </Link>
              <Link href={`/admin/houses/${house.slug}/edit`} aria-label={`แก้ไข ${house.name}`}>
                <Edit3 size={16} strokeWidth={1.8} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}

