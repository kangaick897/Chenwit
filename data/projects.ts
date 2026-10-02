export type ProjectCategory = {
  slug: string;
  label: string;
  showInFilter?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  image: string;
  category: string;
  status: string;
  year: string;
  area: string;
  scope: string;
  description: string;
  highlights: string[];
  gallery: string[];
  showDetails?: boolean;
};

export const projectCategoryOptions: ProjectCategory[] = [
  { slug: "completed", label: "งานเสร็จแล้ว" },
  { slug: "construction", label: "งานก่อสร้าง" },
  { slug: "turnkey", label: "งานต่อเติม" },
  { slug: "renovation", label: "งานรีโนเวท" },
];

export const projectCategories: ProjectCategory[] = [{ slug: "all", label: "ทั้งหมด" }, ...projectCategoryOptions];

export const projects: Project[] = [];
