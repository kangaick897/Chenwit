import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Car, Home, Maximize2, Ruler } from "lucide-react";
import { notFound } from "next/navigation";

import { FloorPlanGallery } from "@/components/floorplan-gallery";
import { HouseCard } from "@/components/house-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { getPublishedHouseBySlug, getPublishedHouses } from "@/lib/public-houses";

type HouseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: HouseDetailPageProps) {
  const { slug } = await params;
  const house = await getPublishedHouseBySlug(slug);

  return {
    title: house?.name ?? "แบบบ้าน",
    description: house ? `รายละเอียดแบบบ้าน ${house.code} ${house.name}` : undefined,
  };
}

export default async function HouseDetailPage({ params }: HouseDetailPageProps) {
  const { slug } = await params;
  const [house, houses] = await Promise.all([getPublishedHouseBySlug(slug), getPublishedHouses()]);

  if (!house) {
    notFound();
  }

  const detailStats = [
    { icon: Maximize2, label: "ขนาดที่ดิน", value: house.landSize },
    { icon: Ruler, label: "พื้นที่ใช้สอย", value: house.usableArea },
    { icon: Home, label: "ขนาดตัวบ้าน", value: house.houseSize },
    { icon: BedDouble, label: "ห้องนอน", value: `${house.bedrooms} ห้อง` },
    { icon: Bath, label: "ห้องน้ำ", value: `${house.bathrooms} ห้อง` },
    { icon: Car, label: "ที่จอดรถ", value: `${house.parking} คัน` },
  ];

  const floorPlans = house.floorPlans ?? [];
  const relatedHouses = houses.filter((item) => item.slug !== house.slug).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="page-content house-detail-page">
          <div className="container">
            <Link className="text-link detail-back-link" href="/houses">
              <ArrowLeft size={16} strokeWidth={1.5} />
              กลับไปดูแบบบ้าน
            </Link>

            <div className="detail-hero-image">
              <Image src={house.image} alt={`แบบบ้าน ${house.code}`} fill priority sizes="(max-width: 760px) 100vw, 76vw" />
            </div>

            <div className="detail-title-row">
              <h1>{house.name}</h1>
              <p className="detail-style-label">Design Style {house.style}</p>
            </div>

            <div className="detail-intro">
              <p>{house.description}</p>
            </div>

            <span className="detail-accent-line" aria-hidden="true" />

            <div className="detail-metric-grid">
              {detailStats.map(({ icon: Icon, label, value }) => (
                <div className="detail-metric" key={label}>
                  <Icon size={28} strokeWidth={1.45} />
                  <h3>{label}</h3>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            {floorPlans.length > 0 ? (
              <section className="floorplan-section" aria-labelledby="floorplan-title">
                <div className="section-heading section-heading-center">
                  <h2 id="floorplan-title">FLOOR PLAN</h2>
                </div>
                <FloorPlanGallery floorPlans={floorPlans} />
              </section>
            ) : null}

            <section className="related-section" aria-labelledby="related-title">
              <div className="section-heading section-heading-center">
                <h2 id="related-title">Related Property</h2>
              </div>
              <div className="related-grid">
                {relatedHouses.map((item) => (
                  <HouseCard key={item.slug} house={item} />
                ))}
              </div>
              <div className="detail-actions">
                <Link className="text-link" href="/houses">
                  ดูแบบบ้านทั้งหมด
                  <ArrowUpRight size={16} strokeWidth={1.6} />
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
