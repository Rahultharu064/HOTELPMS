import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  highlight?: string;
  subtitle: string;
  breadcrumbs: { label: string; to?: string }[];
  bgImage?: string;
}

const PageHero: React.FC<Props> = ({ title, highlight, subtitle, breadcrumbs, bgImage }) => (
  <section className="relative w-full overflow-hidden" style={{ height: 340 }}>
    {/* Background */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined, backgroundColor: "#0C2012" }}
    />
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(108deg, rgba(20,83,45,0.95) 0%, rgba(20,83,45,0.8) 40%, rgba(20,83,45,0.6) 70%, rgba(0,0,0,0.3) 100%)",
      }}
    />

    {/* Content */}
    <div className="absolute inset-0 flex items-center" style={{ zIndex: 2 }}>
      <div className="site-container w-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
              {crumb.to ? (
                <Link to={crumb.to} className="text-white/60 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#F59E0B] text-[11px] font-bold uppercase tracking-widest">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
          {title}
          {highlight && <span className="text-[#F59E0B]"> {highlight}</span>}
        </h1>
        <p className="text-white/60 text-base font-medium max-w-xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>

    {/* Bottom fade */}
    <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.06), transparent)", zIndex: 1 }} />
  </section>
);

export default PageHero;
