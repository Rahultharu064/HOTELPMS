import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";
import { Phone, Mail, Globe } from "lucide-react";

/**
 * TOPBAR
 * Updated to use react-icons for social links to ensure compatibility.
 */
const Topbar = () => (
  <div className="topbar-gradient h-9 flex items-center text-sm font-medium">
    <div className="container-custom flex items-center justify-between w-full">
      <div className="flex items-center gap-4 text-foreground/90">
        <span className="flex items-center gap-1.5 cursor-default">
          <Phone className="h-3.5 w-3.5" /> +977-25-585000
        </span>
        <span className="hidden sm:flex items-center gap-1.5 cursor-default">
          <Mail className="h-3.5 w-3.5" /> info@itaharipms.com
        </span>
      </div>
      <div className="flex items-center gap-3 text-foreground/80">
        <a href="#" aria-label="Facebook" className="hover:text-foreground transition-colors">
          <FaFacebookF className="h-3.5 w-3.5" />
        </a>
        <a href="#" aria-label="Instagram" className="hover:text-foreground transition-colors">
          <FaInstagram className="h-3.5 w-3.5" />
        </a>
        <a href="#" aria-label="Twitter" className="hover:text-foreground transition-colors">
          <FaTwitter className="h-3.5 w-3.5" />
        </a>
        <span className="flex items-center gap-1 text-xs cursor-default">
          <Globe className="h-3 w-3" /> EN
        </span>
      </div>
    </div>
  </div>
);

export default Topbar;
