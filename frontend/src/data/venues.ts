import {
  UtensilsCrossed,
  TreePalm,
  Crown,
  Presentation,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Sparkles,
  Tv,
  Wind,
  Coffee,
  Shield,
  Wine,
  Volume2,
  Building2,
  PartyPopper,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type VenueLayout = "featured" | "compact" | "wide";

export interface GalleryVenue {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  layout: VenueLayout;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const VENUE_ICON_OPTIONS = [
  { value: "UtensilsCrossed", label: "Dining" },
  { value: "TreePalm", label: "Outdoor" },
  { value: "Crown", label: "Banquet" },
  { value: "Presentation", label: "Conference" },
  { value: "PartyPopper", label: "Events" },
  { value: "Building2", label: "Hall" },
  { value: "Utensils", label: "Restaurant" },
  { value: "Sparkles", label: "Premium" },
  { value: "Waves", label: "Pool" },
  { value: "Dumbbell", label: "Gym" },
  { value: "Car", label: "Parking" },
  { value: "Wifi", label: "Wi-Fi Lounge" },
  { value: "Tv", label: "Media" },
  { value: "Wind", label: "Climate" },
  { value: "Coffee", label: "Cafe" },
  { value: "Shield", label: "Secure" },
  { value: "Wine", label: "Bar" },
  { value: "Volume2", label: "Sound" },
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  TreePalm,
  Crown,
  Presentation,
  PartyPopper,
  Building2,
  Utensils,
  Sparkles,
  Waves,
  Dumbbell,
  Car,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Shield,
  Wine,
  Volume2,
};

export const resolveVenueIcon = (iconName?: string): LucideIcon =>
  (iconName && ICON_MAP[iconName]) || UtensilsCrossed;

export const partitionVenues = (venues: GalleryVenue[]) => ({
  featured: venues.find((v) => v.layout === "featured") ?? null,
  compact: venues.filter((v) => v.layout === "compact"),
  wide: venues.find((v) => v.layout === "wide") ?? null,
  all: venues,
});
