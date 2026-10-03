import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, Hammer, MapPin, Ruler } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { getProjectBySlug, getProjectCategories } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return {
    title: project ? `${project.title} | ผลงาน` : "ผลงาน",
    description: project && (project.showDetails ?? true) ? project.description : undefined,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const [project, projectCategories] = await Promise.all([getProjectBySlug(slug), getProjectCategories()]);

  if (!project) {
    notFound();
  }

  const categoryLabel =
    projectCategories.find((category) => category.slug === project.category)?.label ?? project.category;

  const showDetails = project.showDetails ?? true;
  const facts = [
    { label: "สถานะ", value: project.status, icon: Hammer },
    { label: "ปีที่ดำเนินงาน", value: project.year, icon: CalendarDays },
    { label: "พื้นที่โดยประมาณ", value: project.area, icon: Ruler },
    { label: "ขอบเขตงาน", value: project.scope, icon: Check },
  ].filter((fact) => fact.value.trim().length > 0);
  const visibleGallery = project.gallery.slice(0, 9);

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="page-content project-detail-page">
          <div className="container">
            <Link className="text-link" href="/projects">
              <ArrowLeft size={16} strokeWidth={1.5} />
              กลับไปดูผลงาน
            </Link>

            <div className="project-detail-intro">
              <div>
                {showDetails ? <p className="eyebrow">{categoryLabel}</p> : null}
                <h1>{project.title}</h1>
                <p className="project-location">
                  <MapPin size={14} strokeWidth={1.4} />
                  {project.location}
                </p>
              </div>
            </div>

            <div className="project-detail-hero">
              <Image src={project.image} alt={project.title} fill priority sizes="(max-width: 760px) 100vw, 1216px" />
            </div>

            {showDetails && project.description.trim() ? (
              <p className="project-detail-description">{project.description}</p>
            ) : null}

            {showDetails && facts.length > 0 ? (
              <div className="project-detail-facts">
                {facts.map((fact) => {
                  const Icon = fact.icon;

                  return (
                    <div className="project-detail-fact" key={fact.label}>
                      <Icon size={22} strokeWidth={1.5} />
                      <span>{fact.label}</span>
                      <strong>{fact.value}</strong>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {visibleGallery.length > 0 ? (
              <section className="project-gallery-section">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">GALLERY</p>
                    <h2>ภาพเพิ่มเติม</h2>
                  </div>
                  <p>รวมภาพบรรยากาศหน้างานและรายละเอียดที่ช่วยให้เห็นขอบเขตผลงานชัดขึ้น</p>
                </div>
                <div className="project-gallery-grid">
                  {visibleGallery.map((image, index) => (
                    <div className="project-gallery-item" key={`${image}-${index}`}>
                      <Image src={image} alt={`${project.title} รูปที่ ${index + 1}`} fill sizes="(max-width: 760px) 100vw, 33vw" />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="project-detail-bottom">
              <Link className="text-link" href="/projects">
                <ArrowLeft size={16} strokeWidth={1.5} />
                กลับไปดูผลงานทั้งหมด
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
