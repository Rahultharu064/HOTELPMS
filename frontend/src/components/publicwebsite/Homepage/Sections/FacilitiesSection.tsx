import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Banknote, Phone, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../layout/SectionHeading";

const ITEMS = [
  { icon: BedDouble, label: "Browse rooms", sub: "Compare room types and choose the right fit for your visit.", to: "/rooms" },
  { icon: Banknote, label: "Check nightly rates", sub: "See room prices before moving on to a booking.", to: "/rooms" },
  { icon: Compass, label: "Find us in Itahari", sub: "Get in touch with the hotel team about your visit.", to: "/contact" },
  { icon: Phone, label: "Ask a question", sub: "Contact us if you need help with a room or reservation.", to: "/contact" },
];


const FacilitiesSection: React.FC = () => {
  return (
    <section id="plan-your-visit" className="section-padding border-y border-neutral-border bg-[#f2f3ed]">
      <div className="container-custom">
        <SectionHeading
          badge="Plan your visit"
          badgeIcon={Compass}
          title={
            <>
              The details, <span className="italic text-primary-green">made simple</span>
            </>
          }
          subtitle="Find a room, check the nightly rate, or talk with our team before you book."
          accent="green"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, label, sub, to }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={to} className="group flex h-full min-h-52 flex-col rounded-xl border border-neutral-border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary-green/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/50">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-green/8 text-primary-green transition-colors group-hover:bg-primary-green group-hover:text-white">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="text-base font-semibold text-primary-dark">{label}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-text-secondary">{sub}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-green">
                  Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;

