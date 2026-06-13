import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../ui/Button";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Phone, 
  Mail, 
  ChevronDown, 
  CalendarCheck 
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
      { label: "Standard Rooms", to: "/rooms" },
      { label: "Deluxe Rooms", to: "/rooms" },
      { label: "Suite Rooms", to: "/rooms" }
    ]
  },
  { 
    label: "Dining", 
    to: "/facilities", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Fine Dining Restaurant", to: "/facilities" },
      { label: "Bar & Lounge", to: "/facilities" },
      { label: "Coffee Shop", to: "/facilities" }
    ]
  },
  { 
    label: "Events", 
    to: "/facilities", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Weddings", to: "/facilities" },
      { label: "Conferences", to: "/facilities" },
      { label: "Private Celebrations", to: "/facilities" }
    ]
  },
  { 
    label: "Gallery", 
    to: "/about", 
    hasDropdown: true,
    dropdownItems: [
      { label: "Hotel Gallery", to: "/about" },
      { label: "Virtual Tour", to: "/about" }
    ]
  },
  { label: "Contact", to: "/contact" }
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileDropdown = (label: string) => {
    if (activeMobileDropdown === label) {
      setActiveMobileDropdown(null);
    } else {
      setActiveMobileDropdown(label);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-border/50">
      {/* Main Navbar */}
      <div className="container-custom flex items-center justify-between h-20">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3.5 group select-none">
          <img 
            src="/Logos1.png" 
            alt="Branding Logo" 
            className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#14532D] leading-none uppercase">
              Itahari Namuna
            </span>
            <span className="text-[9px] font-black uppercase text-[#1F7A3A] tracking-[0.2em] mt-1.5">
              Luxury PMS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            if (item.hasDropdown) {
              return (
                <li key={item.label} className="relative group flex items-center h-full">
                  <button
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors cursor-pointer py-7 ${
                      isActive 
                        ? "text-[#14532D]" 
                        : "text-muted-foreground hover:text-[#14532D]"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      {/* Underline Indicator */}
                      <div className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#F59E0B] rounded-full transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-center opacity-0 group-hover:opacity-100 ${isActive ? "scale-x-100 opacity-100" : ""}`} />
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-[80%] left-0 w-52 bg-white rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-gray-100 py-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[90%] transition-all duration-300 z-50">
                    {item.dropdownItems?.map((dItem) => (
                      <Link
                        key={dItem.label}
                        to={dItem.to}
                        className="block px-5 py-2.5 text-xs font-semibold text-gray-700 hover:text-[#14532D] hover:bg-[#14532D]/5 transition-all duration-200"
                      >
                        {dItem.label}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            }

            return (
              <li key={item.to} className="relative flex items-center h-full group">
                <Link
                  to={item.to}
                  className={`text-sm font-semibold transition-colors py-7 ${
                    isActive ? "text-[#14532D]" : "text-muted-foreground hover:text-[#14532D]"
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    {/* Underline Indicator */}
                    <div className={`absolute -bottom-1 left-0 right-0 h-[3px] bg-[#F59E0B] rounded-full transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-center opacity-0 group-hover:opacity-100 ${isActive ? "scale-x-100 opacity-100" : ""}`} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Book Now Button (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link
            to="/booking"
            className="flex items-center gap-2 px-6 py-3.5 bg-[#14532D] hover:bg-[#F59E0B] hover:text-[#14532D] text-[#F59E0B] font-bold text-xs uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-md hover:shadow-[0_8px_25px_rgba(20,83,45,0.25)] transform active:scale-95 group/btn"
          >
            <CalendarCheck size={16} className="text-[#F59E0B] group-hover/btn:text-[#14532D] transition-colors duration-300" />
            <span>Book Now</span>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden p-2 rounded-xl border border-gray-100 text-[#14532D] hover:bg-gray-50 transition-colors active:scale-95 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white animate-fade-slide-up shadow-inner">
          <div className="container-custom py-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                const isOpen = activeMobileDropdown === item.label;
                return (
                  <div key={item.label} className="border-b border-gray-50 pb-2">
                    <button
                      onClick={() => toggleMobileDropdown(item.label)}
                      className="flex items-center justify-between w-full text-sm font-bold text-gray-800 py-2 cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="pl-4 py-2 flex flex-col gap-2 bg-gray-50/50 rounded-xl mt-1">
                        {item.dropdownItems?.map((dItem) => (
                          <Link
                            key={dItem.label}
                            to={dItem.to}
                            onClick={() => setMobileOpen(false)}
                            className="text-xs font-semibold text-gray-600 py-1.5 hover:text-[#14532D]"
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
                  className={`text-sm font-bold border-b border-gray-50 pb-2 ${
                    pathname === item.to ? "text-[#14532D]" : "text-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Book Now Button */}
            <Link
              to="/booking"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#14532D] text-[#F59E0B] font-bold text-xs uppercase tracking-widest rounded-xl mt-2 shadow-md"
            >
              <CalendarCheck size={16} />
              <span>Book Now</span>
            </Link>

            {/* Mobile Authentication Area */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild to="/login" onClick={() => setMobileOpen(false)}>
                    <span>Login</span>
                  </Button>
                  <Button size="sm" asChild to="/signup" onClick={() => setMobileOpen(false)}>
                    <span>Sign Up</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#14532D] flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</span>
                      <span className="text-[10px] text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild to="/profile" onClick={() => setMobileOpen(false)}>
                    <>
                      <User size={16} />
                      <span>My Profile</span>
                    </>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { logout(); setMobileOpen(false); }}>
                    <>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-xs text-gray-500">
              <a href="tel:985-2066332" className="flex items-center gap-2 hover:text-[#14532D]">
                <Phone size={14} className="text-[#F59E0B]" />
                <span>985-2066332</span>
              </a>
              <a href="mailto:royalresort2002@gmail.com" className="flex items-center gap-2 hover:text-[#14532D]">
                <Mail size={14} className="text-[#F59E0B]" />
                <span>royalresort2002@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
