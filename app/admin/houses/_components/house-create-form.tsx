"use client";

import Image from "next/image";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";

import { createHouse } from "@/app/admin/actions";
import { compressImageFile } from "@/lib/client-image-compression";

export function HouseCreateForm() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [isPending, startTransition] = useTransition();

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
      const compressedCover = await compressImageFile(coverFile, { maxSize: 1600, quality: 0.84 });
      formData.append("coverImageFile", compressedCover);

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

          <div className="admin-form-grid three-cols">
            <label>
              <span>ห้องนอน</span>
              <input name="bedrooms" type="number" min={0} defaultValue={0} />
            </label>
            <label>
              <span>ห้องน้ำ</span>
              <input name="bathrooms" type="number" min={0} defaultValue={0} />
            </label>
            <label>
              <span>ที่จอดรถ</span>
              <input name="parking" type="number" min={0} defaultValue={0} />
            </label>
          </div>

          <label>
            <span>คำอธิบาย</span>
            <textarea name="description" rows={4} placeholder="รายละเอียดแบบบ้านโดยย่อ" />
          </label>

          {uploadError ? <p className="admin-inline-error">{uploadError}</p> : null}
        </div>
      </section>

      <section className="admin-save-panel" aria-label="บันทึกแบบบ้านใหม่">
        <div>
          <p className="admin-eyebrow">Save Changes</p>
          <h2>สร้างแบบบ้านและไปแก้รายละเอียดต่อ</h2>
          <p>ระบบจะบีบรูปเป็น WebP แล้วอัปโหลดเข้า Supabase Storage ก่อนสร้างข้อมูล</p>
        </div>
        <button type="submit" className="admin-primary-button" disabled={isSaving}>
          <Save size={16} strokeWidth={1.8} />
          {isSaving ? "กำลังสร้าง..." : "สร้างแบบบ้าน"}
        </button>
      </section>
    </form>
  );
}
