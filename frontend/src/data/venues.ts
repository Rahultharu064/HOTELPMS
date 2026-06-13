import { UtensilsCrossed, TreePalm, Crown, Presentation } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type VenueLayout = "featured" | "compact" | "wide";

export interface Venue {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  layout: VenueLayout;
}

export const VENUES: Venue[] = [
  {
    id: "royal-dining",
    title: "Royal Dining",
    description: "Multi-cuisine fine dining with expert chefs and elegant ambience.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    icon: UtensilsCrossed,
    layout: "featured",
  },
  {
    id: "tropical-outdoor",
    title: "Tropical Outdoor",
    description: "Garden lounge & outdoor space for intimate gatherings.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    icon: TreePalm,
    layout: "compact",
  },
  {
    id: "royal-banquet",
    title: "Royal Banquet",
    description: "Grand hall for weddings, receptions & celebrations.",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    icon: Crown,
    layout: "compact",
  },
  {
    id: "annapurna-hall",
    title: "Annapurna Hall",
    description: "Professional conference & meeting room for up to 25 attendees.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    icon: Presentation,
    layout: "wide",
  },
];

export const featuredVenue = VENUES.find((v) => v.layout === "featured")!;
export const compactVenues = VENUES.filter((v) => v.layout === "compact");
export const wideVenue = VENUES.find((v) => v.layout === "wide")!;
