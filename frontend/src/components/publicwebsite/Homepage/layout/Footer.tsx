import React from "react";
import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, Globe, MessageCircle, Share2, Play } from "lucide-react";

const NAV = ["Home", "Our Rooms", "Facilities", "About Us", "Contact"];
const STORY = ["Our Story", "Press Kit", "Careers", "Privacy Policy", "Terms of Use"];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0C2012]">

      {/* ── NEWSLETTER BAND ── */}
      <div className="border-b border-white/6">
        <div className="site-container section-py">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            {/* Copy */}
            <div style={{ maxWidth: 520 }}>
              <h3 className="heading-lg text-white mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                Stay for a night,<br />
                <span className="text-[#F59E0B]">remember for a lifetime.</span>
              </h3>
              <p className="body-lg text-white/45">
                Subscribe to receive exclusive member offers, seasonal packages, and priority booking access.
              </p>
            </div>

            {/* Subscribe bar */}
            <div className="flex w-full lg:w-auto" style={{ minWidth: 360, maxWidth: 440 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-l-xl bg-white/6 border border-white/10 border-r-0 text-white text-sm font-medium placeholder-white/30 outline-none focus:bg-white/9 transition-colors"
              />
              <button className="px-6 py-4 rounded-r-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#14532D] text-[12px] font-black tracking-widest uppercase transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER COLUMNS ── */}
      <div className="site-container section-py">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center">
                <Building2 size={17} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-extrabold leading-none" style={{ fontSize: 15 }}>Itahari Namuna</p>
                <p className="label-sm text-[#F59E0B] mt-0.5" style={{ fontSize: 8.5, letterSpacing: "0.32em" }}>College PMS</p>
              </div>
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed mb-7" style={{ maxWidth: 240 }}>
              Setting the standard for premium property management and student hospitality in Nepal.
            </p>
            <div className="flex items-center gap-2.5">
              {[Globe, MessageCircle, Share2, Play].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`social ${i + 1}`}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-sm text-[#F59E0B]/55 mb-6" style={{ fontSize: 10 }}>Navigation</p>
            <ul className="flex flex-col gap-3.5">
              {NAV.map(n => (
                <li key={n}>
                  <a href="#" className="text-white/40 hover:text-white text-sm font-medium transition-colors duration-200">
                    {n}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Story */}
          <div>
            <p className="label-sm text-[#F59E0B]/55 mb-6" style={{ fontSize: 10 }}>Our Story</p>
            <ul className="flex flex-col gap-3.5">
              {STORY.map(s => (
                <li key={s}>
                  <a href="#" className="text-white/40 hover:text-white text-sm font-medium transition-colors duration-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-sm text-[#F59E0B]/55 mb-6" style={{ fontSize: 10 }}>Contact</p>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3.5">
                <MapPin size={15} className="text-[#F59E0B] shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Itahari-6, Sunsari, Koshi Province, Nepal
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <Phone size={15} className="text-[#F59E0B] shrink-0" strokeWidth={2} />
                <a href="tel:+977025123456" className="text-white/40 hover:text-white text-sm font-medium transition-colors">
                  +977 025 123456
                </a>
              </div>
              <div className="flex items-center gap-3.5">
                <Mail size={15} className="text-[#F59E0B] shrink-0" strokeWidth={2} />
                <a href="mailto:info@itaharinamuna.edu.np" className="text-white/40 hover:text-white text-sm font-medium transition-colors break-all">
                  info@itaharinamuna.edu.np
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/5">
        <div className="site-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-medium">
            © {year} Itahari Namuna College PMS. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map(t => (
              <a key={t} href="#" className="text-white/25 hover:text-white/60 text-xs font-medium transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
