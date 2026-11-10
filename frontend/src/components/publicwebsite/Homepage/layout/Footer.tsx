import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Shield, Award } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Rooms", to: "/rooms" },
    { label: "Facilities", to: "/facilities" },
    { label: "Gallery", to: "/gallery" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const trustBadges = [
    { icon: Shield, label: "Secure Booking" },
    { icon: Award, label: "Premium Service" },
    { icon: Clock, label: "24/7 Support" },
  ];

  return (
    <footer className="bg-primary-dark text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.08)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,83,45,0.15)_0%,_transparent_50%)] pointer-events-none" />

      {/* Trust strip */}
      <div className="border-b border-white/5 relative z-10">
        <div className="container-custom py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center sm:justify-start gap-3 text-primary-foreground/80"
              >
                <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary-gold" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 ring-1 ring-white/5">
                <img src="/Logos1.png" alt="Itahari Namuna Logo" className="h-11 w-auto object-contain" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">Itahari Namuna</h3>
                <p className="text-primary-gold font-bold uppercase text-[9px] tracking-[0.35em] mt-0.5">
                  Luxury Hospitality
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/65">
              A welcoming place to stay in Itahari, Sunsari. Browse rooms, compare rates and plan your visit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-primary-gold mb-6">Explore</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-primary-foreground/65 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300 text-primary-gold text-xs">
                      →
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-primary-gold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/65">
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <MapPin className="h-4 w-4 text-primary-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white/90 text-xs uppercase tracking-wider mb-0.5">Address</p>
                  <span>Itahari-6, Sunsari, Nepal</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Phone className="h-4 w-4 text-primary-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white/90 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                  <a href="tel:+97725585000" className="hover:text-primary-gold transition-colors">
                    +977-25-585000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <Mail className="h-4 w-4 text-primary-gold" />
                </div>
                <div>
                  <p className="font-semibold text-white/90 text-xs uppercase tracking-wider mb-0.5">Email</p>
                  <a href="mailto:info@itaharipms.com" className="break-all transition-colors hover:text-primary-gold">
                    info@itaharipms.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20 relative z-10">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Itahari Namuna Luxury PMS. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-primary-foreground/40">
            <Link to="/privacy-policy" className="min-h-11 inline-flex items-center transition-colors hover:text-primary-gold">Privacy Policy</Link>
            <Link to="/terms-of-service" className="min-h-11 inline-flex items-center transition-colors hover:text-primary-gold">Terms of Service</Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 hover:text-white transition-colors font-bold text-white/60 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary-gold/30"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
