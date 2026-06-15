import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Shield, Award } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  const socials = [
    { Icon: FaFacebookF, href: "#", label: "Follow us on Facebook" },
    { Icon: FaInstagram, href: "#", label: "Follow us on Instagram" },
    { Icon: FaTwitter, href: "#", label: "Follow us on Twitter" },
    { Icon: FaYoutube, href: "#", label: "Subscribe on YouTube" },
  ];

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
        <div className="container-custom py-6">
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

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
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
            <p className="text-sm text-primary-foreground/65 leading-relaxed max-w-sm">
              Where refined comfort meets seamless hospitality. Experience premium stays, world-class amenities,
              and personalised service in the heart of Itahari.
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary-green hover:scale-105 transition-all duration-300 border border-white/10"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
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
          <div className="lg:col-span-3">
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
                  <a href="mailto:info@itaharipms.com" className="hover:text-primary-gold transition-colors">
                    info@itaharipms.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-primary-gold mb-6">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/65 mb-5 leading-relaxed">
              Get exclusive offers, seasonal packages, and hospitality insights delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 h-11 px-4 rounded-l-xl text-sm bg-white/5 border border-white/10 border-r-0 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-primary-gold/30 transition-all"
                />
                <button className="h-11 px-5 rounded-r-xl bg-primary-green text-white text-xs font-bold uppercase tracking-widest hover:bg-dark-green transition-all">
                  Join
                </button>
              </div>
              <p className="text-[10px] text-primary-foreground/35">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20 relative z-10">
        <div className="container-custom py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Itahari Namuna Luxury PMS. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-primary-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-gold transition-colors">Terms of Service</a>
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
