import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../../../../services/api";
import { resolveVenueIcon, type GalleryVenue } from "../../../../data/venues";

interface VenueCardProps {
  venue: GalleryVenue;
  className?: string;
}

export const VenueCard = ({ venue, className = "" }: VenueCardProps) => {
  const Icon = resolveVenueIcon(venue.icon);
  const imageSrc = venue.image.startsWith("http") ? venue.image : getImageUrl(venue.image);

  return (
    <Link
      to={`/gallery#${venue.slug}`}
      className={`group relative block overflow-hidden rounded-2xl ${className}`}
    >
      <img
        src={imageSrc}
        alt={venue.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/45 to-primary-dark/10 transition-opacity duration-500 group-hover:from-primary-dark group-hover:via-primary-dark/60" />

      <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 md:p-7">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-gold/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Icon size={18} className="text-primary-dark" strokeWidth={2} />
        </div>

        <h3 className="font-georgia text-xl font-bold leading-snug text-white md:text-2xl">{venue.title}</h3>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/80">{venue.description}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary-gold transition-all duration-300 group-hover:gap-2.5">
          Explore
          <ArrowRight size={14} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
};
