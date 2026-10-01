export type House = {
  slug: string;
  code: string;
  name: string;
  image: string;
  style: string;
  location: string;
  startingPrice: string;
  floors: string;
  usableArea: string;
  houseSize: string;
  landSize: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  floorPlans?: {
    title: string;
    image: string;
  }[];
};

const mockFloorPlans = [
  {
    title: "ชั้น 1",
    image: "/assets/floorplans/mock-floor-1.png",
  },
  {
    title: "ชั้น 2",
    image: "/assets/floorplans/mock-floor-2.png",
  },
];

export const houses: House[] = [
  {
    slug: "ch-b-420",
    code: "CH B 420",
    name: "CH B 420",
    image: "/assets/houses/ch-b-420.png",
    style: "บ้านสองชั้น",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "4,200,000 บาท",
    floors: "2 ชั้น",
    usableArea: "420 ตร.ม.",
    houseSize: "กว้าง 18 ม. ลึก 22 ม.",
    landSize: "เริ่มต้น 100 ตร.ว.",
    description: "บ้านสองชั้นขนาดใหญ่ที่วางฟังก์ชันครบสำหรับครอบครัว เน้นพื้นที่โปร่งและภาพลักษณ์หรูแบบร่วมสมัย",
    bedrooms: 4,
    bathrooms: 5,
    parking: 3,
    floorPlans: mockFloorPlans,
  },
  {
    slug: "ch-b-325",
    code: "CH B 325",
    name: "CH B 325",
    image: "/assets/houses/ch-b-325.png",
    style: "บ้านสองชั้น",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "3,250,000 บาท",
    floors: "2 ชั้น",
    usableArea: "325 ตร.ม.",
    houseSize: "กว้าง 16 ม. ลึก 20 ม.",
    landSize: "เริ่มต้น 80 ตร.ว.",
    description: "ดีไซน์คลาสสิกอบอุ่นพร้อมพื้นที่ใช้งานกว้าง เหมาะกับบ้านครอบครัวที่ต้องการความสง่างาม",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    floorPlans: mockFloorPlans,
  },
  {
    slug: "ch-b-250",
    code: "CH B 250",
    name: "CH B 250",
    image: "/assets/houses/ch-b-250.png",
    style: "บ้านสองชั้น",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "2,500,000 บาท",
    floors: "2 ชั้น",
    usableArea: "250 ตร.ม.",
    houseSize: "กว้าง 14 ม. ลึก 18 ม.",
    landSize: "เริ่มต้น 70 ตร.ว.",
    description: "บ้านครอบครัวขนาดกลางที่จัดพื้นที่ได้ลงตัว ดูแลรักษาง่าย และรองรับการใช้งานในชีวิตประจำวัน",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    floorPlans: mockFloorPlans,
  },
  {
    slug: "ch-b-240",
    code: "CH B 240",
    name: "CH B 240",
    image: "/assets/houses/ch-b-240.png",
    style: "บ้านสองชั้น",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "2,400,000 บาท",
    floors: "2 ชั้น",
    usableArea: "240 ตร.ม.",
    houseSize: "กว้าง 14 ม. ลึก 17 ม.",
    landSize: "เริ่มต้น 65 ตร.ว.",
    description: "แบบบ้านสองชั้นโทนอบอุ่น มีพื้นที่ส่วนกลางพอดีตัวและบรรยากาศเป็นกันเองสำหรับครอบครัว",
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    floorPlans: mockFloorPlans,
  },
  {
    slug: "ch-b-275",
    code: "CH B 275",
    name: "CH B 275",
    image: "/assets/houses/ch-b-275.png",
    style: "บ้านสองชั้น",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "สอบถามราคา",
    floors: "2 ชั้น",
    usableArea: "275 ตร.ม.",
    houseSize: "กว้าง 15 ม. ลึก 18 ม.",
    landSize: "เริ่มต้น 75 ตร.ว.",
    description: "บ้านหรูสไตล์ร่วมสมัยที่เน้นสมดุลของหน้าบ้าน ช่องเปิด และพื้นที่สวนให้บ้านดูน่าอยู่",
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    floorPlans: mockFloorPlans,
  },
  {
    slug: "ch-a-145",
    code: "CH A 145",
    name: "CH A 145",
    image: "/assets/houses/ch-a-145.png",
    style: "บ้านชั้นเดียว",
    location: "ตัวอย่างแบบบ้าน",
    startingPrice: "สอบถามราคา",
    floors: "1 ชั้น",
    usableArea: "145 ตร.ม.",
    houseSize: "กว้าง 12 ม. ลึก 14 ม.",
    landSize: "เริ่มต้น 55 ตร.ว.",
    description: "บ้านชั้นเดียวที่ใช้งานง่าย เดินสะดวก เหมาะกับครอบครัวเล็กหรือบ้านที่ต้องการดูแลไม่ยุ่งยาก",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    floorPlans: mockFloorPlans,
  },
];

export const featuredHouses = houses.slice(0, 4);
