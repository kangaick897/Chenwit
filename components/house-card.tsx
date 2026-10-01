import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, BedDouble, Home } from "lucide-react";

import type { House as HouseModel } from "@/data/houses";

export function HouseCard({ house }: { house: HouseModel }) {
  return (
    <article className="house-card">
      <Link href={`/houses/${house.slug}`}>
        <div className="house-card-image">
          <Image
            src={house.image}
            alt={`แบบบ้าน ${house.code}`}
            fill
            sizes="(max-width: 760px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="house-card-body">
        <h3>
          <Link href={`/houses/${house.slug}`}>{house.name}</Link>
        </h3>
        <p className="house-card-description">{house.description}</p>
        <div className="house-card-meta">
          <span className="house-card-meta-item">
            <Home size={14} strokeWidth={1.7} />
            <span>{house.style}</span>
          </span>
          <span className="house-card-meta-item">
            <BedDouble size={14} strokeWidth={1.7} />
            <span>{house.bedrooms} rooms</span>
          </span>
          <span className="house-card-meta-item">
            <Bath size={14} strokeWidth={1.7} />
            <span>{house.bathrooms} baths</span>
          </span>
        </div>
        <div className="house-card-footer">
          <Link
            className="house-card-link button-more"
            href={`/houses/${house.slug}`}
            aria-label={`ดูรายละเอียด ${house.name}`}
            title={`ดูรายละเอียด ${house.name}`}
          >
            For More
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
          <strong className="house-card-price">ราคา {house.startingPrice}</strong>
        </div>
      </div>
    </article>
  );
}
