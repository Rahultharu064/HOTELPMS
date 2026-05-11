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
  <section className="relative w-full overflow-hidden page-hero">
    {/* Background */}
    <div
      className="absolute inset-0 bg-cover bg-center page-hero-bg"
      ref={(el) => {
        if (el && bgImage) el.style.setProperty('--hero-bg', `url(${bgImage})`);
      }}
    />
    <div className="absolute inset-0 page-hero-overlay" />

    {/* Content */}
    <div className="absolute inset-0 flex items-center page-hero-content">

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
    <div className="absolute inset-x-0 bottom-0 h-16 page-hero-bottom-fade" />

  </section>
);

export default PageHero;
