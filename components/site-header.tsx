"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      if (frameId.current !== null) {
        return;
      }

      frameId.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;

        if (currentScrollY < 24) {
          setIsHidden(false);
        } else if (delta > 8) {
          setIsHidden(true);
        } else if (delta < -8) {
          setIsHidden(false);
        }

        lastScrollY.current = currentScrollY;
        frameId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false);
    }
  }, [isOpen]);

  const headerClassName = `site-header${isHidden && !isOpen ? " is-hidden" : ""}`;

  return (
    <header className={headerClassName}>
      <div className="container header-inner">
        <Link
          className="brand brand-banner-link"
          href="/"
          aria-label={`${siteConfig.companyName} หน้าแรก`}
          onClick={() => setIsOpen(false)}
        >
          <Image
            className="brand-logo-banner"
            src={siteConfig.logoBanner}
            alt={siteConfig.companyName}
            width={240}
            height={80}
            priority
          />
        </Link>

        <nav className="site-nav" aria-label="เมนูหลัก">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="mobile-menu" aria-label="เมนูมือถือ">
          {siteConfig.navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
