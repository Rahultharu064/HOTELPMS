import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface PageHeroBreadcrumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: PageHeroBreadcrumb[];
}

const PageHero = ({ title, subtitle, breadcrumbs }: PageHeroProps) => (
  <div className="bg-gradient-to-r from-primary-dark via-primary-green to-primary-dark py-12 md:py-16">
    <div className="container-custom text-center">
      <nav className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={12} className="text-white/30" />}
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="inline-flex items-center gap-1 transition-colors hover:text-primary-gold"
              >
                {index === 0 && <Home size={12} />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-primary-gold">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <h1 className="font-georgia text-3xl font-bold text-white md:text-4xl lg:text-[2.5rem]">{title}</h1>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/80 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export default PageHero;
