import { Phone, Mail } from "lucide-react";

const Topbar = () => {
  return (
    <div className="hidden border-b border-white/10 bg-primary-dark text-white md:block">
      <div className="container-custom flex h-9 items-center justify-between">
        {/* Left Side: Contact Info */}
        <div className="flex items-center gap-6 text-xs font-medium text-white/85">
          <a href="tel:985-2066332" className="group flex items-center gap-2 transition-colors hover:text-white">
            <Phone size={13} className="text-primary-gold transition-transform duration-200 group-hover:scale-110" />
            <span>985-2066332</span>
          </a>
          <a href="mailto:royalresort2002@gmail.com" className="group flex items-center gap-2 transition-colors hover:text-white">
            <Mail size={13} className="text-primary-gold transition-transform duration-200 group-hover:scale-110" />
            <span>royalresort2002@gmail.com</span>
          </a>
        </div>

        <p className="text-xs font-medium text-white/75">Itahari, Sunsari · Nepal</p>
      </div>
    </div>
  );
};

export default Topbar;
