import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Eye, Plus, Search, Trash2 } from "lucide-react";

import { ConfirmDeleteButton } from "@/app/admin/_components/confirm-delete-button";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { deleteHouse } from "@/app/admin/actions";
import { getAdminHouses } from "@/lib/admin-houses";

export const metadata: Metadata = {
  title: "Admin Houses",
  description: "จัดการแบบบ้านสำหรับเว็บไซต์",
};

type AdminHousesPageProps = {
  searchParams?: Promise<{ deleted?: string; error?: string; q?: string }>;
};

export default async function AdminHousesPage({ searchParams }: AdminHousesPageProps) {
  const [houses, query] = await Promise.all([getAdminHouses(), searchParams]);
  const searchQuery = (query?.q ?? "").trim().toLowerCase();
  const visibleHouses = searchQuery
    ? houses.filter((house) =>
        [house.code, house.name, house.style, house.location]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery),
      )
    : houses;

  return (
    <AdminShell
      active="houses"
      title="จัดการแบบบ้าน"
      description="ค้นหาแบบบ้าน เลือกดูหน้าเว็บจริง หรือเข้าไปแก้ไขรายละเอียดของแต่ละแบบบ้าน"
    >
      <section className="admin-toolbar" aria-label="เครื่องมือจัดการแบบบ้าน">
        <form className="admin-search" action="/admin/houses">
          <Search size={17} strokeWidth={1.8} />
          <input name="q" type="search" placeholder="ค้นหาแบบบ้าน" defaultValue={query?.q ?? ""} />
        </form>
        <div className="admin-toolbar-actions">
          <Link href="/admin/houses/new" className="admin-primary-button">
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มแบบบ้าน
          </Link>
        </div>
      </section>

      {query?.deleted === "1" ? <p className="admin-form-status is-success">ลบแบบบ้านเรียบร้อยแล้ว</p> : null}
      {query?.error === "delete" ? <p className="admin-form-status is-error">ลบแบบบ้านไม่สำเร็จ กรุณาลองอีกครั้ง</p> : null}
      {searchQuery ? <p className="admin-list-result">พบ {visibleHouses.length} รายการจากคำค้น “{query?.q}”</p> : null}

      <section className="admin-table-panel" aria-label="รายการแบบบ้าน">
        <div className="admin-table-head">
          <span>แบบบ้าน</span>
          <span>ราคา</span>
          <span>สเปกหลัก</span>
          <span>สถานะ</span>
          <span>จัดการ</span>
        </div>

        {visibleHouses.map((house) => (
          <article className="admin-table-row" key={house.slug}>
            <div className="admin-item-cell">
              <div className="admin-thumb">
                <Image src={house.coverImageUrl} alt={house.name} fill sizes="96px" />
              </div>
              <div>
                <strong>{house.name}</strong>
                <span>{house.style}</span>
              </div>
            </div>
            <div className="admin-price-cell">{house.startingPrice || "สอบถามราคา"}</div>
            <div className="admin-muted-cell">
              {house.bedrooms} ห้องนอน · {house.bathrooms} ห้องน้ำ · {house.parking} จอด
            </div>
            <div>
              <span className={house.isPublished ? "admin-status is-live" : "admin-status"}>
                {house.isPublished ? "เผยแพร่" : "ซ่อนอยู่"}
              </span>
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
              <form action={deleteHouse}>
                <input type="hidden" name="id" value={house.id} />
                <ConfirmDeleteButton
                  label={`ลบ ${house.name}`}
                  message={`ลบแบบบ้าน "${house.name}" และรูปที่เกี่ยวข้องทั้งหมดใช่ไหม?`}
                >
                  <Trash2 size={16} strokeWidth={1.8} />
                </ConfirmDeleteButton>
              </form>
            </div>
          </article>
        ))}
        {visibleHouses.length === 0 ? <div className="admin-empty-state">ยังไม่มีแบบบ้านในระบบ</div> : null}
      </section>
    </AdminShell>
  );
}

