import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { BedDouble, MapPin, Phone } from "lucide-react";

const MAIN_IMAGE = "/hero122.png";
const SECONDARY_IMAGE = "/hero1.png";

const FEATURES = [
  {
    icon: BedDouble,
    title: "Room options",
    description: "Compare room types and nightly rates before you book.",
  },
  {
    icon: MapPin,
    title: "In Itahari, Sunsari",
    description: "A convenient place to stay while you are visiting the area.",
  },
  {
    icon: Phone,
    title: "Talk to our team",
    description: "Contact us with questions about a room or your reservation.",
  },
];

const AboutUsSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about-us" className="section-padding overflow-hidden bg-white">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Image collage */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-[0_24px_48px_-12px_rgba(20,83,45,0.18)]">
                <img
                  src={MAIN_IMAGE}
                  alt="Itahari Namuna building in Itahari"
                  className="aspect-[4/3] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              <span className="absolute right-4 top-4 rounded-md bg-primary-gold px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-dark shadow-sm">
                Itahari Namuna
              </span>

              <div className="absolute -bottom-6 right-0 w-[58%] overflow-hidden rounded-xl border-4 border-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.2)] sm:-bottom-8 sm:right-4">
                <img
                  src={SECONDARY_IMAGE}
                  alt="Hospitality students practicing service at Itahari Namuna"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-primary-gold" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary-gold">
                About Us
              </span>
              <span className="h-px w-8 bg-primary-gold" />
            </div>

            <h2 className="font-georgia text-3xl font-semibold leading-[1.12] tracking-tight text-primary-dark md:text-4xl lg:text-[2.65rem]">
              A welcoming place to stay in Itahari
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
              Itahari Namuna is based in Itahari, Sunsari. Browse our room options,
              check nightly rates, and contact our team if you need help planning
              your visit.
            </p>

            <ul className="mt-8 space-y-6">
              {FEATURES.map(({ icon: Icon, title, description }, index) => (
                <motion.li
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 0.1 + index * 0.06 }}
                  className="flex gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-dark">
                    <Icon className="h-5 w-5 text-primary-gold" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-primary-dark md:text-lg">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-text-secondary">
                      {description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-green"
              >
                Discover More
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-dark/25 px-6 py-3 text-sm font-semibold text-primary-dark transition-colors duration-200 hover:border-primary-dark hover:bg-primary-dark hover:text-white"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
