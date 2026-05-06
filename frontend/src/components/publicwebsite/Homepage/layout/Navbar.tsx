import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../ui/Button";
import { Menu, X, Building, User, LogOut } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

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
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group select-none">
          <img src="/LOGOS.png" alt="Itahari Namuna Logo" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
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
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild to="/login">
                <span>Login</span>
              </Button>
              <Button size="sm" asChild to="/signup">
                <span>Sign Up</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span className="text-xs font-bold text-gray-700">{user?.firstName}</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
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
            <div className="flex flex-col gap-2 pt-2 border-t">
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full" asChild to="/login" onClick={() => setMobileOpen(false)}>
                    <span>Login</span>
                  </Button>
                  <Button size="sm" className="w-full" asChild to="/signup" onClick={() => setMobileOpen(false)}>
                    <span>Sign Up</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
