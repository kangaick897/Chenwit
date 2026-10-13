import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyContact } from "@/components/sticky-contact";
import { getProjectCategories, getPublishedProjects } from "@/lib/projects";
import { getPublicSiteSettings } from "@/lib/site-settings";

const PROJECTS_PER_PAGE = 9;

type ProjectsPageProps = {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
};

export const metadata = { title: "ผลงาน" };

function getProjectHref(category: string, page: number) {
  const params = new URLSearchParams();

  if (category !== "all") {
    params.set("category", category);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/projects?${query}` : "/projects";
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [params, categories, projects, settings] = await Promise.all([
    searchParams,
    getProjectCategories(),
    getPublishedProjects(),
    getPublicSiteSettings(),
  ]);
  const projectCategories = [{ slug: "all", label: "ทั้งหมด" }, ...categories];
  const visibleCategories = projectCategories.filter(
    (category) => category.slug === "all" || category.showInFilter !== false,
  );
  const requestedCategory = params?.category ?? "all";
  const activeCategory = visibleCategories.some((category) => category.slug === requestedCategory)
    ? requestedCategory
    : "all";
  const requestedPage = Number(params?.page ?? "1");
  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory);
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const currentPage = Math.min(Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1), totalPages);
  const pageProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  return (
    <>
      <SiteHeader />
      <main className="page-main">
        <section className="portfolio-hero">
          <div className="container">
            <p className="eyebrow">{settings.companyName}</p>
            <h1>ผลงานของเรา</h1>
            <p>Portfolio</p>
          </div>
        </section>

        <section className="page-content portfolio-page">
          <div className="container">
            <div className="portfolio-tabs" aria-label="หมวดหมู่ผลงาน">
              {visibleCategories.map((category) => {
                const count =
                  category.slug === "all"
                    ? projects.length
                    : projects.filter((project) => project.category === category.slug).length;

                return (
                  <Link
                    key={category.slug}
                    className={`portfolio-tab${activeCategory === category.slug ? " is-active" : ""}`}
                    href={getProjectHref(category.slug, 1)}
                  >
                    <span>{category.label}</span>
                    <strong>{count}</strong>
                  </Link>
                );
              })}
            </div>

            {pageProjects.length > 0 ? (
              <div className="portfolio-grid">
                {pageProjects.map((project) => {
                  const showDetails = project.showDetails ?? true;
                  const cardMeta = [project.status, project.area, project.year].filter(
                    (value) => value.trim().length > 0,
                  );

                  return (
                    <article className="portfolio-card" key={project.slug}>
                      <Link
                        className="portfolio-card-image"
                        href={`/projects/${encodeURIComponent(project.slug)}`}
                        aria-label={project.title}
                      >
                        <Image src={project.image} alt={project.title} fill sizes="(max-width: 760px) 100vw, 33vw" />
                      </Link>
                      <div className="portfolio-card-body">
                        <h2>
                          <Link href={`/projects/${encodeURIComponent(project.slug)}`}>{project.title}</Link>
                        </h2>
                        <p className="portfolio-card-location">
                          <MapPin size={14} strokeWidth={1.6} />
                          {project.location}
                        </p>
                        {showDetails && cardMeta.length > 0 ? (
                          <div className="portfolio-card-meta">
                            {cardMeta.map((value) => (
                              <span key={value}>{value}</span>
                            ))}
                          </div>
                        ) : null}
                        <Link className="portfolio-card-link" href={`/projects/${encodeURIComponent(project.slug)}`}>
                          See More
                          <ArrowUpRight size={15} strokeWidth={1.6} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="portfolio-empty">
                <p>ยังไม่มีผลงานในหมวดนี้</p>
              </div>
            )}

            {totalPages > 1 ? (
              <nav className="portfolio-pagination" aria-label="เปลี่ยนหน้าผลงาน">
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;

                  return (
                    <Link
                      key={page}
                      className={`portfolio-page-link${currentPage === page ? " is-active" : ""}`}
                      href={getProjectHref(activeCategory, page)}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
      <StickyContact />
    </>
  );
}
