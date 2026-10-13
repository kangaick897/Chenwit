import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HouseFilterView } from "@/components/house-filter-view";
import { StickyContact } from "@/components/sticky-contact";
import { getPublishedHouses } from "@/lib/public-houses";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "แบบบ้าน",
  description: "เลือกชมแบบบ้านและแนวคิดการออกแบบสำหรับบ้านของคุณ",
};

export default async function HousesPage() {
  const [houses, settings] = await Promise.all([getPublishedHouses(), getPublicSiteSettings()]);

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="page-hero houses-collection-hero">
          <div className="container">
            <p className="eyebrow">{settings.companyName}</p>
            <h1>แบบบ้านของเรา</h1>
            <p>House Collection</p>
          </div>
        </section>
        <section className="page-content">
          <div className="container houses-container">
            <HouseFilterView houses={houses} />
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
