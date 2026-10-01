"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { HouseCard } from "@/components/house-card";
import type { House } from "@/data/houses";

const priceStep = 100000;
const areaBands = [
  { label: "ต่ำกว่า 200 ตร.ม.", min: 0, max: 199 },
  { label: "200-300 ตร.ม.", min: 200, max: 300 },
  { label: "300-400 ตร.ม.", min: 301, max: 400 },
  { label: "400 ตร.ม. ขึ้นไป", min: 401, max: Infinity },
];

const bedroomOptions = [2, 3, 4, 5];

function parseNumber(value: string) {
  const number = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function formatPrice(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  }

  return value.toLocaleString("th-TH");
}

function toggleValue<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

export function HouseFilterView({ houses }: { houses: House[] }) {
  const pricedHouses = houses
    .map((house) => parseNumber(house.startingPrice))
    .filter((price): price is number => price !== null);
  const budgetMin = Math.floor(Math.min(...pricedHouses) / priceStep) * priceStep;
  const budgetMax = Math.ceil(Math.max(...pricedHouses) / priceStep) * priceStep;

  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState(budgetMin);
  const [maxPrice, setMaxPrice] = useState(budgetMax);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [minBedrooms, setMinBedrooms] = useState<number | null>(null);
  const floorOptions = Array.from(new Set(houses.map((house) => house.floors)));

  const filteredHouses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return houses.filter((house) => {
      const price = parseNumber(house.startingPrice);
      const usableArea = parseNumber(house.usableArea) ?? 0;
      const matchesQuery =
        !normalizedQuery ||
        house.code.toLowerCase().includes(normalizedQuery) ||
        house.name.toLowerCase().includes(normalizedQuery);
      const matchesPrice = price === null || (price >= minPrice && price <= maxPrice);
      const matchesFloor = selectedFloors.length === 0 || selectedFloors.includes(house.floors);
      const matchesArea =
        selectedAreas.length === 0 ||
        selectedAreas.some((label) => {
          const band = areaBands.find((item) => item.label === label);
          return band ? usableArea >= band.min && usableArea <= band.max : true;
        });
      const matchesBedroom = minBedrooms === null || house.bedrooms >= minBedrooms;

      return matchesQuery && matchesPrice && matchesFloor && matchesArea && matchesBedroom;
    });
  }, [houses, maxPrice, minBedrooms, minPrice, query, selectedAreas, selectedFloors]);

  const activeFilters = [
    query ? `ค้นหา: ${query}` : null,
    minPrice !== budgetMin || maxPrice !== budgetMax
      ? `งบ ${formatPrice(minPrice)}-${formatPrice(maxPrice)}`
      : null,
    ...selectedFloors,
    ...selectedAreas,
    minBedrooms ? `${minBedrooms}+ ห้องนอน` : null,
  ].filter(Boolean);

  const rangeStyle = {
    "--range-start": `${((minPrice - budgetMin) / (budgetMax - budgetMin)) * 100}%`,
    "--range-end": `${((maxPrice - budgetMin) / (budgetMax - budgetMin)) * 100}%`,
  } as CSSProperties;

  const resetFilters = () => {
    setQuery("");
    setMinPrice(budgetMin);
    setMaxPrice(budgetMax);
    setSelectedFloors([]);
    setSelectedAreas([]);
    setMinBedrooms(null);
  };

  const handleBudgetPreset = (value: string) => {
    if (value === "under-3m") {
      setMinPrice(budgetMin);
      setMaxPrice(Math.min(3000000, budgetMax));
      return;
    }

    if (value === "over-3m") {
      setMinPrice(Math.max(3000000, budgetMin));
      setMaxPrice(budgetMax);
      return;
    }

    setMinPrice(budgetMin);
    setMaxPrice(budgetMax);
  };

  const budgetPreset =
    minPrice === budgetMin && maxPrice === Math.min(3000000, budgetMax)
      ? "under-3m"
      : minPrice === Math.max(3000000, budgetMin) && maxPrice === budgetMax
        ? "over-3m"
        : "all";

  const filterPanel = (
    <aside className="house-filter-panel" aria-label="ตัวกรองแบบบ้าน">
      <div className="house-filter-head">
        <div>
          <p className="eyebrow">FILTER</p>
          <h2>เลือกแบบบ้าน</h2>
        </div>
        {activeFilters.length > 0 ? (
          <button className="filter-reset" type="button" onClick={resetFilters}>
            ล้าง
          </button>
        ) : null}
      </div>

      <label className="filter-search">
        <Search size={16} strokeWidth={1.6} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหา CH B 420"
        />
      </label>

      <div className="filter-group">
        <div className="filter-group-title">
          <span>งบประมาณ</span>
          <strong>
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </strong>
        </div>
        <div className="price-range" style={rangeStyle}>
          <div className="price-range-track" />
          <input
            aria-label="ราคาต่ำสุด"
            type="range"
            min={budgetMin}
            max={budgetMax}
            step={priceStep}
            value={minPrice}
            onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice - priceStep))}
          />
          <input
            aria-label="ราคาสูงสุด"
            type="range"
            min={budgetMin}
            max={budgetMax}
            step={priceStep}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice + priceStep))}
          />
        </div>
        <div className="price-range-values">
          <span>{budgetMin.toLocaleString("th-TH")}</span>
          <span>{budgetMax.toLocaleString("th-TH")}</span>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-group-title">
          <span>จำนวนชั้น</span>
        </div>
        <div className="filter-checks">
          {floorOptions.map((floor) => (
            <label className="filter-check" key={floor}>
              <input
                type="checkbox"
                checked={selectedFloors.includes(floor)}
                onChange={() => setSelectedFloors((items) => toggleValue(items, floor))}
              />
              <span>{floor}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-group-title">
          <span>พื้นที่ใช้สอย</span>
        </div>
        <div className="filter-checks">
          {areaBands.map((band) => (
            <label className="filter-check" key={band.label}>
              <input
                type="checkbox"
                checked={selectedAreas.includes(band.label)}
                onChange={() => setSelectedAreas((items) => toggleValue(items, band.label))}
              />
              <span>{band.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-group-title">
          <span>ห้องนอน</span>
        </div>
        <div className="filter-pills">
          {bedroomOptions.map((bedrooms) => (
            <button
              className={minBedrooms === bedrooms ? "filter-pill is-active" : "filter-pill"}
              type="button"
              key={bedrooms}
              onClick={() => setMinBedrooms(minBedrooms === bedrooms ? null : bedrooms)}
            >
              {bedrooms}+
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="mobile-filter-panel">
        <div className="mobile-filter-title">
          <h2>เลือกแบบบ้าน</h2>
          {activeFilters.length > 0 ? (
            <button className="filter-reset" type="button" onClick={resetFilters}>
              ล้าง
            </button>
          ) : null}
        </div>
        <input
          className="mobile-filter-input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาแบบบ้าน"
        />
        <select
          className="mobile-filter-select"
          value={selectedFloors[0] ?? ""}
          onChange={(event) => setSelectedFloors(event.target.value ? [event.target.value] : [])}
          aria-label="เลือกจำนวนชั้น"
        >
          <option value="">เลือกจำนวนชั้น</option>
          {floorOptions.map((floor) => (
            <option value={floor} key={floor}>
              {floor}
            </option>
          ))}
        </select>
        <select
          className="mobile-filter-select"
          value={budgetPreset}
          onChange={(event) => handleBudgetPreset(event.target.value)}
          aria-label="เลือกงบประมาณ"
        >
          <option value="all">เลือกราคา</option>
          <option value="under-3m">ไม่เกิน 3M</option>
          <option value="over-3m">3M ขึ้นไป</option>
        </select>
        <div className="mobile-filter-bottom">
          <select
            className="mobile-filter-select"
            value={selectedAreas[0] ?? ""}
            onChange={(event) => setSelectedAreas(event.target.value ? [event.target.value] : [])}
            aria-label="เลือกพื้นที่ใช้สอย"
          >
            <option value="">เลือกพื้นที่ใช้สอย</option>
            {areaBands.map((band) => (
              <option value={band.label} key={band.label}>
                {band.label}
              </option>
            ))}
          </select>
          <button className="mobile-filter-submit" type="button">
            ค้นหา
          </button>
        </div>
      </div>

      <div className="houses-layout">
        <div className="houses-sidebar desktop-filter">{filterPanel}</div>
        <div className="houses-results">
          {activeFilters.length > 0 ? (
            <div className="houses-results-head">
              <div className="active-filter-list">
                {activeFilters.map((filter) => (
                  <span key={filter}>{filter}</span>
                ))}
              </div>
            </div>
          ) : null}

          {filteredHouses.length > 0 ? (
            <div className="house-grid">
              {filteredHouses.map((house) => (
                <HouseCard key={house.slug} house={house} />
              ))}
            </div>
          ) : (
            <div className="house-empty">
              <h3>ยังไม่มีแบบบ้านที่ตรงกับตัวกรอง</h3>
              <p>ลองขยับช่วงงบประมาณ หรือเลือกจำนวนชั้นให้น้อยลง</p>
              <button className="button button-dark" type="button" onClick={resetFilters}>
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
