import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { Phone, Mail, Clock, User, LogOut } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaGlobe } from "react-icons/fa6";

const Topbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="bg-[#14532D] text-white py-2 border-b border-white/5 hidden md:block">
      <div className="container-custom flex justify-between items-center h-8">
        {/* Left Side: Contact Info */}
        <div className="flex items-center gap-6 text-[11px] font-medium tracking-wide">
          <a href="tel:985-2066332" className="flex items-center gap-2 hover:text-[#F59E0B] transition-colors group">
            <Phone size={13} className="text-[#F59E0B] group-hover:scale-110 transition-transform duration-200" />
            <span>985-2066332</span>
          </a>
          <a href="mailto:royalresort2002@gmail.com" className="flex items-center gap-2 hover:text-[#F59E0B] transition-colors group">
            <Mail size={13} className="text-[#F59E0B] group-hover:scale-110 transition-transform duration-200" />
            <span>royalresort2002@gmail.com</span>
          </a>
          <div className="flex items-center gap-2 text-white/85">
            <Clock size={13} className="text-[#F59E0B]" />
            <span>24/7 Service</span>
          </div>
        </div>

        {/* Right Side: Social Media & Authentication */}
        <div className="flex items-center gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-1.5">
            <a href="#" aria-label="Facebook" className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/95 hover:bg-[#F59E0B] hover:text-[#14532D] transition-all duration-300">
              <FaFacebookF size={11} />
            </a>
            <a href="#" aria-label="Instagram" className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/95 hover:bg-[#F59E0B] hover:text-[#14532D] transition-all duration-300">
              <FaInstagram size={11} />
            </a>
            <a href="#" aria-label="TikTok" className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/95 hover:bg-[#F59E0B] hover:text-[#14532D] transition-all duration-300">
              <FaTiktok size={11} />
            </a>
            <a href="#" aria-label="Globe" className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/95 hover:bg-[#F59E0B] hover:text-[#14532D] transition-all duration-300">
              <FaGlobe size={11} />
            </a>
          </div>

          {/* Vertical Divider */}
          <div className="w-[1px] h-3.5 bg-white/20"></div>

          {/* Authentication Links */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wide text-white/95">
              <Link to="/login" className="hover:text-[#F59E0B] transition-colors">Login</Link>
              <span className="text-white/20">|</span>
              <Link to="/signup" className="hover:text-[#F59E0B] transition-colors">Register</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wide">
              <Link to="/profile" className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5">
                <User size={12} className="text-[#F59E0B]" />
                <span>{user?.firstName}</span>
              </Link>
              <span className="text-white/20">|</span>
              <button onClick={logout} className="hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none p-0">
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
