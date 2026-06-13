import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { VENUES } from "../../data/venues";
import VenuesSection from "../../components/publicwebsite/Homepage/Sections/VenuesSection";

export const GalleryPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-dark via-primary-green to-primary-dark py-10 md:py-12">
        <div className="container-custom">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary-gold">
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-primary-gold">Gallery</span>
          </nav>
          <h1 className="font-georgia text-3xl font-bold text-white md:text-4xl lg:text-[2.5rem]">
            Hotel Gallery &amp; Venues
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Explore our dining spaces, banquet halls, outdoor venues, and meeting rooms — crafted for memorable
            experiences.
          </p>
        </div>
      </div>

      {/* Same bento layout as homepage */}
      <VenuesSection showViewAll={false} />

      {/* Individual venue detail cards */}
      <section className="section-padding border-t border-neutral-border/50 bg-white">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary-gold">
              Explore Every Space
            </span>
            <h2 className="mt-3 font-georgia text-2xl font-bold text-primary-dark md:text-3xl">
              Venue Highlights
            </h2>
          </div>

          <div className="space-y-10">
            {VENUES.map((venue, index) => (
              <motion.article
                key={venue.id}
                id={venue.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`scroll-mt-28 overflow-hidden rounded-2xl border border-neutral-border/60 bg-white shadow-[0_8px_32px_rgba(20,83,45,0.06)] ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                } flex flex-col lg:flex-row`}
              >
                <div className="relative aspect-[16/10] lg:aspect-auto lg:w-1/2">
                  <img src={venue.image} alt={venue.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent lg:hidden" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-gold/15">
                    <venue.icon size={20} className="text-primary-gold" />
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
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
