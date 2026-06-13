import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { partitionVenues } from "../../../../data/venues";
import type { GalleryVenue } from "../../../../data/venues";
import { galleryService } from "../../../../services/galleryService";
import { ApiStatus } from "../../../ui/ApiStatus";
import { VenueCard } from "./VenueCard";

interface VenuesSectionProps {
  showViewAll?: boolean;
}

const VenuesSection = ({ showViewAll = true }: VenuesSectionProps) => {
  const [venues, setVenues] = useState<GalleryVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await galleryService.getActiveVenues();
      if (res.success) {
        setVenues(res.data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load gallery venues");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const { featured, compact, wide } = partitionVenues(venues);
  const hasGrid = featured && compact.length > 0 && wide;

  return (
    <section id="venues" className="section-padding bg-[#FAFAF8]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-14"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-primary-gold" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary-gold">
              Our Venues
            </span>
            <span className="h-px w-8 bg-primary-gold" />
          </div>

          <h2 className="font-georgia text-3xl font-bold leading-tight text-primary-dark md:text-4xl lg:text-[2.75rem]">
            Dine, Celebrate <span className="italic text-primary-green">&</span> Meet
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
            From intimate dinners to grand celebrations — Itahari Namuna has the perfect space for every occasion.
          </p>
        </motion.div>

        {loading ? (
          <ApiStatus status="loading" skeletonCount={4} skeletonVariant="card" />
        ) : error ? (
          <ApiStatus status="error" errorMessage={error} onRetry={fetchVenues} />
        ) : !hasGrid ? (
          <ApiStatus
            status="empty"
            emptyTitle="Venues Coming Soon"
            emptyDescription="Our gallery spaces are being prepared. Please check back shortly."
            emptyEmoji="🏛️"
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            <VenueCard venue={featured!} className="min-h-[420px] lg:min-h-[520px]" />

            <div className="grid gap-4 lg:gap-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                {compact.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} className="min-h-[240px] lg:min-h-[250px]" />
                ))}
              </div>
              <VenueCard venue={wide!} className="min-h-[220px] lg:min-h-[250px]" />
            </div>
          </div>
        )}

        {showViewAll && !loading && venues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-center md:mt-12"
          >
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-border bg-white px-8 py-3 text-sm font-bold text-primary-dark shadow-sm transition-all hover:border-primary-green hover:bg-primary-green/5"
            >
              View Full Gallery
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default VenuesSection;
