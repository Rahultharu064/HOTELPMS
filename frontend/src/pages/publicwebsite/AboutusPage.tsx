import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaHotel, FaCalendarAlt, FaStar, FaHeart } from 'react-icons/fa';
import PageHero from '../../components/publicwebsite/Homepage/layout/PageHero';

export const AboutusPage: React.FC = () => {
  const values = [
    { icon: FaStar, title: 'Excellence', description: 'Housekeeping that actually checks the corners. Food that arrives hot. Staff who remember a name.' },
    { icon: FaHeart, title: 'Hospitality', description: 'We run a hotel in Itahari, not a brochure. Guests get a warm desk, not a script.' },
    { icon: FaAward, title: 'Quality', description: 'Beds, linen, and bathrooms we would put family in. That is the bar.' },
  ];

  return (
    <main className="bg-neutral-light">
      <PageHero
        title="About Itahari Namuna"
        subtitle="A working hotel in the heart of Itahari — built for guests who want comfort without the theatre."
        image="https://images.unsplash.com/photo-1564501049412-61c2a308c1ba?auto=format&fit=crop&w=1920&q=80"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About" },
        ]}
      />

      <div className="container-custom section-padding">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-gold">Since the beginning</p>
            <h2 className="font-georgia mt-3 text-3xl text-primary-dark md:text-4xl">A hotel that still feels like Itahari</h2>
            <div className="mt-5 h-px w-16 bg-primary-gold" />
            <p className="mt-6 text-[16px] leading-[1.8] text-neutral-text-secondary">
              Itahari Namuna sits on the Koshi corridor — close enough to the highway for business trips,
              quiet enough for a weekend with family. The property grew out of a college campus guest house
              and is now a full hotel: rooms, suites, dining, and a front desk that answers the phone.
            </p>
            <p className="mt-4 text-[16px] leading-[1.8] text-neutral-text-secondary">
              We keep the stay simple. Clean rooms, reliable hot water, breakfast that starts on time,
              and staff who will walk you to the restaurant instead of pointing at a map.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-border bg-neutral-border sm:grid-cols-2">
            {[
              { icon: FaHotel, value: '50+', label: 'Rooms & suites' },
              { icon: FaUsers, value: '1,000+', label: 'Returning guests' },
              { icon: FaAward, value: '10+', label: 'Years open' },
              { icon: FaCalendarAlt, value: '5,000+', label: 'Stays completed' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-5 py-7 text-center">
                <stat.icon className="mx-auto mb-3 text-primary-gold" />
                <div className="font-georgia text-2xl text-primary-dark">{stat.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-neutral-border pt-16 md:grid-cols-2">
          <div>
            <h3 className="font-georgia text-2xl text-primary-dark">How we run the house</h3>
            <p className="mt-4 leading-relaxed text-neutral-text-secondary">
              Reception, housekeeping, and kitchen share one board. If a room is not ready, we do not
              pretend it is. If breakfast is late, you hear it from us first. That is the whole mission.
            </p>
          </div>
          <div>
            <h3 className="font-georgia text-2xl text-primary-dark">Where we are headed</h3>
            <p className="mt-4 leading-relaxed text-neutral-text-secondary">
              Better suites, a tighter restaurant menu, and the same local staff. We would rather be
              the hotel people in Sunsari actually recommend than another generic luxury brand.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-georgia text-3xl text-primary-dark">What we will not skip</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="border-t-2 border-primary-gold pt-6">
                <value.icon className="mb-4 text-primary-green" />
                <h3 className="text-lg font-semibold text-primary-dark">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-georgia text-3xl text-primary-dark">The people at the desk</h2>
          <p className="mt-3 max-w-xl text-neutral-text-secondary">
            You will see the same faces at check-in. That is on purpose.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { name: 'Dr. Ram Prasad Koirala', role: 'Founder & Chairman', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { name: 'Sita Sharma', role: 'General Manager', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { name: 'Bikash Thapa', role: 'Head of Operations', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
            ].map((member) => (
              <figure key={member.name} className="bg-white p-4 shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="mt-4">
                  <h3 className="font-georgia text-lg text-primary-dark">{member.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-primary-gold">{member.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
