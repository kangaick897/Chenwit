"use client";

import Image from "next/image";
import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { FileImage, Plus, Save, Trash2 } from "lucide-react";

import { createProject, saveProject } from "@/app/admin/actions";
import type { ProjectCategory } from "@/data/projects";
import { compressImageFile } from "@/lib/client-image-compression";
import type { AdminProject } from "@/lib/projects";

type ProjectEditorFormProps = {
  categories: ProjectCategory[];
  project?: AdminProject;
};

type EditableGalleryImage = {
  id: string;
  image: string | null;
  persistedImage: string | null;
  previewUrl: string | null;
  uploadFile: File | null;
};

export function ProjectEditorForm({ categories, project }: ProjectEditorFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editableGallery, setEditableGallery] = useState<EditableGalleryImage[]>(() =>
    (project?.gallery ?? []).map((image, index) => ({
      id: `existing-gallery-${index}`,
      image,
      persistedImage: image,
      previewUrl: null,
      uploadFile: null,
    })),
  );
  const isEditing = Boolean(project);

  const appendGalleryFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));

    if (files.length === 0) {
      return;
    }

    const nextImages: EditableGalleryImage[] = files.map((file, index) => ({
      id: `draft-gallery-${Date.now()}-${index}`,
      image: null,
      persistedImage: null,
      previewUrl: URL.createObjectURL(file),
      uploadFile: file,
    }));

    setEditableGallery((images) => [...images, ...nextImages]);
  };

  const removeGalleryImage = (id: string) => {
    setEditableGallery((images) => images.filter((image) => image.id !== id));
  };

  const updateGalleryImage = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setEditableGallery((images) =>
      images.map((image) =>
        image.id === id
          ? {
              ...image,
              previewUrl: URL.createObjectURL(file),
              uploadFile: file,
            }
          : image,
      ),
    );
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);

    if (!isEditing && !coverFile) {
      setUploadError("กรุณาเลือกรูปหน้าปกก่อนบันทึก");
      return;
    }

    setIsPreparingImages(true);
    const formData = new FormData(event.currentTarget);

    void (async () => {
      formData.delete("coverImageFile");
      formData.delete("galleryImageUpload");

      if (coverFile) {
        const compressedCover = await compressImageFile(coverFile, { maxSize: 1600, quality: 0.84 });
        formData.append("coverImageFile", compressedCover);
      }

      for (const image of editableGallery) {
        if (image.uploadFile) {
          const compressedGalleryImage = await compressImageFile(image.uploadFile, { maxSize: 1800, quality: 0.84 });
          formData.append("galleryImageUpload", compressedGalleryImage);
        } else {
          formData.append("galleryImageUpload", "");
        }
      }

      setIsPreparingImages(false);
      startTransition(() => {
        void (isEditing ? saveProject(formData) : createProject(formData));
      });
    })().catch(() => {
      setIsPreparingImages(false);
      setUploadError("เตรียมรูปภาพไม่สำเร็จ กรุณาลองเลือกรูปใหม่อีกครั้ง");
    });
  };

  const isSaving = isPreparingImages || isPending;
  const coverImageSrc = coverPreviewUrl ?? project?.coverImageUrl ?? "";

  return (
    <form onSubmit={handleSubmit} className="admin-house-edit-form">
      <input type="hidden" name="isPublished" value={project?.isPublished === false ? "off" : "on"} />
      {project ? (
        <>
          <input type="hidden" name="id" value={project.id} />
          <input type="hidden" name="slug" value={project.slug} />
          <input type="hidden" name="coverImageUrl" value={project.coverImageUrl} />
          {project.gallery.map((image) => (
            <input key={image} type="hidden" name="originalProjectImageUrl" value={image} />
          ))}
        </>
      ) : null}

      <section className="admin-house-editor" aria-labelledby="admin-project-editor-title">
        <div className="admin-form-panel admin-house-main-form">
          <div className="admin-panel-head">
            <div>
              <p className="admin-eyebrow">Project Editor</p>
              <h2 id="admin-project-editor-title">{isEditing ? "ข้อมูลผลงาน" : "เพิ่มผลงานใหม่"}</h2>
            </div>
          </div>

          <div className="admin-house-cover-row admin-house-cover-row-single">
            <label className="admin-house-cover admin-image-upload">
              {coverImageSrc ? (
                <Image
                  src={coverImageSrc}
                  alt={project?.title ?? "ตัวอย่างรูปหน้าปกผลงาน"}
                  fill
                  sizes="260px"
                  unoptimized={Boolean(coverPreviewUrl)}
                />
              ) : (
                <div className="admin-cover-placeholder">ยังไม่มีรูปหน้าปก</div>
              )}
              <span className="admin-image-upload-action">
                {coverImageSrc ? "เปลี่ยนรูปหน้าปก" : "อัปโหลดรูปหน้าปก"}
              </span>
              <input name="coverImageFile" type="file" accept="image/*" onChange={updateCoverImage} />
            </label>
          </div>

          <div className="admin-form-grid two-cols">
            <label>
              <span>ชื่อผลงาน</span>
              <input name="title" required defaultValue={project?.title} placeholder="เช่น บ้านพักอาศัย บางนา" />
            </label>
            <label>
              <span>หมวดหมู่</span>
              <select name="category" defaultValue={project?.category ?? categories[0]?.slug}>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>สถานที่</span>
              <input name="location" defaultValue={project?.location} placeholder="เช่น กรุงเทพฯ" />
            </label>
          </div>

          {uploadError ? <p className="admin-inline-error">{uploadError}</p> : null}
        </div>
      </section>

      <section className="admin-package-panel admin-project-detail-panel" aria-labelledby="admin-project-options-title">
        <div className="admin-panel-head">
          <label className="admin-section-check">
            <input name="showDetails" type="checkbox" defaultChecked={project?.showDetails ?? true} />
            <span>
              <strong id="admin-project-options-title">รายละเอียดเสริม</strong>
            </span>
          </label>
        </div>

        <div className="admin-form-grid two-cols">
          <label>
            <span>สถานะ</span>
            <input name="status" defaultValue={project?.status} placeholder="เช่น ส่งมอบแล้ว" />
          </label>
          <label>
            <span>ปีที่ดำเนินงาน</span>
            <input name="year" defaultValue={project?.year} placeholder="เช่น 2569" />
          </label>
          <label>
            <span>พื้นที่โดยประมาณ</span>
            <input name="area" defaultValue={project?.area} placeholder="เช่น 250 ตร.ม." />
          </label>
          <label className="admin-form-wide">
            <span>ขอบเขตงาน</span>
            <input name="scope" defaultValue={project?.scope} placeholder="เช่น ออกแบบและก่อสร้าง" />
          </label>
          <label className="admin-form-wide">
            <span>คำอธิบาย</span>
            <textarea name="description" rows={4} defaultValue={project?.description} />
          </label>
        </div>
      </section>

      <section className="admin-floorplan-panel" aria-labelledby="admin-project-gallery-title">
        <div className="admin-panel-head">
          <div>
            <p className="admin-eyebrow">Gallery</p>
            <h2 id="admin-project-gallery-title">รูปเพิ่มเติม</h2>
          </div>
        </div>

        <div className="admin-project-gallery-grid">
          {editableGallery.map((image, index) => {
            const imageSrc = image.previewUrl ?? image.image;

            return (
              <article className="admin-project-gallery-card" key={image.id}>
                <input type="hidden" name="galleryImageUrl" value={image.persistedImage ?? ""} />
                <label
                  className={imageSrc
                    ? "admin-project-gallery-image admin-image-upload"
                    : "admin-project-gallery-add admin-image-upload"}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`รูปผลงาน ${index + 1}`}
                      fill
                      sizes="180px"
                      unoptimized={Boolean(image.previewUrl)}
                    />
                  ) : (
                    <FileImage size={22} strokeWidth={1.8} />
                  )}
                  <span className={imageSrc ? "admin-image-upload-action" : undefined}>
                    {imageSrc ? `เปลี่ยนรูปที่ ${index + 1}` : `เลือกรูปที่ ${index + 1}`}
                  </span>
                  <input type="file" accept="image/*" onChange={(event) => updateGalleryImage(image.id, event)} />
                </label>
                <button
                  type="button"
                  className="admin-gallery-remove"
                  onClick={() => removeGalleryImage(image.id)}
                  aria-label={`ลบรูปที่ ${index + 1}`}
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </article>
            );
          })}
          <label className="admin-project-gallery-add">
            <Plus size={24} strokeWidth={1.8} />
            <span>เพิ่มรูปภาพ</span>
            <small>ระบบจะบีบเป็น WebP ก่อนบันทึก</small>
            <input type="file" accept="image/*" multiple onChange={(event) => appendGalleryFiles(event.target.files)} />
          </label>
        </div>
      </section>

      <section className="admin-save-panel" aria-label="บันทึกข้อมูลผลงาน">
        <div>
          <p className="admin-eyebrow">Save Changes</p>
          <h2>{isEditing ? "บันทึกข้อมูลผลงาน" : "สร้างผลงาน"}</h2>
        </div>
        <button type="submit" className="admin-primary-button" disabled={isSaving}>
          <Save size={16} strokeWidth={1.8} />
          {isSaving ? "กำลังบันทึก..." : isEditing ? "บันทึกข้อมูลผลงาน" : "สร้างผลงาน"}
        </button>
      </section>
    </form>
  );
}
