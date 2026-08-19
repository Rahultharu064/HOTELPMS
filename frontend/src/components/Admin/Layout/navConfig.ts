import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Building2,
  CreditCard,
  Warehouse,
  Zap,
  ShieldCheck,
  Images,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  /** Restricts an item to specific admin roles; omit to show it to everyone with panel access. */
  roles?: string[];
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const navGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Front Desk",
    items: [
      { title: "Bookings", url: "/admin/bookings", icon: CalendarCheck },
      { title: "Guests", url: "/admin/guests", icon: Users },
      { title: "Room Inventory", url: "/admin/rooms", icon: Warehouse },
      { title: "Room Types", url: "/admin/room-types", icon: Building2 },
    ],
  },
  {
    label: "Experience",
    items: [
      { title: "Extra Services", url: "/admin/extra-services", icon: Zap },
      { title: "Gallery & Venues", url: "/admin/gallery", icon: Images },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Financials", url: "/admin/financials", icon: CreditCard, roles: ["superadmin", "admin"] },
      { title: "System Analytics", url: "/admin/reports", icon: BarChart3 },
      { title: "Staff Management", url: "/admin/users", icon: ShieldCheck, roles: ["superadmin", "admin"] },
      { title: "Settings", url: "/admin/settings", icon: Settings, roles: ["superadmin", "admin"] },
    ],
  },
];
