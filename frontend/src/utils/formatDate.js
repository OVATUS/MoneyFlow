export const FILTER_OPTIONS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "today", label: "วันนี้" },
  { key: "yesterday", label: "เมื่อวาน" },
  { key: "week", label: "สัปดาห์นี้" },
  { key: "month", label: "เดือนนี้" },
  { key: "custom", label: "เลือกวัน" },
];

export const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

export const toISODate = (date) => {
  return date.toLocaleDateString("en-CA");
};

export const formatMonthLabel = (monthStr) => {
  // แยกปีและเดือนออกจากกัน
  const [year, month] = monthStr.split("-");
  
  // แปลงปี ค.ศ. เป็น พ.ศ.
  const buddhistYear = Number(year) + 543;
  
  // ดึงชื่อเดือนจาก Array และดึง 2 ตัวท้ายของปี พ.ศ. มาต่อกัน
  return `${THAI_MONTHS[Number(month) - 1]} ${String(buddhistYear).slice(-2)}`;
};