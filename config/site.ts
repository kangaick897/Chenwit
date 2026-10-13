export const siteConfig = {
  companyName: "CHENWIT HOUSE BUILDER",
  brandShortName: "CH",
  brandSubtitle: "ศูนย์รับสร้างบ้าน",
  tagline: "บ้านที่ดี เริ่มจากความเข้าใจ",
  logo: "/assets/branding/chenwit-logo.jpg",
  logoBanner: "/assets/branding/chenwit-logo-banner-transparent.png",
  heroImage: "/assets/hero/chenwit-luxury-sunset.png",
  theme: {
    navy: "#121C20",
    gold: "#C19E6B",
    ivory: "#FDFDFC",
    cream: "#F3EEE6",
    taupe: "#806C53",
    grayBeige: "#D6CFC8",
    charcoal: "#373420",
  },
  contact: {
    officeTitle: "สำนักงานใหญ่",
    phone: "080-979-6155",
    lineId: "",
    lineUrl: "https://line.me/ti/p/4rA7xBAA9-",
    email: "",
    facebook: "https://www.facebook.com/",
    facebookLabel: "CHENWIT HOUSE BUILDER",
    address: "กรุงเทพมหานครและปริมณฑล",
    businessHours: [
      "วันจันทร์-วันเสาร์ ให้บริการตั้งแต่ 08.30-17.30",
      "วันอาทิตย์ นัดหมายล่วงหน้า",
    ],
  },
  navigation: [
    { label: "หน้าแรก", href: "/" },
    { label: "แบบบ้าน", href: "/houses" },
    { label: "ผลงาน", href: "/projects" },
    { label: "เกี่ยวกับเรา", href: "/about" },
    { label: "ติดต่อเรา", href: "/contact" },
  ],
  seo: {
    title: "CHENWIT HOUSE BUILDER | ออกแบบและสร้างบ้าน",
    description:
      "ออกแบบและสร้างบ้านสไตล์โมเดิร์น พร้อมดูแลทุกขั้นตอนตั้งแต่แนวคิดจนถึงส่งมอบ",
  },
  previewNotice:
    "LOCAL PREVIEW ONLY — ตรวจสอบสิทธิ์รูปภาพและข้อมูลติดต่อก่อนเผยแพร่",
} as const;
