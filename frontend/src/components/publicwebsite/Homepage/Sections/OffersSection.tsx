import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, Clock, Percent, 
  ArrowRight, Zap
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const offers = [
  {
    id: 1,
    title: "Ramadan Academic Stay",
    discount: "20% OFF",
    desc: "Experience the spirit of residency with exclusive stay protocols.",
    badge: "Limited Protocol",
    gradient: "from-[#0C2012] to-[#14532D]",
    icon: Sparkles
  },
  {
    id: 2,
    title: "Weekend Scholar Escape",
    discount: "15% OFF",
    desc: "Elevate your weekend with a minimum 2-night stay retreat.",
    badge: "Elite Popular",
    gradient: "from-[#F59E0B] to-[#F97316]",
    icon: Clock
  },
  {
    id: 3,
    title: "Advanced Research Grant",
    discount: "25% OFF",
    desc: "Secure reservation 30 days in advance for maximum privilege.",
    badge: "Highest Value",
    gradient: "from-[#111827] to-gray-800",
    icon: Percent
  }
];

/**
 * HIGH-FIDELITY OFFERS (3 Cards)
 * - 40/60 Split imagery/content
 * - Primary Color protocols
 * - Hover scale transformation
 */
const OffersSection: React.FC = () => {
  return (
    <section className="section-padding bg-[#F9FAFB] relative overflow-hidden">
      <div className="site-container relative z-10">
        <div className="text-center mb-32 max-w-4xl mx-auto space-y-10">
          <span className="section-subtitle justify-center animate-fade-in">Institutional Privileges</span>
          <h2 className="section-title animate-slide-up">
            Seasonal <span className="text-[#1F7A3A]">Offers</span>
          </h2>
          <p className="text-[#6B7280] text-[15px] font-bold leading-relaxed max-w-2xl mx-auto uppercase tracking-widest italic opacity-50">
             Discover curated packages and high-fidelity residency protocols designed to elevate your campus stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {offers.map((o, i) => (
            <ScrollReveal key={o.id} delay={i * 150}>
               <div className="group premium-card flex flex-col h-full bg-white hover:border-[#F59E0B]/20">
                  <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${o.gradient}`}>
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                     <div className="absolute top-10 right-10 w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                        <o.icon size={28} strokeWidth={3} />
                     </div>
                     <div className="absolute bottom-10 left-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-3 block">Privilege Protocol</span>
                        <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">{o.discount}</h3>
                     </div>
                  </div>

                  <div className="p-12 flex flex-col flex-1">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="px-5 py-2 rounded-xl bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest border border-gray-100 group-hover:bg-[#1F7A3A] group-hover:text-white group-hover:border-transparent transition-all">
                           {o.badge}
                        </div>
                        <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[10px]">
                           <Zap size={14} className="fill-[#F59E0B]" strokeWidth={0} /> Elite Status
                        </div>
                     </div>

                     <h4 className="text-2xl font-black text-[#111827] mb-6 uppercase tracking-tighter italic group-hover:text-[#1F7A3A] transition-colors">{o.title}</h4>
                     
                     <p className="text-[#6B7280] text-[14px] font-bold leading-relaxed uppercase tracking-widest italic opacity-60 mb-12">
                        {o.desc}
                     </p>

                     <Link to="/offers" className="mt-auto">
                        <button className="btn-outline w-full py-5 rounded-xl text-[11px] uppercase tracking-[0.4em] font-black group/btn hover:bg-[#111827] hover:border-[#111827]">
                           Explore Protocol <ArrowRight size={18} className="ml-4 group-hover/btn:translate-x-4 transition-transform" />
                        </button>
                     </Link>
                  </div>
               </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
