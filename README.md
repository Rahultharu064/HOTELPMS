# HOTELPMS - Advanced Hotel Property Management System

![Project Status](https://img.shields.io/badge/Status-Development-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Typescript%20%7C%20React%20%7C%20Node.js%20%7C%20Prisma%20%7C%20MySQL-success)

A comprehensive, state-of-the-art Hotel Property Management System (PMS) designed to streamline hotel operations, enhance guest experiences, and provide robust financial management. This project bridges the gap between public-facing booking systems and internal administrative management.

---

## 🌟 Key Features

### 🏨 Room & Inventory Management
- **Dynamic Room Types**: Manage various room categories (Standard, Suite, Deluxe) with specific pricing and descriptions.
- **Multimedia Integration**: High-quality image galleries and video tours for each room.
- **Amenity Management**: Categorized amenities (Standard, Premium, Accessible) with icon support.
- **Real-time Status Tracking**: Monitor room availability (Available, Occupied, Cleaning, Maintenance, Reserved).

### 📅 Booking & Reservation Engine
- **Public Booking Interface**: A seamless experience for guests to browse, compare, and book rooms online.
- **Offline & Walk-in Reservations**: Dedicated tools for front-office staff to handle phone and walk-in bookings.
- **Advanced Workflow Logs**: Detailed audit trails for every status change in the booking lifecycle.
- **Multi-Booking Support**: Efficient handling of guest stays across different rooms or dates.

### 👤 Guest Relationship Management (CRM)
- **Guest Profiles**: Comprehensive database of guest history, preferences, and contact details.
- **ID Verification**: Secure management of identification documents (Passport, Citizenship, Driving License) with image uploads.
- **Loyalty Tracking**: Automatic calculation of total bookings and lifetime spend per guest.

### 💳 Financial Management & POS
- **Unified Payment Gateway**: Support for multiple payment methods including **eSewa**, **Khalti**, and **Cash**.
- **Service POS (Point of Sale)**: New feature for managing extra service orders (Dining, Spa, Laundry) linked directly to guest folios or as standalone transactions.
- **Automated Folio Generation**: Accurate billing for room stays and additional services.

### 🧹 Housekeeping & Maintenance
- **Task Management**: Real-time cleaning logs and staff assignments.
- **Room Inspection**: Multi-stage cleaning process (General, Deep Clean, Inspection).
- **Maintenance Reporting**: Flag rooms for repair and track maintenance history.

### 📊 Operations & Analytics
- **Live Dashboards**: Real-time statistics for occupancy, revenue, and daily arrivals/departures.
- **Rich Reporting**: Detailed financial and operational reports for management decision-making.
- **Notifications**: Instant alerts for new bookings, cancellations, and service requests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Vanilla CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MySQL with Prisma ORM |
| **Integrations** | eSewa & Khalti (Payment), Socket.io (Real-time), Cloudinary/Local File Uploads |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahultharu064/HOTELPMS.git
   cd HOTELPMS
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📸 Screenshots & Aesthetics
The application features a premium, responsive design with:
- **Glassmorphism effects** on dashboard components.
- **Smooth interactive transitions** using micro-animations.
- **Curated typography** and harmonious color palettes for a state-of-the-art feel.

---

## 🗺️ Roadmap
- [x] Room & Booking Core Logic
- [x] Multi-Payment Integration
- [x] Housekeeping Management
- [x] Service POS Implementation
- [ ] Mobile App for Housekeeping Staff
- [ ] AI-Powered Dynamic Pricing Engine
- [ ] Multi-Language Support

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by **Rahul Chaudhary**
