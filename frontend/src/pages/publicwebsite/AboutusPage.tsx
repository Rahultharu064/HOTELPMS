import React from "react";
import PublicLayout from "../../components/publicwebsite/Homepage/Sections/PublicLayout";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";
import { Award, Heart, Users, Target, MapPin, Phone, Mail, Globe } from "lucide-react";

import room1 from "../../assets/Standard Room2.png";
import suite from "../../assets/Suite.png";

const VALUES = [
  { icon: Heart, title: "Guest-First Philosophy", desc: "Every decision we make prioritizes the comfort, safety, and satisfaction of our guests above all else." },
  { icon: Award, title: "Excellence in Service", desc: "Our award-winning team delivers hospitality that seamlessly blends Nepali warmth with international standards." },
  { icon: Users, title: "Community Impact", desc: "We actively support local communities through employment, cultural preservation, and sustainable tourism." },
  { icon: Target, title: "Innovation & Growth", desc: "We continuously invest in modern technology and training to elevate the hospitality experience." },
];

const TIMELINE = [
  { year: "2012", desc: "Founded as a small guesthouse in Itahari with just 8 rooms." },
  { year: "2015", desc: "Expanded to 25 rooms with modern amenities and conference facilities." },
  { year: "2018", desc: "Awarded 'Best Property in Sunsari' by Nepal Tourism Board." },
  { year: "2021", desc: "Launched the digital PMS system for seamless guest management." },
  { year: "2024", desc: "Expanded to 50+ rooms with a full-service spa and rooftop dining." },
];

const AboutusPage: React.FC = () => (
  <PublicLayout>
    <PageHero
      title="About"
      highlight="Our Story"
      subtitle="From a small guesthouse to one of Sunsari's most prestigious properties — our journey is built on passion, service, and community."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      bgImage="/hero1.png"
    />

    {/* Intro Section */}
    <section className="section-py-lg bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50/30 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
              A Legacy of <span className="text-[#1F7A3A]">Hospitality</span>
            </h2>
            <div className="h-1.5 w-16 bg-[#F59E0B] rounded-full mb-8" />
            <p className="text-gray-500 text-base leading-relaxed mb-6 font-medium">
              Nestled in the heart of Itahari, Sunsari, our property has been a beacon of premium hospitality since 2012.
              What started as a humble guesthouse has grown into a full-service hotel that blends traditional Nepali warmth
              with modern luxury.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8 font-medium">
              Our team of 120+ dedicated professionals works tirelessly to ensure every guest feels at home while
              experiencing world-class service, from our award-winning dining to our state-of-the-art wellness center.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-black text-[#1F7A3A] mb-1">12+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Years</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-black text-[#1F7A3A] mb-1">50K+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Guests</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-black text-[#1F7A3A] mb-1">4.9</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[32px] overflow-hidden aspect-[3/4]">
              <img src={room1} alt="Hotel interior" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[32px] overflow-hidden aspect-[3/4] mt-8">
              <img src={suite} alt="Hotel suite" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section-py-lg bg-gray-50/30">
      <div className="site-container">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Our Principles</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
            Values That <span className="text-[#1F7A3A]">Define Us</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((v, i) => (
            <div key={i} className="group bg-white rounded-[32px] p-8 border border-gray-100/80 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] transition-all duration-700">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 bg-[#1F7A3A]/5 text-[#1F7A3A] group-hover:scale-110 transition-transform duration-500">
                <v.icon size={26} strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-3 group-hover:text-[#1F7A3A] transition-colors">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-py-lg bg-white">
      <div className="site-container">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#1F7A3A] uppercase mb-4 block">Our Journey</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
            Milestones & <span className="text-[#F59E0B]">Achievements</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#F59E0B] mx-auto rounded-full mb-6" />
        </div>

        <div className="max-w-3xl mx-auto">
          {TIMELINE.map((t, i) => (
            <div key={i} className="flex gap-8 mb-12 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1F7A3A] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-green-900/20 shrink-0">
                  {t.year}
                </div>
                {i < TIMELINE.length - 1 && <div className="w-[2px] flex-1 bg-gray-100 mt-4" />}
              </div>
              <div className="pt-4">
                <p className="text-gray-600 text-base font-medium leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Quick Contact Strip */}
    <section className="bg-gradient-to-r from-[#0C2012] to-[#14532D] py-16">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-2">Ready to experience our hospitality?</h3>
            <p className="text-white/50 text-sm font-medium">Book your stay today and discover what makes us special.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 text-white/60">
              <MapPin className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-sm font-medium">Itahari-6, Sunsari</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Phone className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-sm font-medium">+977 025 123456</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Mail className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-sm font-medium">info@itaharinamuna.edu.np</span>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Globe className="h-5 w-5 text-[#F59E0B]" />
              <span className="text-sm font-medium">www.itaharinamuna.edu.np</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default AboutusPage;
