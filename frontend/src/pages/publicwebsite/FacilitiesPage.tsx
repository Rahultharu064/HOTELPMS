import React from 'react';
import { FaWifi, FaSwimmingPool, FaParking, FaCoffee, FaDumbbell, FaSpa } from 'react-icons/fa';
import PageHero from '../../components/publicwebsite/Homepage/layout/PageHero';

export const FacilitiesPage: React.FC = () => {
  const facilities = [
    {
      title: 'High-speed Wi-Fi',
      description: 'Fibre throughout the building. Works in the rooms, the restaurant, and the lobby — not just next to reception.',
      icon: FaWifi,
    },
    {
      title: 'Swimming pool',
      description: 'Outdoor pool, open through the season. Towels at the attendant desk, not hidden in a locker.',
      icon: FaSwimmingPool,
    },
    {
      title: 'Secure parking',
      description: 'On-site parking with overnight security. Tell the desk your plate number at check-in.',
      icon: FaParking,
    },
    {
      title: 'Restaurant & cafe',
      description: 'Breakfast, lunch, and a short dinner menu. Nepali plates first, then a few continental standards.',
      icon: FaCoffee,
    },
    {
      title: 'Fitness room',
      description: 'Treadmills, free weights, and enough space that you are not waiting on a queue.',
      icon: FaDumbbell,
    },
    {
      title: 'Spa treatments',
      description: 'Massage by appointment. Book at reception the evening before if you can.',
      icon: FaSpa,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-light">
      <PageHero
        title="Dining & Facilities"
        subtitle="The restaurant, lounge, gym, and the everyday extras that make a stay simpler."
        image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Facilities" },
        ]}
      />

      <div className="container-custom py-16 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary-gold">On the property</p>
          <h2 className="font-georgia mt-3 text-3xl text-primary-dark">What you can actually use</h2>
          <p className="mt-4 text-neutral-text-secondary leading-relaxed">
            Dining is on the ground floor. The gym and spa are one level down. Parking is behind the east wing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-border bg-neutral-border md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <article key={facility.title} className="bg-white p-5 sm:p-8">
              <facility.icon className="text-2xl text-primary-gold" />
              <h3 className="font-georgia mt-5 text-xl text-primary-dark">{facility.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-text-secondary">{facility.description}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};
