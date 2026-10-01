import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "เกี่ยวกับเรา",
  description: "บริการออกแบบ ก่อสร้าง รีโนเวท ต่อเติม และตกแต่งภายในโดย CHENWIT HOUSE BUILDER",
};

const serviceSections = [
  {
    title: "RENOVATION",
    subtitle: "ปรับปรุงให้เหมาะกับการใช้งานของคุณ",
    text: "ปรับพื้นที่เดิมให้ตอบโจทย์ชีวิตปัจจุบัน ตั้งแต่งานผิว งานระบบ ไปจนถึงการจัดแปลนใหม่ให้ใช้งานง่ายขึ้น",
    cta: "ปรึกษางานรีโนเวท",
    works: [
      { title: "รีโนเวทโฮมออฟฟิศ พระราม 9", image: "/assets/demo/houses/m8210.webp", href: "/projects/renovation-home-office" },
      { title: "รีโนเวททาวน์โฮม เกษตร", image: "/assets/demo/houses/m8209.webp", href: "/projects/renovation-townhome" },
    ],
  },
  {
    title: "BUILD",
    subtitle: "ก่อสร้างบ้านใหม่ตามแบบที่คุณต้องการ",
    text: "ดูแลตั้งแต่การเตรียมหน้างาน โครงสร้าง งานสถาปัตย์ ไปจนถึงรายละเอียดก่อนส่งมอบบ้าน",
    cta: "ปรึกษางานก่อสร้าง",
    works: [
      { title: "บ้านพักอาศัยครอบครัว บางนา", image: "/assets/houses/ch-b-420.png", href: "/projects/family-home-bangna" },
      { title: "บ้านคอนเทมโพรารี นนทบุรี", image: "/assets/houses/ch-b-250.png", href: "/projects/contemporary-home-nonthaburi" },
    ],
  },
  {
    title: "EXTENSION",
    subtitle: "ต่อเติมให้บ้านเดิมใช้งานได้มากขึ้น",
    text: "เพิ่มพื้นที่ครัว โรงจอดรถ หรือพื้นที่อเนกประสงค์ พร้อมดูภาพรวมโครงสร้างและงานระบบให้รอบคอบ",
    cta: "ปรึกษางานต่อเติม",
    works: [
      { title: "ต่อเติมโรงจอดรถ ลาดพร้าว", image: "/assets/demo/houses/m8211.webp", href: "/projects/extension-garage-ladprao" },
      { title: "ต่อเติมครัวหลังบ้าน วัชรพล", image: "/assets/demo/interior-preview.webp", href: "/projects/turnkey-kitchen-extension" },
    ],
  },
  {
    title: "OFFICE / SHOWROOM",
    subtitle: "ออกแบบพื้นที่ธุรกิจให้ดูเป็นมืออาชีพ",
    text: "วางภาพลักษณ์ ฟังก์ชันการใช้งาน และเส้นทางลูกค้าให้เหมาะกับธุรกิจขนาดเล็กถึงกลาง",
    cta: "ปรึกษางานธุรกิจ",
    works: [
      { title: "โฮมออฟฟิศ พระราม 9", image: "/assets/demo/houses/m8210.webp", href: "/projects/renovation-home-office" },
      { title: "พื้นที่โชว์รูมตัวอย่าง", image: "/assets/demo/interior-preview.webp", href: "/projects" },
    ],
  },
  {
    title: "INTERIOR",
    subtitle: "ตกแต่งภายในให้เป็นตัวตนของคุณ",
    text: "คุมโทน วัสดุ แสง และการจัดวางให้บ้านสวย ใช้งานง่าย และดูแลต่อได้ในชีวิตจริง",
    cta: "ปรึกษางานภายใน",
    works: [
      { title: "ตัวอย่างงานภายใน", image: "/assets/demo/interior-preview.webp", href: "/projects" },
      { title: "บ้านชั้นเดียว มีนบุรี", image: "/assets/houses/ch-a-145.png", href: "/projects/single-house-minburi" },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main about-services-page">
        <section className="about-services-hero">
          <div className="container">
            <p className="eyebrow">{siteConfig.companyName}</p>
            <h1>งานบริการของเรา</h1>
            <p>Our Services</p>
          </div>
        </section>

        <section className="about-services-intro">
          <div className="container">
            <div className="about-services-copy">
              <p className="eyebrow">HOUSE DESIGN / CONSTRUCTION</p>
              <h2>บริการสร้างบ้านและปรับปรุงพื้นที่แบบครบขั้นตอน</h2>
              <p>
                เราช่วยดูแลตั้งแต่แนวคิดแรกของบ้าน การออกแบบ การวางแผนงบประมาณ
                ไปจนถึงงานก่อสร้างจริง เพื่อให้เจ้าของบ้านเห็นภาพชัดและตัดสินใจได้ง่ายขึ้น
              </p>
            </div>

          </div>
        </section>

        <section className="about-service-showcase">
          {serviceSections.map((section, index) => (
            <div className={`about-service-band${index % 2 === 0 ? " is-muted" : ""}`} key={section.title}>
              <div className="container about-service-row">
                <div className="about-service-row-copy">
                  <h2>{section.title}</h2>
                  <p className="about-service-row-subtitle">{section.subtitle}</p>
                  <p>{section.text}</p>
                  <Link className="button button-dark" href="/contact">
                    {section.cta}
                  </Link>
                </div>

                <div className="about-work-grid">
                  {section.works.map((work) => (
                    <Link className="about-work-card" href={work.href} key={work.title}>
                      <span className="about-work-image">
                        <Image src={work.image} alt={work.title} fill sizes="(max-width: 760px) 100vw, 360px" />
                      </span>
                      <strong>{work.title}</strong>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="about-service-cta">
          <div className="container about-service-cta-inner">
            <div>
              <p className="eyebrow">CONSULTATION</p>
              <h2>เริ่มจากคุยโจทย์บ้านของคุณก่อน</h2>
            </div>
            <ul>
              <li>
                <Check size={16} strokeWidth={1.7} />
                ประเมินแนวทางงานตามพื้นที่จริง
              </li>
              <li>
                <Check size={16} strokeWidth={1.7} />
                คุยงบประมาณและลำดับงานให้เห็นภาพ
              </li>
            </ul>
            <Link className="button button-light" href="/contact">
              ติดต่อเรา
              <ArrowRight size={15} strokeWidth={1.6} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
