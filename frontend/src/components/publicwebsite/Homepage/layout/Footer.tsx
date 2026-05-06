import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  const socials = [
    { Icon: FaFacebookF, href: "#" },
    { Icon: FaInstagram, href: "#" },
    { Icon: FaTwitter, href: "#" },
    { Icon: FaYoutube, href: "#" },
  ];

  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <img src="/LOGOS.png" alt="Itahari Namuna Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
              <div>
                <h3 className="font-bold text-xl mb-1 tracking-tight">Itahari Namuna</h3>
                <p className="text-primary-gold font-black uppercase text-[10px] tracking-[0.3em]">Property Management</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Experience premium hospitality with modern property management. Your comfort is our priority, and excellence is our standard.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-green hover:scale-110 transition-all duration-300 border border-white/5 shadow-lg"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1.5 left-0 w-8 h-1 bg-primary-gold rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              {["Home", "Rooms", "Facilities", "Offers", "About", "Contact"].map((l) => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="hover:text-primary-gold transition-colors flex items-center group">
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-primary-gold">→</span>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1.5 left-0 w-8 h-1 bg-primary-gold rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary-green transition-colors">
                  <MapPin className="h-4 w-4 shrink-0" />
                </div>
                <span className="pt-0.5">Itahari-6, Sunsari, Nepal</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary-green transition-colors">
                  <Phone className="h-4 w-4 shrink-0" />
                </div>
                <span>+977-25-585000</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary-green transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                </div>
                <span>info@itaharipms.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-1.5 left-0 w-8 h-1 bg-primary-gold rounded-full"></span>
            </h4>
            <p className="text-sm text-primary-foreground/70 mb-6 font-medium">Subscribe for exclusive deals and updates delivered to your inbox.</p>
            <div className="space-y-3">
              <div className="flex group">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 h-11 px-4 rounded-l-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
                />
                <button className="h-11 px-5 rounded-r-xl bg-primary-green text-white text-sm font-bold hover:bg-dark-green transition-all btn-active-scale shadow-lg">
                  JOIN
                </button>
              </div>
              <p className="text-[10px] text-primary-foreground/40 italic">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/5 bg-black/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40 font-medium">
          <p>© 2026 Itahari Namuna College PMS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
