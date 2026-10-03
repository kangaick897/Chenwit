"use client";

import Image from "next/image";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import {
  Bath,
  BedDouble,
  Car,
  CookingPot,
  FileImage,
  Home,
  Plus,
  Ruler,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { createHouse } from "@/app/admin/actions";
import { compressImageFile } from "@/lib/client-image-compression";

type DraftFloorPlan = {
  id: string;
  previewUrl: string | null;
  title: string;
  uploadFile: File | null;
};

export function HouseCreateForm() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [floorPlans, setFloorPlans] = useState<DraftFloorPlan[]>([]);

  const addFloorPlan = () => {
    setFloorPlans((plans) => [
      ...plans,
      {
        id: `draft-plan-${Date.now()}-${plans.length}`,
        previewUrl: null,
        title: `ชั้น ${plans.length + 1}`,
        uploadFile: null,
      },
    ]);
  };

  const removeFloorPlan = (id: string) => {
    setFloorPlans((plans) => plans.filter((plan) => plan.id !== id));
  };

  const updateFloorPlanTitle = (id: string, title: string) => {
    setFloorPlans((plans) => plans.map((plan) => (plan.id === id ? { ...plan, title } : plan)));
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
      setFloorPlans((plans) =>
        plans.map((plan) =>
          plan.id === id
            ? {
                ...plan,
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

    if (!coverFile) {
      setUploadError("กรุณาเลือกรูปหน้าปกก่อนบันทึก");
      return;
    }

    setIsPreparingImages(true);
    const formData = new FormData(event.currentTarget);

    void (async () => {
      formData.delete("coverImageFile");
      formData.delete("floorPlanUpload");
      const compressedCover = await compressImageFile(coverFile, { maxSize: 1600, quality: 0.84 });
      formData.append("coverImageFile", compressedCover);

      for (const plan of floorPlans) {
        if (plan.uploadFile) {
          const compressedFloorPlan = await compressImageFile(plan.uploadFile, { maxSize: 2000, quality: 0.86 });
          formData.append("floorPlanUpload", compressedFloorPlan);
        } else {
          formData.append("floorPlanUpload", "");
        }
      }

      setIsPreparingImages(false);
      startTransition(() => {
        void createHouse(formData);
      });
    })().catch(() => {
      setIsPreparingImages(false);
      setUploadError("เตรียมรูปภาพไม่สำเร็จ กรุณาลองเลือกรูปใหม่อีกครั้ง");
    });
  };

  const isSaving = isPreparingImages || isPending;

  return (
    <form onSubmit={handleSubmit} className="admin-house-edit-form">
      <section className="admin-house-editor" aria-labelledby="admin-house-create-title">
        <div className="admin-form-panel admin-house-main-form">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">New House</p>
              <h2 id="admin-house-create-title">เพิ่มแบบบ้านใหม่</h2>
            </div>
          </div>

          <div className="admin-toggle-group">
            <label className="admin-toggle-row admin-toggle-row-standalone">
              <input name="isPublished" type="checkbox" defaultChecked />
              <span>แสดงในแบบบ้าน</span>
            </label>
            <label className="admin-toggle-row admin-toggle-row-standalone">
              <input name="isFeatured" type="checkbox" />
              <span>แสดงในหน้าแรก</span>
            </label>
          </div>

          <div className="admin-house-cover-row">
            <div className="admin-house-cover">
              {coverPreviewUrl ? (
                <Image src={coverPreviewUrl} alt="ตัวอย่างรูปหน้าปก" fill sizes="260px" unoptimized />
              ) : (
                <div className="admin-cover-placeholder">เลือกรูปหน้าปก</div>
              )}
            </div>
            <label className="admin-upload-dropzone">
              <Upload size={18} strokeWidth={1.8} />
              <span>{coverFile ? coverFile.name : "อัปโหลดรูปหน้าปก"}</span>
              <input name="coverImageFile" type="file" accept="image/*" onChange={updateCoverImage} />
            </label>
          </div>

          <div className="admin-form-grid two-cols">
            <label>
              <span>ชื่อแบบบ้าน</span>
              <input name="name" required placeholder="เช่น บ้านครอบครัว 2 ชั้น" />
            </label>
            <label>
              <span>รหัสแบบบ้าน</span>
              <input name="code" required placeholder="เช่น CH B 420" />
            </label>
            <label>
              <span>สไตล์</span>
              <input name="style" placeholder="เช่น บ้านสองชั้น" />
            </label>
            <label>
              <span>ราคาเริ่มต้น</span>
              <input name="startingPrice" placeholder="เช่น สอบถามราคา" />
            </label>
            <label>
              <span>จำนวนชั้น</span>
              <input name="floorCount" type="number" min={1} inputMode="numeric" defaultValue={1} />
            </label>
            <label>
              <span>สถานที่/คำอธิบายสั้น</span>
              <input name="location" placeholder="เช่น ตัวอย่างแบบบ้าน" />
            </label>
          </div>

          <label>
            <span>คำอธิบาย</span>
            <textarea name="description" rows={4} placeholder="รายละเอียดแบบบ้านโดยย่อ" />
          </label>

          <div className="admin-form-grid two-cols">
            <label>
              <span>ลำดับการแสดงผล</span>
              <input name="sortOrder" type="number" inputMode="numeric" defaultValue={0} />
            </label>
          </div>

          {uploadError ? <p className="admin-inline-error">{uploadError}</p> : null}
        </div>
      </section>

      <section className="admin-floorplan-panel" aria-labelledby="admin-floorplan-create-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Floor Plan</p>
            <h2 id="admin-floorplan-create-title">รูปแปลนบ้าน</h2>
          </div>
          <button type="button" className="admin-secondary-button" onClick={addFloorPlan}>
            <Plus size={16} strokeWidth={1.8} />
            เพิ่มแปลน
          </button>
        </div>

        <div className="admin-floorplan-grid">
          {floorPlans.map((plan, index) => (
            <article className="admin-floorplan-card" key={plan.id}>
              <label
                className={plan.previewUrl
                  ? "admin-floorplan-image admin-image-upload"
                  : "admin-floorplan-placeholder admin-image-upload"}
              >
                {plan.previewUrl ? (
                  <Image src={plan.previewUrl} alt={plan.title} fill sizes="220px" unoptimized />
                ) : (
                  <>
                    <FileImage size={28} strokeWidth={1.7} />
                    <span>เลือกรูปแปลน {index + 1}</span>
                  </>
                )}
                {plan.previewUrl ? <span className="admin-image-upload-action">เปลี่ยนรูปแปลน {index + 1}</span> : null}
                <input type="file" accept="image/*" onChange={(event) => updateFloorPlanImage(plan.id, event)} />
              </label>
              <label>
                <span>ชื่อแปลน</span>
                <input
                  name="floorPlanTitle"
                  value={plan.title}
                  onChange={(event) => updateFloorPlanTitle(plan.id, event.target.value)}
                />
              </label>
              <button type="button" className="admin-floorplan-remove" onClick={() => removeFloorPlan(plan.id)}>
                <Trash2 size={15} strokeWidth={1.8} />
                ลบแปลน
              </button>
            </article>
          ))}
          {floorPlans.length === 0 ? <div className="admin-empty-state">ยังไม่มีรูปแปลน กดเพิ่มแปลนเพื่ออัปโหลด</div> : null}
        </div>
      </section>

      <section className="admin-package-panel" aria-labelledby="admin-package-create-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Package</p>
            <h2 id="admin-package-create-title">รายละเอียดแพ็กเกจที่โชว์บนหน้าแบบบ้าน</h2>
          </div>
        </div>
        <div className="admin-package-grid">
          <label>
            <Home size={19} strokeWidth={1.7} />
            <span>ขนาดตัวบ้าน</span>
            <input name="houseSize" placeholder="เช่น กว้าง 18 ม. ลึก 22 ม." />
          </label>
          <label>
            <Ruler size={19} strokeWidth={1.7} />
            <span>พื้นที่ใช้สอย</span>
            <input name="usableArea" placeholder="เช่น 420 ตร.ม." />
          </label>
          <label>
            <CookingPot size={19} strokeWidth={1.7} />
            <span>ห้องครัว</span>
            <input name="kitchens" type="number" min={0} placeholder="จำนวนห้อง" />
          </label>
          <label>
            <BedDouble size={19} strokeWidth={1.7} />
            <span>ห้องนอน</span>
            <input name="bedrooms" type="number" min={0} defaultValue={0} />
          </label>
          <label>
            <Bath size={19} strokeWidth={1.7} />
            <span>ห้องน้ำ</span>
            <input name="bathrooms" type="number" min={0} defaultValue={0} />
          </label>
          <label>
            <Car size={19} strokeWidth={1.7} />
            <span>ที่จอดรถ</span>
            <input name="parking" type="number" min={0} defaultValue={0} />
          </label>
        </div>
      </section>

      <section className="admin-save-panel" aria-label="บันทึกแบบบ้านใหม่">
        <div>
          <p className="admin-eyebrow">Save Changes</p>
          <h2>สร้างแบบบ้านพร้อมข้อมูลทั้งหมด</h2>
          <p>ระบบจะบีบรูปเป็น WebP แล้วอัปโหลดรูปปกและรูปแปลนก่อนสร้างข้อมูลใน Supabase</p>
        </div>
        <button type="submit" className="admin-primary-button" disabled={isSaving}>
          <Save size={16} strokeWidth={1.8} />
          {isSaving ? "กำลังสร้าง..." : "สร้างแบบบ้าน"}
        </button>
      </section>
    </form>
  );
}
