import React, { useState, useEffect } from "react";
import { Menu, X, Building2, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Facilities", to: "/#facilities" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/**
 * NAVBAR
 * - Background: WHITE (#FFFFFF)
 * - Links: dark text (#111827), green on hover + active
 * - 72px height
 * - Logo | CENTER links (absolute) | Sign In + Book Now
 * - Proper gap-8 (32px) between nav links
 */
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const isActive = (to: string) =>
    to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to.split("#")[0]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md border-[#E5E7EB]"
          : "bg-white border-[#F3F4F6]"
      }`}
    >
      {/* ── Main bar: 72px tall ── */}
      <div className="site-container flex items-center justify-between" style={{ height: 72 }}>

        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
            <Building2 size={19} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-extrabold tracking-tight leading-none text-[#111827]" style={{ fontSize: 16 }}>
              Itahari Namuna
            </p>
            <p
              className="font-black uppercase text-[#1F7A3A] mt-0.5"
              style={{ fontSize: 9, letterSpacing: "0.3em" }}
            >
              College PMS
            </p>
          </div>
        </Link>

        {/* CENTER: Nav links — gap-8 = 32px, absolutely centered */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              to={l.to}
              className={`relative py-2 text-[13.5px] font-semibold tracking-wide transition-all duration-200 ${
                isActive(l.to)
                  ? "text-[#1F7A3A]"
                  : "text-[#374151] hover:text-[#1F7A3A]"
              }`}
            >
              {l.label}
              {/* Gold underline on active */}
              {isActive(l.to) && (
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#F59E0B] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Sign In + Book Now */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-[#374151] hover:text-[#1F7A3A] hover:bg-[#F0FDF4] transition-all duration-200"
          >
            <LogIn size={14} strokeWidth={2} />
            Sign In
          </Link>
          <Link
            to="/booking"
            className="px-6 py-2.5 rounded-md bg-[#1F7A3A] hover:bg-[#14532D] text-white text-[13px] font-black tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#F3F4F6]">
          <div className="site-container py-5">
            <div className="flex flex-col gap-1 mb-5">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-colors ${
                    isActive(l.to)
                      ? "text-[#1F7A3A] bg-[#F0FDF4]"
                      : "text-[#374151] hover:text-[#1F7A3A] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 pt-4 border-t border-[#F3F4F6]">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 text-center rounded-xl border-2 border-[#E5E7EB] text-[#374151] text-sm font-semibold hover:bg-[#F9FAFB] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/booking"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 text-center rounded-xl bg-[#1F7A3A] hover:bg-[#14532D] text-white text-sm font-black transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
