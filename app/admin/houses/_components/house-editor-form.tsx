"use client";

import Image from "next/image";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import {
  Bath,
  BedDouble,
  Car,
  FileImage,
  Home,
  Maximize2,
  Plus,
  Ruler,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { saveHouse } from "@/app/admin/actions";
import { compressImageFile } from "@/lib/client-image-compression";
import type { AdminHouse } from "@/lib/admin-houses";

type HouseEditorFormProps = {
  house: AdminHouse;
};

type EditableFloorPlan = {
  fileName: string | null;
  id: string;
  image: string | null;
  persistedImage: string | null;
  previewUrl: string | null;
  title: string;
  uploadFile: File | null;
};

export function HouseEditorForm({ house }: HouseEditorFormProps) {
  const floorPlans = house.floorPlans ?? [];
  const floorCount = Number.parseInt(house.floors, 10) || floorPlans.length || 1;
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editableFloorPlans, setEditableFloorPlans] = useState<EditableFloorPlan[]>(() =>
    floorPlans.map((plan, index) => ({
      fileName: null,
      id: `existing-plan-${index}`,
      image: plan.imageUrl,
      persistedImage: plan.imageUrl,
      previewUrl: null,
      title: plan.title,
      uploadFile: null,
    })),
  );

  const addFloorPlan = () => {
    setEditableFloorPlans((plans) => [
      ...plans,
      {
        fileName: null,
        id: `draft-plan-${Date.now()}-${plans.length}`,
        image: null,
        persistedImage: null,
        previewUrl: null,
        title: `แปลนใหม่ ${plans.length + 1}`,
        uploadFile: null,
      },
    ]);
  };

  const updateFloorPlanTitle = (id: string, title: string) => {
    setEditableFloorPlans((plans) =>
      plans.map((plan) => (plan.id === id ? { ...plan, title } : plan)),
    );
  };

  const removeFloorPlan = (id: string) => {
    setEditableFloorPlans((plans) => plans.filter((plan) => plan.id !== id));
  };

  const updateCoverImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCoverFile(file);
      setCoverPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const updateFloorPlanImage = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEditableFloorPlans((plans) =>
        plans.map((plan) =>
          plan.id === id
            ? {
                ...plan,
                fileName: file.name,
                previewUrl: typeof reader.result === "string" ? reader.result : null,
                uploadFile: file,
              }
            : plan,
        ),
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);
    setIsPreparingImages(true);

    const formData = new FormData(event.currentTarget);

    void (async () => {
      formData.delete("coverImageFile");
      formData.delete("floorPlanUpload");

      if (coverFile) {
        const compressedCover = await compressImageFile(coverFile, { maxSize: 1600, quality: 0.84 });
        formData.append("coverImageFile", compressedCover);
      }

      for (const plan of editableFloorPlans) {
        if (plan.uploadFile) {
          const compressedFloorPlan = await compressImageFile(plan.uploadFile, { maxSize: 2000, quality: 0.86 });
          formData.append("floorPlanUpload", compressedFloorPlan);
        } else {
          formData.append("floorPlanUpload", "");
        }
      }

      setIsPreparingImages(false);
      startTransition(() => {
        void saveHouse(formData);
      });
    })().catch(() => {
      setIsPreparingImages(false);
      setUploadError("เตรียมรูปภาพไม่สำเร็จ กรุณาลองเลือกรูปใหม่อีกครั้ง");
    });
  };

  const isSaving = isPreparingImages || isPending;
  const coverImageSrc = coverPreviewUrl ?? house.coverImageUrl;

  return (
    <form onSubmit={handleSubmit} className="admin-house-edit-form">
      <input type="hidden" name="id" value={house.id} />
      <input type="hidden" name="slug" value={house.slug} />
      <input type="hidden" name="coverImageUrl" value={house.coverImageUrl} />
      {floorPlans.map((plan) => (
        <input key={plan.id} type="hidden" name="originalFloorPlanImageUrl" value={plan.imageUrl} />
      ))}

      <section className="admin-house-editor" aria-labelledby="admin-house-editor-title">
        <div className="admin-form-panel admin-house-main-form">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Editing</p>
              <h2 id="admin-house-editor-title">ข้อมูลแบบบ้าน</h2>
            </div>
            <span className="admin-status is-live">ตัวอย่างจาก {house.code}</span>
          </div>

          <div className="admin-house-cover-row">
            <div className="admin-house-cover">
              <Image
                src={coverImageSrc}
                alt={house.name}
                fill
                sizes="260px"
                unoptimized={Boolean(coverPreviewUrl)}
              />
            </div>
            <label className="admin-upload-dropzone">
              <Upload size={18} strokeWidth={1.8} />
              <span>{coverFile ? coverFile.name : "เปลี่ยนรูปหน้าปก"}</span>
              <input name="coverImageFile" type="file" accept="image/*" onChange={updateCoverImage} />
            </label>
          </div>

          <div className="admin-form-grid two-cols">
            <label>
              <span>ชื่อแบบบ้าน</span>
              <input name="name" defaultValue={house.name} />
            </label>
            <label>
              <span>รหัสแบบบ้าน</span>
              <input name="code" defaultValue={house.code} />
            </label>
            <label>
              <span>ราคาเริ่มต้น</span>
              <input name="startingPrice" defaultValue={house.startingPrice} />
            </label>
            <label>
              <span>จำนวนชั้น</span>
              <input name="floorCount" type="number" min={1} inputMode="numeric" defaultValue={floorCount} />
            </label>
          </div>

          <label>
            <span>คำอธิบาย</span>
            <textarea name="description" defaultValue={house.description} rows={4} />
          </label>
        </div>
      </section>

      <section className="admin-floorplan-panel" aria-labelledby="admin-floorplan-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Floor Plan</p>
            <h2 id="admin-floorplan-title">รูปแปลนบ้าน</h2>
          </div>
          <button type="button" className="admin-secondary-button" onClick={addFloorPlan}>
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มแปลน
          </button>
        </div>

        <div className="admin-floorplan-grid">
          {editableFloorPlans.map((plan, index) => {
            const imageSrc = plan.previewUrl ?? plan.image;

            return (
            <article className="admin-floorplan-card" key={plan.id}>
              <input type="hidden" name="floorPlanImageUrl" value={plan.persistedImage ?? ""} />
              {imageSrc ? (
                <div className="admin-floorplan-image">
                  <Image
                    src={imageSrc}
                    alt={plan.title}
                    fill
                    sizes="220px"
                    unoptimized={Boolean(plan.previewUrl)}
                  />
                </div>
              ) : (
                <div className="admin-floorplan-placeholder">
                  <FileImage size={28} strokeWidth={1.7} />
                  <span>ยังไม่ได้เลือกรูป</span>
                </div>
              )}
              <label>
                <span>ชื่อแปลน</span>
                <input
                  name="floorPlanTitle"
                  value={plan.title}
                  onChange={(event) => updateFloorPlanTitle(plan.id, event.target.value)}
                />
              </label>
              <label className="admin-upload-inline">
                <FileImage size={16} strokeWidth={1.8} />
                <span>{plan.fileName ? plan.fileName : `เปลี่ยนรูปแปลน ${index + 1}`}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateFloorPlanImage(plan.id, event)}
                />
              </label>
              <button
                type="button"
                className="admin-floorplan-remove"
                onClick={() => removeFloorPlan(plan.id)}
              >
                <Trash2 size={15} strokeWidth={1.8} />
                ลบแปลน
              </button>
            </article>
            );
          })}
        </div>
      </section>

      <section className="admin-package-panel" aria-labelledby="admin-package-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Package</p>
            <h2 id="admin-package-title">รายละเอียดแพ็กเกจที่โชว์บนหน้าแบบบ้าน</h2>
          </div>
        </div>
        <div className="admin-package-grid">
          <label>
            <Home size={19} strokeWidth={1.7} />
            <span>ขนาดตัวบ้าน</span>
            <input name="houseSize" defaultValue={house.houseSize} />
          </label>
          <label>
            <Ruler size={19} strokeWidth={1.7} />
            <span>พื้นที่ใช้สอย</span>
            <input name="usableArea" defaultValue={house.usableArea} />
          </label>
          <label>
            <Maximize2 size={19} strokeWidth={1.7} />
            <span>ขนาดที่ดิน</span>
            <input name="landSize" defaultValue={house.landSize} />
          </label>
          <label>
            <BedDouble size={19} strokeWidth={1.7} />
            <span>ห้องนอน</span>
            <input name="bedrooms" type="number" min={0} defaultValue={house.bedrooms} />
          </label>
          <label>
            <Bath size={19} strokeWidth={1.7} />
            <span>ห้องน้ำ</span>
            <input name="bathrooms" type="number" min={0} defaultValue={house.bathrooms} />
          </label>
          <label>
            <Car size={19} strokeWidth={1.7} />
            <span>ที่จอดรถ</span>
            <input name="parking" type="number" min={0} defaultValue={house.parking} />
          </label>
        </div>
      </section>

      <section className="admin-save-panel" aria-label="บันทึกการแก้ไขแบบบ้าน">
        <div>
          <p className="admin-eyebrow">Save Changes</p>
          <h2>บันทึกข้อมูลแบบบ้านทั้งหมด</h2>
          <p>
            ระบบจะบีบรูปเป็น WebP ก่อนอัปโหลด แล้วค่อยบันทึกข้อมูลหลัก รูปแปลน และแพ็กเกจทั้งหมด
          </p>
          {uploadError ? <p className="admin-inline-error">{uploadError}</p> : null}
        </div>
        <button type="submit" className="admin-primary-button" disabled={isSaving}>
          <Save size={16} strokeWidth={1.8} />
          {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไขทั้งหมด"}
        </button>
      </section>
    </form>
  );
}

