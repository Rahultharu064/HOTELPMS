import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { resolveVenueIcon } from "../../data/venues";
import type { GalleryVenue } from "../../data/venues";
import { galleryService } from "../../services/galleryService";
import { getImageUrl } from "../../services/api";
import { ApiStatus } from "../../components/ui/ApiStatus";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";
import VenuesSection from "../../components/publicwebsite/Homepage/Sections/VenuesSection";

export const GalleryPage = () => {
  const { hash } = useLocation();
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
      setError(err?.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  useEffect(() => {
    if (hash && !loading) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
      }
    } else if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [hash, loading]);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <PageHero
        title="Photo Gallery"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Photo Gallery" },
        ]}
      />

      <VenuesSection showViewAll={false} hideHeader />

      <section className="section-padding border-t border-neutral-border/50 bg-white">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary-gold">
              Explore Every Space
            </span>
            <h2 className="mt-3 font-georgia text-2xl font-bold text-primary-dark md:text-3xl">Venue Highlights</h2>
          </div>

          {loading ? (
            <ApiStatus status="loading" skeletonCount={2} skeletonVariant="row" />
          ) : error ? (
            <ApiStatus status="error" errorMessage={error} onRetry={fetchVenues} />
          ) : venues.length === 0 ? (
            <ApiStatus
              status="empty"
              emptyTitle="No Venues Available"
              emptyDescription="Gallery content will appear here once venues are added from the admin panel."
              emptyEmoji="🏛️"
            />
          ) : (
            <div className="space-y-10">
              {venues.map((venue, index) => {
                const Icon = resolveVenueIcon(venue.icon);
                const imageSrc = venue.image.startsWith("http") ? venue.image : getImageUrl(venue.image);

                return (
                  <motion.article
                    key={venue.id}
                    id={venue.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`scroll-mt-28 flex flex-col overflow-hidden rounded-2xl border border-neutral-border/60 bg-white shadow-[0_8px_32px_rgba(20,83,45,0.06)] lg:flex-row ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="relative aspect-[16/10] lg:aspect-auto lg:w-1/2">
                      <img src={imageSrc} alt={venue.title} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent lg:hidden" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-gold/15">
                        <Icon size={20} className="text-primary-gold" />
                      </div>
                      <h3 className="font-georgia text-2xl font-bold text-primary-dark md:text-3xl">{venue.title}</h3>
                      <p className="mt-4 text-[15px] leading-relaxed text-neutral-text-secondary">{venue.description}</p>
                      <Link
                        to="/contact"
                        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-gold transition-colors hover:bg-primary-green hover:text-white"
                      >
                        Enquire Now
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
