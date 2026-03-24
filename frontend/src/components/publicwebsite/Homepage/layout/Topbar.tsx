import React from "react";
import { Phone, Mail, Clock, Globe, MessageCircle, Share2, Play } from "lucide-react";

/**
 * TOPBAR
 * - Background: #F59E0B (Gold) — from prompt spec
 * - Height: 44px
 * - Max-width: 1280px with 40px horizontal padding (matches every other section)
 */
const Topbar: React.FC = () => (
  <div className="w-full bg-[#F59E0B]" style={{ height: 44 }}>
    <div className="site-container h-full flex items-center justify-between">

      {/* Left: contact links */}
      <div className="flex items-center gap-6">
        <a
          href="tel:+977025123456"
          className="flex items-center gap-2 text-[#14532D] hover:text-[#0a2e1a] transition-colors"
        >
          <Phone size={13} strokeWidth={2.5} />
          <span className="text-[11.5px] font-bold tracking-wide">+977 025 123456</span>
        </a>
        <span className="w-px h-3 bg-[#D97706]/50" />
        <a
          href="mailto:info@itaharinamuna.edu.np"
          className="hidden sm:flex items-center gap-2 text-[#14532D] hover:text-[#0a2e1a] transition-colors"
        >
          <Mail size={13} strokeWidth={2.5} />
          <span className="text-[11.5px] font-bold tracking-wide">info@itaharinamuna.edu.np</span>
        </a>
      </div>

      {/* Right: reception + social */}
      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center gap-1.5 text-[#14532D]">
          <Clock size={12} strokeWidth={2.5} />
          <span className="text-[11px] font-bold tracking-wide">Reception 24/7</span>
        </div>
        <span className="w-px h-3 bg-[#D97706]/50 hidden sm:block" />
        <div className="flex items-center gap-3">
          {[Globe, MessageCircle, Share2, Play].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label={`social link ${i + 1}`}
              className="text-[#14532D]/60 hover:text-[#14532D] transition-colors"
            >
              <Icon size={13} strokeWidth={2} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Topbar;
