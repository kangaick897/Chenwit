"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

type FloorPlan = {
  title: string;
  image: string;
};

export function FloorPlanGallery({ floorPlans }: { floorPlans: FloorPlan[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selectedPlan = floorPlans[selectedIndex];

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  const getFloorLabel = (title: string) => title.replace("แปลน", "").trim();

  return (
    <>
      <div className="floorplan-tabs" role="tablist" aria-label="เลือกชั้นของแบบแปลน">
        {floorPlans.map((plan, index) => (
          <button
            className="floorplan-tab"
            data-active={selectedIndex === index ? "true" : undefined}
            key={plan.title}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls="floorplan-panel"
            onClick={() => setSelectedIndex(index)}
          >
            <span aria-hidden="true" />
            {getFloorLabel(plan.title)}
          </button>
        ))}
      </div>

      <figure className="floorplan-viewer" id="floorplan-panel" role="tabpanel">
        <div className="floorplan-stage">
          <span className="floorplan-image">
            <Image src={selectedPlan.image} alt={selectedPlan.title} fill sizes="(max-width: 760px) 92vw, 760px" />
          </span>
          <button
            className="floorplan-zoom-icon"
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`ขยาย ${selectedPlan.title}`}
          >
            <Maximize2 size={20} strokeWidth={1.8} />
          </button>
        </div>
      </figure>

      {lightboxOpen ? (
        <div className="floorplan-lightbox" role="dialog" aria-modal="true" aria-label={selectedPlan.title}>
          <button
            className="floorplan-lightbox-backdrop"
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="ปิดรูปแปลน"
          />
          <div className="floorplan-lightbox-panel">
            <button
              className="floorplan-lightbox-close"
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="ปิดรูปแปลน"
            >
              <X size={24} strokeWidth={1.8} />
            </button>
            <div className="floorplan-lightbox-image">
              <Image src={selectedPlan.image} alt={selectedPlan.title} fill sizes="96vw" priority />
            </div>
            <p>{selectedPlan.title}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
