import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Crown, MapPin, ConciergeBell } from "lucide-react";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&h=600&fit=crop&q=80";
const SECONDARY_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop&q=80";

const FEATURES = [
  {
    icon: Crown,
    title: "World-Class Amenities",
    description:
      "From spa services to fine dining, every amenity is designed to exceed expectations.",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    description:
      "Strategically located in the heart of Itahari with easy access to major attractions.",
  },
  {
    icon: ConciergeBell,
    title: "Personalised Service",
    description:
      "Our dedicated team ensures every stay is tailored to your individual needs.",
  },
];

const AboutUsSection = () => {
  return (
    <section id="about-us" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Image collage */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-[0_24px_48px_-12px_rgba(20,83,45,0.18)]">
                <img
                  src={MAIN_IMAGE}
                  alt="Luxury hotel room at Itahari Namuna"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <span className="absolute right-4 top-4 rounded-md bg-primary-gold px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-dark shadow-sm">
                Luxury Hotel
              </span>

              <div className="absolute -bottom-6 right-0 w-[58%] overflow-hidden rounded-xl border-4 border-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.2)] sm:-bottom-8 sm:right-4">
                <img
                  src={SECONDARY_IMAGE}
                  alt="Elegant hotel suite interior"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-primary-gold" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-primary-gold">
                About Us
              </span>
              <span className="h-px w-8 bg-primary-gold" />
            </div>

            <h2 className="font-georgia text-3xl font-bold leading-tight text-primary-dark md:text-4xl lg:text-[2.65rem]">
              Nepal&apos;s Premier Luxury Hotel in Itahari
            </h2>

            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-neutral-text-secondary md:text-base">
              Itahari Namuna offers an unparalleled blend of modern luxury and warm
              Nepali hospitality — a sanctuary where every detail is crafted for your
              comfort.
            </p>

            <ul className="mt-8 space-y-6">
              {FEATURES.map(({ icon: Icon, title, description }, index) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-dark">
                    <Icon className="h-5 w-5 text-primary-gold" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="font-georgia text-base font-bold text-primary-dark md:text-lg">
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
                className="inline-flex items-center justify-center rounded-full bg-primary-dark px-7 py-3 text-sm font-semibold text-primary-gold transition-all duration-300 hover:bg-primary-green hover:shadow-md"
              >
                Discover More
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary-dark px-7 py-3 text-sm font-semibold text-primary-dark transition-all duration-300 hover:bg-primary-dark hover:text-white"
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
