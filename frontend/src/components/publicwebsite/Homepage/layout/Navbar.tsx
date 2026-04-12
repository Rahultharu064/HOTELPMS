import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../ui/Button";
import { Menu, X, Building } from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
  { label: "Facilities", to: "/facilities" },
  { label: "Offers", to: "/offers" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group select-none">
          <div className="w-9 h-9 rounded-lg bg-primary-green flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
            <Building className="text-white h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-primary-dark leading-none">Itahari Namuna</span>
            <span className="text-[9px] font-black uppercase text-primary-green tracking-[0.2em] mt-0.5">College PMS</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`nav-link text-sm font-medium pb-1 transition-colors ${
                  pathname === item.to ? "text-primary active border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-primary/50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild to="/login">
            <span>Login</span>
          </Button>
          <Button size="sm" asChild to="/register">
            <span>Register</span>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background animate-fade-slide-up">
          <div className="container-custom py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium py-2 ${
                  pathname === item.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="flex-1" asChild to="/login">
                <span>Login</span>
              </Button>
              <Button size="sm" className="flex-1" asChild to="/register">
                <span>Register</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
