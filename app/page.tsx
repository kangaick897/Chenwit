import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Hammer, Ruler, Sparkles } from "lucide-react";

import { HouseCard } from "@/components/house-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { siteConfig } from "@/config/site";
import { featuredHouses } from "@/data/houses";

const principles = [
  {
    icon: Ruler,
    title: "ออกแบบอย่างเข้าใจ",
    description: "วางแปลนให้สอดคล้องกับชีวิตจริงและบริบทของพื้นที่",
  },
  {
    icon: Hammer,
    title: "ใส่ใจทุกขั้นตอน",
    description: "คุมงานด้วยทีมช่างและมาตรฐานที่ตรวจสอบได้",
  },
  {
    icon: Sparkles,
    title: "บ้านที่เป็นคุณ",
    description: "ปรับฟังก์ชัน วัสดุ และรายละเอียดให้ตรงความต้องการ",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" aria-label="ภาพตัวอย่างบ้านจาก CHENWIT HOUSE BUILDER">
          <Image
            className="hero-image"
            src={siteConfig.heroImage}
            alt="ภาพบ้านหรูสำหรับส่วน hero"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-overlay" />
          <h1 className="visually-hidden">CHENWIT HOUSE BUILDER รับออกแบบและสร้างบ้าน</h1>
        </section>

        <section className="section section-houses" aria-labelledby="houses-title">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">OUR HOUSE COLLECTION</p>
                <h2 id="houses-title">
                  แบบบ้านยอดนิยม
                  <br />
                  ที่ใช่สำหรับครอบครัว
                </h2>
              </div>
              <div className="section-intro">
                <p>
                  ดีไซน์สวย ฟังก์ชันครบ ตอบโจทย์ทุกครอบครัว
                  พร้อมปรับรายละเอียดให้เหมาะกับพื้นที่ของคุณ
                </p>
                <Link className="text-link" href="/houses">
                  ดูแบบบ้านทั้งหมด
                  <ArrowRight size={16} strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div className="house-grid">
              {featuredHouses.map((house) => (
                <HouseCard key={house.slug} house={house} />
              ))}
            </div>
          </div>
        </section>

        <section className="section section-principles" aria-labelledby="principles-title">
          <div className="container principles-grid">
            <div className="principles-heading">
              <p className="eyebrow">WHY CHOOSE US</p>
              <h2 id="principles-title">
                มากกว่า
                <br />
                แค่การสร้างบ้าน
              </h2>
              <p>
                เราเชื่อว่าบ้านที่ดีไม่ได้วัดจากความสวยเพียงอย่างเดียว
                แต่คือพื้นที่ที่ทำให้ทุกวันของคุณดีขึ้น
              </p>
            </div>
            <div className="principles-list">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <div className="principle-item" key={principle.title}>
                    <Icon size={28} strokeWidth={1.2} />
                    <div>
                      <h3>{principle.title}</h3>
                      <p>{principle.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="principles-image">
              <Image
                src="/assets/demo/interior-preview.webp"
                alt="ภาพตัวอย่างมุมพักผ่อนภายในบ้าน"
                fill
                sizes="(max-width: 1000px) 100vw, 25vw"
              />
              <span className="principles-image-caption">A HOME THAT FEELS LIKE YOU</span>
            </div>
          </div>
        </section>

        <section className="section section-site" aria-labelledby="site-title">
          <div className="container site-feature">
            <div className="site-image-wrap">
              <Image
                src="/assets/demo/interior-preview.webp"
                alt="ภาพตัวอย่างบรรยากาศภายในบ้าน"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
            </div>
            <div className="site-copy">
              <p className="eyebrow">FROM OUR SITE</p>
              <h2 id="site-title">
                ชมรายละเอียด
                <br />
                ที่หน้างานจริง
              </h2>
              <p>
                ติดตามผลงานและบรรยากาศจากหน้างานจริง
                ตั้งแต่วันแรกที่เริ่มวางแผนจนถึงวันที่ส่งมอบบ้าน
              </p>
              <ul className="check-list">
                <li>
                  <Check size={16} strokeWidth={1.6} />
                  อัปเดตขั้นตอนการก่อสร้าง
                </li>
                <li>
                  <Check size={16} strokeWidth={1.6} />
                  ดูวัสดุและรายละเอียดงานจริง
                </li>
              </ul>
              <Link className="button button-outline" href="/projects">
                ดูผลงาน
                <ArrowUpRight size={16} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </section>

        <section className="cta-band" aria-label="ติดต่อบริษัท">
          <div className="container cta-band-inner">
            <div>
              <p className="eyebrow">LET&apos;S BUILD YOUR HOME</p>
              <h2>บ้านหลังต่อไปของคุณ เริ่มต้นที่นี่</h2>
            </div>
            <Link className="button button-dark" href="/contact">
              คุยกับเรา
              <ArrowUpRight size={16} strokeWidth={1.6} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
      {siteConfig.previewNotice ? (
        <p className="preview-notice">{siteConfig.previewNotice}</p>
      ) : null}
    </>
  );
}
