# MoneyFlow (Mini Projec)

เว็บแอปสำหรับติดตามรายรับ-รายจ่ายส่วนตัว ให้ผู้ใช้บันทึกรายการเงิน จัดหมวดหมู่เอง และดูภาพรวมการใช้จ่ายผ่านกราฟ

โปรเจกต์นี้ทำขึ้นเพื่อฝึกการเขียนเชื่อมต่อ Django REST API เข้ากับ React frontend 

## ฟีเจอร์

- **ระบบสมาชิก** — สมัครและเข้าสู่ระบบด้วย JWT (access token + refresh token) พร้อมต่ออายุ token อัตโนมัติเมื่อหมดอายุ
- **Category** — สร้างหมวดหมู่รายรับ/รายจ่ายเอง กำหนดสีและไอคอนได้ (ใช้ไอคอนจาก [lucide-react](https://lucide.dev))
- **Transaction** — บันทึกรายการรายรับ/รายจ่าย ผูกกับหมวดหมู่ ระบุจำนวนเงิน วันที่ และโน้ตเพิ่มเติมได้
- **CRUD** — สร้าง อ่าน แก้ไข ลบ ได้ทั้ง Category และ Transaction
- **ตัวกรองตามวันที่** — ดูรายการแบบวันนี้ เมื่อวาน สัปดาห์นี้ เดือนนี้ หรือเลือกวันที่เอง
- **สรุปยอดรวม** — ยอดรายรับ รายจ่าย และคงเหลือ ตามตัวกรองที่เลือก
- **กราฟ**
  - กราฟวงกลม แยกตามหมวดหมู่ เลือกดูรายเดือนได้ 
  - กราฟแท่งเปรียบเทียบรายรับ-รายจ่ายในแต่ละเดือน

## เทคโนโลยีที่ใช้

**Backend**
- Django
- Django REST Framework
- djangorestframework-simplejwt (ระบบยืนยันตัวตนแบบ JWT)

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios 
- React Router
- Recharts (แสดงผลกราฟ)
- lucide-react (ไอคอน)

## โครงสร้างโปรเจกต์
backend/
api/
models.py # Category, Transaction
serializers.py # DRF serializers
views.py # Generic CRUD views
urls.py

frontend/
src/
api.js # axios instance พร้อม JWT interceptor
constants.js # ชื่อ key ที่ใช้เก็บใน localStorage
iconOptions.js # รายการไอคอนและฟังก์ชันแปลงชื่อ → component
components/
Category.jsx # ฟอร์มสร้าง/แก้ไข category
Transaction.jsx # ฟอร์มสร้าง/แก้ไข transaction
Modal.jsx # popup กลางจอที่ใช้ร่วมกัน
ProtectedRoute.jsx # ตรวจสอบ/ต่ออายุ JWT ก่อนเข้าหน้าที่ต้อง login
Form.jsx # ฟอร์ม login/register ที่ใช้ร่วมกัน
pages/
Home.jsx # Dashboard: สรุปยอด, categories, กราฟ, transaction list
Login.jsx
Register.jsx
NotFound.jsx

## โครงสร้างข้อมูล

**Category**
| Field | ประเภท | หมายเหตุ |
|---|---|---|
| name | CharField | |
| color | CharField | รหัสสี hex เช่น `#3B82F6` |
| icon | CharField | ชื่อไอคอน เช่น `shopping-cart` |
| user | ForeignKey | เจ้าของข้อมูล  |

**Transaction**
| Field | ประเภท | หมายเหตุ |
|---|---|---|
| category | ForeignKey | เป็น null |
| type | CharField | `income` หรือ `expense` |
| amount | DecimalField | |
| note | TextField | ไม่บังคับ |
| date | DateField | |
| created_at / updated_at | DateTimeField | ตั้งค่าอัตโนมัติ |
| user | ForeignKey | เจ้าของข้อมูล |

## API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/api/create/user/` | สมัครสมาชิกใหม่ |
| POST | `/api/token/` | เข้าสู่ระบบ รับ access + refresh token |
| POST | `/api/token/refresh/` | ขอ access token ใหม่ |
| GET / POST | `/api/category/` | ดู / สร้าง category |
| GET / PATCH / DELETE | `/api/category/detail/<id>/` | แก้ไข / ลบ category |
| GET / POST | `/api/transaction/` | ดู / สร้าง transaction |
| GET / PATCH / DELETE | `/api/transaction/detail/<id>/` | แก้ไข / ลบ transaction |

ทุก endpoint ยกเว้นสมัครสมาชิกและเข้าสู่ระบบ ต้องแนบ JWT access token ผ่าน header `Authorization: Bearer <token>` และแต่ละ user จะเห็น/แก้ไขได้เฉพาะข้อมูลของตัวเองเท่านั้น

## วิธีติดตั้งและรัน

### Backend

```bash
cd backend
uv run python manage.py runserver
```
### Frontend
```bash
cd frontend
npm install
```

```bash
npm run dev
```

