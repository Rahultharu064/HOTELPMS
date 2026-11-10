import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, User, LogOut, Phone, Mail, ChevronDown, CalendarCheck
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Rooms",
    to: "/rooms",
    hasDropdown: true,
    dropdownItems: [
      { label: "All rooms", to: "/rooms" },
      { label: "Standard rooms", to: "/rooms?type=Standard" },
      { label: "Deluxe rooms", to: "/rooms?type=Deluxe" },
      { label: "Suite rooms", to: "/rooms?type=Suite" },
    ],
  },
  { label: "Facilities", to: "/facilities" },
  {
    label: "Gallery",
    to: "/gallery",
    hasDropdown: true,
    dropdownItems: [
      { label: "Hotel gallery", to: "/gallery" },
      { label: "Our venues", to: "/gallery#venues" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

const isItemActive = (pathname: string, to: string) => {
  if (to === "/rooms") return pathname.startsWith("/rooms");
  if (to === "/gallery") return pathname.startsWith("/gallery");
  return pathname === to;
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileDropdown = (label: string) => {
    setActiveMobileDropdown(prev => (prev === label ? null : label));
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Desktop / tablet nav bar */}
      <div
        className="container-custom flex items-center justify-between"
        style={{ height: '76px' }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 select-none group"
          style={{ textDecoration: 'none' }}
        >
          <img
            src="/Logos1.png"
            alt="Itahari Namuna"
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain',
              transition: 'transform 300ms ease',
            }}
            className="group-hover:scale-[1.03]"
          />
          <div>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              Itahari Namuna
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-ui)',
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--color-accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              Luxury Stay
            </span>
          </div>
        </Link>

        {/* Desktop nav items */}
        <ul className="hidden lg:flex items-center h-full" style={{ gap: '4px', listStyle: 'none' }}>
          {navItems.map((item) => {
            const active = isItemActive(pathname, item.to);
            if (item.hasDropdown) {
              return (
                <li key={item.label} className="relative group h-full flex items-center">
                  <Link
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 14px',
                      height: '100%',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: active ? 'var(--color-primary)' : 'var(--color-muted)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                      position: 'relative',
                    }}
                    className="navbar-item"
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      style={{ transition: 'transform 200ms ease' }}
                      className="group-hover:rotate-180 group-focus-within:rotate-180"
                    />
                    {/* Active indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '14px',
                        right: '14px',
                        height: '2px',
                        background: 'var(--color-accent)',
                        borderRadius: '2px 2px 0 0',
                        opacity: active ? 1 : 0,
                        transition: 'opacity 150ms ease',
                      }}
                      className="group-hover:opacity-100"
                    />
                  </Link>

                  {/* Dropdown */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '200px',
                      background: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-md)',
                      padding: '6px',
                      opacity: 0,
                      visibility: 'hidden',
                      transform: 'translateY(-6px)',
                      transition: 'opacity 150ms ease, transform 150ms ease, visibility 150ms',
                    }}
                    className="group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0"
                  >
                    {item.dropdownItems?.map((dItem) => (
                      <Link
                        key={dItem.label}
                        to={dItem.to}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          fontFamily: 'var(--font-ui)',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: 'var(--color-ink)',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          transition: 'background 100ms ease, color 100ms ease',
                        }}
                        className="hover:bg-green-50 hover:text-green-800"
                      >
                        {dItem.label}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            }

            return (
              <li key={item.to} className="relative group h-full flex items-center">
                <Link
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 14px',
                    height: '100%',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: active ? 'var(--color-primary)' : 'var(--color-muted)',
                    textDecoration: 'none',
                    transition: 'color 150ms ease',
                    position: 'relative',
                  }}
                  className="navbar-item"
                >
                  {item.label}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '14px',
                      right: '14px',
                      height: '2px',
                      background: 'var(--color-accent)',
                      borderRadius: '2px 2px 0 0',
                      opacity: active ? 1 : 0,
                      transition: 'opacity 150ms ease',
                    }}
                    className="group-hover:opacity-100"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: auth + Book Now */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  transition: 'background 150ms ease',
                  background: 'transparent',
                }}
                className="hover:bg-gray-50"
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span>{user?.firstName}</span>
              </Link>
              <button
                onClick={logout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 10px', background: 'transparent',
                  border: 'none', borderRadius: '8px',
                  fontFamily: 'var(--font-ui)', fontSize: '13px',
                  fontWeight: 500, color: 'var(--color-muted)',
                  cursor: 'pointer', transition: 'color 150ms ease',
                }}
                className="hover:text-red-600"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                style={{
                  padding: '6px 14px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'color 150ms ease',
                }}
                className="hover:text-green-800"
              >
                Sign in
              </Link>
            </div>
          )}

          {/* Primary CTA — Book Now */}
          <Link
            to="/booking"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 20px',
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'background 150ms ease',
              boxShadow: '0 1px 3px rgba(45,106,79,0.20)',
            }}
            className="hover:bg-green-800"
          >
            <CalendarCheck size={15} />
            <span>Book now</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          ref={menuButtonRef}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary-green/15 bg-primary-green/5 text-primary-dark transition-all duration-200 hover:border-primary-green/30 hover:bg-primary-green/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/40 focus-visible:ring-offset-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          <span className="transition-transform duration-200" style={{ transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            {mobileOpen ? <X size={23} strokeWidth={1.8} /> : <Menu size={23} strokeWidth={1.8} />}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          aria-label="Mobile navigation"
          style={{
            borderTop: '1px solid var(--color-border)',
            background: '#FFFFFF',
          }}
          className="lg:hidden animate-fade-slide-up"
        >
          <div
            className="container-custom custom-scrollbar"
            style={{ padding: '16px 0 max(16px, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: 'calc(100dvh - 76px)', overflowY: 'auto' }}
          >
            {navItems.map((item) => {
              if (item.hasDropdown) {
                const isOpen = activeMobileDropdown === item.label;
                return (
                  <div key={item.label}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderBottom: '1px solid var(--color-border)', paddingBottom: '8px',
                      }}
                    >
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          flex: 1, padding: '8px 0',
                          fontFamily: 'var(--font-ui)', fontSize: '15px',
                          fontWeight: 500, color: 'var(--color-ink)',
                          textDecoration: 'none',
                        }}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleMobileDropdown(item.label)}
                        style={{ minWidth: '44px', minHeight: '44px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                        aria-expanded={isOpen}
                        aria-controls={`${item.label.toLowerCase()}-mobile-subnav`}
                      >
                        <ChevronDown
                          size={16}
                          style={{ color: 'var(--color-muted)', transition: 'transform 200ms ease', transform: isOpen ? 'rotate(180deg)' : 'none' }}
                        />
                      </button>
                    </div>
                    {isOpen && (
                      <div id={`${item.label.toLowerCase()}-mobile-subnav`} style={{ paddingLeft: '16px', paddingBottom: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {item.dropdownItems?.map((dItem) => (
                          <Link
                            key={dItem.label}
                            to={dItem.to}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              minHeight: '44px', display: 'flex', alignItems: 'center', padding: '8px 0',
                              fontFamily: 'var(--font-ui)', fontSize: '14px',
                              fontWeight: 400, color: 'var(--color-muted)',
                              textDecoration: 'none',
                            }}
                          >
                            {dItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    minHeight: '48px', display: 'flex', alignItems: 'center', padding: '10px 0',
                    fontFamily: 'var(--font-ui)', fontSize: '15px',
                    fontWeight: isItemActive(pathname, item.to) ? 600 : 500,
                    color: isItemActive(pathname, item.to) ? 'var(--color-primary)' : 'var(--color-ink)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Book Now */}
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                width: '100%', minHeight: '48px',
                background: 'var(--color-primary)', color: '#FFFFFF',
                fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600,
                borderRadius: '8px', textDecoration: 'none',
                marginTop: '12px',
              }}
            >
              <CalendarCheck size={16} />
              <span>Book now</span>
            </Link>

            {/* Mobile Auth */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)', marginTop: '8px' }}>
              {!isAuthenticated ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '48px', borderRadius: '8px',
                      border: '1.5px solid var(--color-primary)', color: 'var(--color-primary)',
                      fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: '48px', borderRadius: '8px',
                      background: 'var(--color-ink)', color: '#FFFFFF',
                      fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px',
                      background: 'var(--color-surface)',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'var(--color-primary)', color: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 700,
                      }}
                    >
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)' }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-muted)' }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 12px', borderRadius: '8px',
                      fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
                      color: 'var(--color-ink)', textDecoration: 'none',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <User size={15} />
                    <span>My profile</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 12px', borderRadius: '8px',
                      background: 'none', border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
                      color: 'var(--color-danger)', cursor: 'pointer', width: '100%',
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Contact */}
            <div
              style={{
                display: 'flex', flexDirection: 'column', gap: '8px',
                paddingTop: '12px', borderTop: '1px solid var(--color-border)', marginTop: '4px',
              }}
            >
              <a
                href="tel:985-2066332"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-ui)', fontSize: '13px',
                  color: 'var(--color-muted)', textDecoration: 'none',
                }}
              >
                <Phone size={14} style={{ color: 'var(--color-accent)' }} />
                <span>985-2066332</span>
              </a>
              <a
                href="mailto:namunacollege.edu.np"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-ui)', fontSize: '13px',
                  color: 'var(--color-muted)', textDecoration: 'none',
                }}
              >
                <Mail size={14} style={{ color: 'var(--color-accent)' }} />
                <span>namunacollege.edu.np</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar-item:hover { color: var(--color-primary) !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
