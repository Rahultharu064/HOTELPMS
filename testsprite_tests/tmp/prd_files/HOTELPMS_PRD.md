# HOTELPMS Product Requirements Document

## Overview
HOTELPMS is a Hotel Property Management System for managing hotel operations, online guest bookings, staff workflows, and housekeeping.

## User Roles
- Guest: browse rooms, book online, manage profile
- Admin/Manager: manage inventory, users, bookings, gallery
- Front Office: check-in/out, payments, guest folio, service POS
- Housekeeping: room status, cleaning tasks, staff assignment

## Public Website Requirements
1. Homepage displays hotel branding, room types, testimonials, and booking CTA
2. Room listing supports filtering by type and price
3. Room detail pages show amenities, pricing, and booking action
4. Guest auth supports signup, login, OTP verification, forgot/reset password
5. Authenticated guests can view bookings and profile
6. Gallery and facilities pages display hotel amenities
7. Contact and about pages are accessible

## Admin Panel Requirements (/admin)
1. Staff login with role-based access control
2. Dashboard shows key hotel metrics
3. CRUD for room types, rooms, extra services, gallery venues
4. Manage bookings, guests, and staff users
5. Settings page for hotel configuration

## Front Office Requirements (/frontoffice)
1. Dashboard for daily operations
2. Check-in and check-out workflow
3. Room status overview
4. Guest folio and billing
5. Service POS for extra services
6. Payment recording and reports
7. Real-time notifications

## Housekeeping Requirements (/housekeeping)
1. Room status grid with visual indicators
2. Cleaning task management
3. Staff assignment to rooms/tasks
4. Room detail view for housekeeping notes

## API Requirements
- REST API on port 5000 with JWT authentication
- Health endpoint at /health
- Guest auth at /api/auth
- Staff auth at /api/admin/auth
- CRUD endpoints for rooms, bookings, payments, services, housekeeping

## Non-Functional Requirements
- Responsive UI with Tailwind CSS
- Real-time updates via Socket.io
- Secure password hashing and JWT sessions
- Image uploads via Cloudinary

## Test Credentials
- Staff: admin@hotelpms.com / admin123
- Guest: john.doe@example.com / password123
