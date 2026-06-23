<div align="center">

<img src="docs/screenshots/homepage.png" alt="Itahari Namuna Hotel PMS" width="100%"/>

# 🏨 Itahari Namuna Hotel PMS

**A full-stack, enterprise-grade Hotel Property Management System**

[![Status](https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=for-the-badge)](https://hotelpms-bsee.onrender.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)](https://github.com/Rahultharu064/HOTELPMS)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white&style=flat-square)](https://nodejs.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=flat-square)](https://prisma.io)
[![MySQL](https://img.shields.io/badge/MySQL-Cloud-4479A1?logo=mysql&logoColor=white&style=flat-square)](https://mysql.com)

> Bridging the gap between guest-facing luxury and back-office operational excellence — all in one seamless system.

**[🚀 Live Demo](https://hotelpms-bsee.onrender.com) · [📋 Report a Bug](https://github.com/Rahultharu064/HOTELPMS/issues) · [✨ Request a Feature](https://github.com/Rahultharu064/HOTELPMS/issues)**

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/dashboard.png" alt="Admin Dashboard" width="100%" style="border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15)"/>
      <br/><strong>⚡ Admin Dashboard</strong>
      <br/><sub>Real-time stats, occupancy, and revenue at a glance</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/booking.png" alt="Room Booking" width="100%" style="border-radius:12px"/>
      <br/><strong>🛏️ Room Booking</strong>
      <br/><sub>Seamless public booking with filters and live availability</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/login.png" alt="Guest Login" width="100%" style="border-radius:12px"/>
      <br/><strong>🔐 Guest Portal Login</strong>
      <br/><sub>Elegant, minimal auth with Google SSO support</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/frontoffice.png" alt="Front Office Terminal" width="100%" style="border-radius:12px"/>
      <br/><strong>🖥️ Front Office Terminal</strong>
      <br/><sub>Live room grid with check-in/out workflow management</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/housekeeping.png" alt="Housekeeping" width="100%" style="border-radius:12px"/>
      <br/><strong>🧹 Housekeeping Management</strong>
      <br/><sub>Task assignments, cleaning logs, and room status tracking</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/homepage.png" alt="Public Website" width="100%" style="border-radius:12px"/>
      <br/><strong>🌐 Public Website</strong>
      <br/><sub>Luxury-branded landing page with booking integration</sub>
    </td>
  </tr>
</table>

---

## 🎨 Design Philosophy

This system is built with a **premium-first** design approach:

| Design Principle | Implementation |
|:---|:---|
| 🎨 **Color Palette** | Deep Forest Green `#14532D` + Warm Gold `#c9a84c` — elegant and luxurious |
| ✍️ **Typography** | Georgia serif for headings, Outfit sans-serif for UI — warm yet modern |
| 💫 **Animations** | Framer Motion micro-animations on every interaction |
| 🪟 **Glassmorphism** | Backdrop blur cards on dashboard widgets |
| 📐 **Layout** | Responsive grid system, mobile-first approach |
| 🌙 **Theming** | Consistent design tokens across all 3 portals |

---

## 🌟 Key Features

### 🏨 Room & Inventory Management
- **Dynamic Room Types** — Standard, Suite, Deluxe with custom pricing
- **Multimedia Integration** — High-quality galleries and video tours per room
- **Amenity Management** — Categorized with icon support (Standard, Premium, Accessible)
- **Real-time Status Tracking** — Available / Occupied / Cleaning / Maintenance / Reserved

### 📅 Booking & Reservation Engine
- **Public Booking Interface** — Seamless guest experience with live availability
- **Walk-in Reservations** — Front-office tools for phone and walk-in bookings
- **Advanced Workflow Logs** — Full audit trail for every booking lifecycle change
- **Multi-Booking Support** — Efficient handling across multiple rooms and dates

### 👤 Guest Relationship Management (CRM)
- **Guest Profiles** — Full history, preferences, and contact database
- **ID Verification** — Secure document management (Passport, Citizenship, Driving License)
- **Loyalty Tracking** — Auto-calculated total bookings and lifetime spend

### 💳 Financial Management & POS
- **Unified Payment Gateway** — eSewa, Khalti, and Cash support
- **Service POS** — Extra service orders (Dining, Spa, Laundry) linked to guest folios
- **Automated Folio Generation** — Accurate billing for stays and services

### 🧹 Housekeeping & Maintenance
- **Task Management** — Real-time cleaning logs and staff assignments
- **Room Inspection** — Multi-stage cleaning workflow (General → Deep Clean → Inspection)
- **Maintenance Reporting** — Flag and track maintenance history

### 📊 Operations & Analytics
- **Live Dashboards** — Real-time occupancy, revenue, and daily arrivals/departures
- **Rich Reporting** — Financial and operational reports for management
- **Notifications** — Instant alerts for bookings, cancellations, and service requests

### 🔐 Authentication & Security
- **Google OAuth 2.0** — One-click login for guests
- **Email OTP Verification** — Secure registration via Gmail SMTP
- **Role-based Access Control** — Superadmin / Manager / Front Office / Housekeeping
- **JWT Authentication** — Secure token-based sessions with refresh support

---

## 🏗️ Architecture

```
HOTELPMS/
├── frontend/                  # React 18 + Vite + TypeScript
│   └── src/
│       ├── pages/
│       │   ├── publicwebsite/ # Guest portal & public booking
│       │   ├── Admin/         # Staff & admin portal
│       │   ├── frontoffice/   # Front office terminal
│       │   └── Housekeeping/  # Housekeeping dashboard
│       ├── components/        # Shared UI components
│       ├── services/          # API service layer
│       └── context/           # Auth & global state
│
└── backend/                   # Node.js + Express + TypeScript
    └── src/
        ├── controllers/       # Route controllers
        ├── routes/            # API route definitions
        ├── middleware/        # Auth, CORS, rate-limiting
        ├── utils/             # Email, upload, validators
        └── config/            # Environment configuration
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 18, TypeScript, Vite, Lucide Icons, Framer Motion, React Router v6 |
| **Styling** | Vanilla CSS with custom design tokens, Outfit & Georgia fonts |
| **Backend** | Node.js 20, Express 4, TypeScript, Passport.js |
| **Database** | MySQL (Aiven Cloud) with Prisma ORM |
| **Auth** | JWT, Google OAuth 2.0, OTP via Gmail SMTP |
| **File Storage** | Cloudinary for images, local upload fallback |
| **Payments** | eSewa & Khalti payment gateway integration |
| **Email** | Nodemailer + Gmail SMTP with App Password |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL (local or cloud)
- Gmail account with App Password enabled
- npm or yarn

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Rahultharu064/HOTELPMS.git
cd HOTELPMS
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env   # Fill in your environment variables
npx prisma migrate dev
npm run dev            # Starts on http://localhost:5001
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev            # Starts on http://localhost:5173
```

### Environment Variables (Backend)

```env
# Server
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL="mysql://user:pass@host:port/dbname"

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Email (Gmail SMTP — use App Password, NOT your regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your16charapppassword
SMTP_FROM=your@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Payment
KHALTI_SECRET_KEY=your-khalti-key
ESEWA_SECRET_KEY=your-esewa-key
```

> **Gmail App Password**: Go to [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords). 2-Step Verification must be enabled.

---

## 🗺️ Portals & Access

| Portal | URL | Credentials |
|:---|:---|:---|
| **Public Website** | `/` | Open access |
| **Guest Portal** | `/login` | Register or Google Login |
| **Staff Portal** | `/admin/login` | `admin@hotelpms.com` / `admin123` |
| **Front Office** | `/frontoffice` | Staff role: `front_office` |
| **Housekeeping** | `/housekeeping` | Staff role: `housekeeping` |

---

## 🗺️ Roadmap

- [x] Room & Booking Core Logic
- [x] Multi-Payment Integration (eSewa, Khalti)
- [x] Housekeeping Management Module
- [x] Service POS Implementation
- [x] Google OAuth 2.0 Guest Login
- [x] Gmail SMTP Email Notifications
- [x] Role-based Staff Portal
- [x] Front Office Check-in/Check-out Terminal
- [ ] Mobile App for Housekeeping Staff
- [ ] AI-Powered Dynamic Pricing Engine
- [ ] Multi-Language Support (Nepali / English)
- [ ] WhatsApp Booking Notifications

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by **Rahul Chaudhary**

[![GitHub](https://img.shields.io/badge/GitHub-Rahultharu064-181717?logo=github&style=for-the-badge)](https://github.com/Rahultharu064)

⭐ **Star this repo if you find it useful!**

</div>
