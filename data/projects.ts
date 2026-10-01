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

const gallerySet = [
  "/assets/houses/ch-b-420.png",
  "/assets/houses/ch-b-325.png",
  "/assets/houses/ch-b-250.png",
  "/assets/demo/houses/m8212.webp",
];

export const projects: Project[] = [
  {
    slug: "family-home-bangna",
    title: "บ้านพักอาศัยครอบครัว บางนา",
    location: "บางนา, กรุงเทพมหานคร",
    image: "/assets/houses/ch-b-420.png",
    category: "completed",
    status: "ส่งมอบแล้ว",
    year: "2569",
    area: "420 ตร.ม.",
    scope: "ออกแบบและก่อสร้าง",
    description: "บ้านพักอาศัยสองชั้นสำหรับครอบครัวใหญ่ วางพื้นที่รับแขก ห้องนอน และที่จอดรถให้ใช้งานต่อเนื่องกัน",
    highlights: ["บ้านสองชั้น 4 ห้องนอน", "พื้นที่จอดรถ 3 คัน", "ปรับวัสดุตามงบประมาณจริง"],
    gallery: gallerySet,
  },
  {
    slug: "modern-home-rangsit",
    title: "บ้านโมเดิร์น รังสิต",
    location: "รังสิต, ปทุมธานี",
    image: "/assets/houses/ch-b-325.png",
    category: "construction",
    status: "กำลังก่อสร้าง",
    year: "2569",
    area: "325 ตร.ม.",
    scope: "งานโครงสร้างและสถาปัตย์",
    description: "ไซต์งานบ้านโมเดิร์นที่เน้นช่องเปิดกว้างและแสงธรรมชาติ พร้อมคุมสัดส่วนพื้นที่ใช้สอยให้เหมาะกับครอบครัว",
    highlights: ["โครงสร้างคอนกรีตเสริมเหล็ก", "ช่องแสงขนาดใหญ่", "จัดพื้นที่ส่วนกลางโปร่ง"],
    gallery: ["/assets/houses/ch-b-325.png", "/assets/houses/ch-b-250.png", "/assets/demo/houses/m8211.webp"],
  },
  {
    slug: "contemporary-home-nonthaburi",
    title: "บ้านคอนเทมโพรารี นนทบุรี",
    location: "เมืองนนทบุรี, นนทบุรี",
    image: "/assets/houses/ch-b-250.png",
    category: "completed",
    status: "ส่งมอบแล้ว",
    year: "2568",
    area: "250 ตร.ม.",
    scope: "ออกแบบและก่อสร้าง",
    description: "บ้านครอบครัวขนาดกลางที่เน้นความเรียบร้อยของรายละเอียดภายนอกและฟังก์ชันภายในที่ดูแลง่าย",
    highlights: ["3 ห้องนอน 3 ห้องน้ำ", "หลังคาทรงร่วมสมัย", "พื้นที่ซักล้างแยกชัดเจน"],
    gallery: ["/assets/houses/ch-b-250.png", "/assets/houses/ch-b-240.png", "/assets/demo/houses/m8210.webp"],
  },
  {
    slug: "extension-garage-ladprao",
    title: "ต่อเติมโรงจอดรถ ลาดพร้าว",
    location: "ลาดพร้าว, กรุงเทพมหานคร",
    image: "/assets/demo/houses/m8211.webp",
    category: "turnkey",
    status: "ส่งมอบแล้ว",
    year: "2568",
    area: "85 ตร.ม.",
    scope: "ต่อเติมและปรับพื้นที่",
    description: "งานต่อเติมพื้นที่โรงจอดรถและทางเดินข้างบ้าน คุมงานให้เข้ากับบ้านเดิมและลดผลกระทบต่อการอยู่อาศัย",
    highlights: ["โครงหลังคาใหม่", "ปรับพื้นทางเข้า", "งานไฟและระบายน้ำ"],
    gallery: ["/assets/demo/houses/m8211.webp", "/assets/demo/houses/m8212.webp", "/assets/houses/ch-b-240.png"],
  },
  {
    slug: "renovation-home-office",
    title: "รีโนเวทโฮมออฟฟิศ พระราม 9",
    location: "พระราม 9, กรุงเทพมหานคร",
    image: "/assets/demo/houses/m8210.webp",
    category: "renovation",
    status: "กำลังเก็บงาน",
    year: "2569",
    area: "190 ตร.ม.",
    scope: "รีโนเวทภายในและภายนอก",
    description: "ปรับบ้านเดิมให้รองรับการทำงานและอยู่อาศัยในอาคารเดียวกัน โดยแยกโซนรับลูกค้าออกจากพื้นที่ส่วนตัว",
    highlights: ["จัด circulation ใหม่", "เปลี่ยนผิว facade", "ปรับระบบไฟและฝ้า"],
    gallery: ["/assets/demo/houses/m8210.webp", "/assets/demo/interior-preview.webp", "/assets/houses/ch-a-145.png"],
  },
  {
    slug: "single-house-minburi",
    title: "บ้านชั้นเดียว มีนบุรี",
    location: "มีนบุรี, กรุงเทพมหานคร",
    image: "/assets/houses/ch-a-145.png",
    category: "completed",
    status: "ส่งมอบแล้ว",
    year: "2568",
    area: "145 ตร.ม.",
    scope: "ก่อสร้างบ้านพักอาศัย",
    description: "บ้านชั้นเดียวที่วางพื้นที่ให้ผู้สูงอายุใช้งานง่าย ลดระดับต่างพื้น และเชื่อมสวนเข้ากับพื้นที่นั่งเล่น",
    highlights: ["พื้นต่างระดับน้อย", "ห้องนอนใช้งานสะดวก", "ดูแลรักษาง่าย"],
    gallery: ["/assets/houses/ch-a-145.png", "/assets/houses/ch-b-240.png", "/assets/demo/houses/m8209.webp"],
  },
  {
    slug: "site-update-sai-mai",
    title: "ไซต์งานบ้านสองชั้น สายไหม",
    location: "สายไหม, กรุงเทพมหานคร",
    image: "/assets/demo/houses/m8212.webp",
    category: "construction",
    status: "งานโครงสร้าง",
    year: "2569",
    area: "275 ตร.ม.",
    scope: "ก่อสร้างบ้านใหม่",
    description: "อัปเดตไซต์งานช่วงโครงสร้างหลัก ตรวจแนวคาน เสา และพื้นที่เตรียมงานระบบก่อนเข้าสู่งานสถาปัตย์",
    highlights: ["ตรวจระดับพื้น", "เตรียมงานระบบ", "คุมระยะหน้างาน"],
    gallery: ["/assets/demo/houses/m8212.webp", "/assets/houses/ch-b-275.png", "/assets/houses/ch-b-420.png"],
  },
  {
    slug: "classic-home-pinklao",
    title: "บ้านสไตล์คลาสสิก ปิ่นเกล้า",
    location: "ปิ่นเกล้า, กรุงเทพมหานคร",
    image: "/assets/houses/ch-b-240.png",
    category: "completed",
    status: "ส่งมอบแล้ว",
    year: "2568",
    area: "240 ตร.ม.",
    scope: "ออกแบบและก่อสร้าง",
    description: "บ้านสองชั้นโทนอบอุ่นที่เน้นรายละเอียดช่องเปิดและชายคาให้เหมาะกับสภาพอากาศ",
    highlights: ["พื้นที่รับแขกกว้าง", "งานบัวและกรอบช่องเปิด", "จอดรถ 2 คัน"],
    gallery: ["/assets/houses/ch-b-240.png", "/assets/demo/houses/m8209.webp", "/assets/houses/ch-b-250.png"],
  },
  {
    slug: "turnkey-kitchen-extension",
    title: "ต่อเติมครัวหลังบ้าน วัชรพล",
    location: "วัชรพล, กรุงเทพมหานคร",
    image: "/assets/demo/interior-preview.webp",
    category: "turnkey",
    status: "ส่งมอบแล้ว",
    year: "2569",
    area: "45 ตร.ม.",
    scope: "ต่อเติมครัวและซักล้าง",
    description: "ปรับพื้นที่หลังบ้านให้เป็นครัวและพื้นที่ซักล้างที่ใช้งานจริงได้ทุกวัน พร้อมระบบระบายอากาศ",
    highlights: ["ครัวไทยแยกโซน", "ระบบระบายอากาศ", "พื้นกันลื่น"],
    gallery: ["/assets/demo/interior-preview.webp", "/assets/houses/ch-a-145.png", "/assets/demo/houses/m8210.webp"],
  },
  {
    slug: "renovation-townhome",
    title: "รีโนเวททาวน์โฮม เกษตร",
    location: "เกษตร, กรุงเทพมหานคร",
    image: "/assets/demo/houses/m8209.webp",
    category: "renovation",
    status: "กำลังดำเนินการ",
    year: "2569",
    area: "160 ตร.ม.",
    scope: "รีโนเวทเต็มหลัง",
    description: "รีโนเวททาวน์โฮมเดิมให้รับแสงมากขึ้น ปรับพื้นที่ชั้นล่างให้เหมาะกับครอบครัวรุ่นใหม่",
    highlights: ["เปิดพื้นที่ชั้นล่าง", "ปรับห้องน้ำใหม่", "เปลี่ยนระบบไฟ"],
    gallery: ["/assets/demo/houses/m8209.webp", "/assets/demo/interior-preview.webp", "/assets/houses/ch-b-325.png"],
  },
  {
    slug: "luxury-home-ramintra",
    title: "บ้านหรู รามอินทรา",
    location: "รามอินทรา, กรุงเทพมหานคร",
    image: "/assets/houses/ch-b-275.png",
    category: "completed",
    status: "ส่งมอบแล้ว",
    year: "2568",
    area: "275 ตร.ม.",
    scope: "ออกแบบและก่อสร้าง",
    description: "บ้านสองชั้นที่เน้นบรรยากาศหรูแต่ใช้งานง่าย จัดแสงภายนอกและพื้นที่สวนให้บ้านดูอบอุ่นช่วงเย็น",
    highlights: ["facade สมมาตร", "แสงไฟภายนอก", "พื้นที่สวนหน้าบ้าน"],
    gallery: ["/assets/houses/ch-b-275.png", "/assets/houses/ch-b-420.png", "/assets/demo/houses/m8211.webp"],
  },
  {
    slug: "construction-watcharapol",
    title: "ไซต์งานก่อสร้าง วัชรพล",
    location: "วัชรพล, กรุงเทพมหานคร",
    image: "/assets/demo/houses/m8212.webp",
    category: "construction",
    status: "งานสถาปัตย์",
    year: "2569",
    area: "310 ตร.ม.",
    scope: "ก่อสร้างบ้านใหม่",
    description: "ไซต์งานช่วงงานสถาปัตย์ ตรวจแนวผนัง ฉาบ และรายละเอียดช่องเปิดก่อนเข้าสู่งานสี",
    highlights: ["ตรวจงานฉาบ", "เตรียมงานสี", "คุมรายละเอียดช่องเปิด"],
    gallery: ["/assets/demo/houses/m8212.webp", "/assets/houses/ch-b-325.png", "/assets/demo/houses/m8210.webp"],
  },
];
