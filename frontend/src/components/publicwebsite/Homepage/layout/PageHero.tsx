import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface PageHeroBreadcrumb {
  label: string;
  to?: string;
}

export interface PageHeroTab {
  id: string;
  label: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs: PageHeroBreadcrumb[];
  image?: string;
  tabs?: PageHeroTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1920&q=80";

const PageHero = ({
  title,
  subtitle,
  breadcrumbs,
  image = DEFAULT_IMAGE,
  tabs,
  activeTab,
  onTabChange,
}: PageHeroProps) => (
  <header className="page-hero relative isolate overflow-hidden">
    <img
      src={image}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="page-hero-overlay absolute inset-0" />
    <div className="page-hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" />

    <div className="page-hero-content container-custom relative flex min-h-[280px] flex-col items-center justify-center py-14 text-center md:min-h-[320px] md:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70"
      >
        {breadcrumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={12} className="text-white/35" />}
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-[#C9A84C]"
              >
                {index === 0 && <Home size={12} />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#C9A84C]">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {tabs && tabs.length > 0 && (
        <div
          role="tablist"
          aria-label="Stay type"
          className="mb-5 flex items-center gap-8 md:gap-12"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange?.(tab.id)}
                className={`relative pb-2 text-[11px] font-semibold uppercase tracking-[0.42em] transition-colors ${
                  isActive ? "text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-[2px] transition-all ${
                    isActive ? "bg-[#C9A84C]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      <h1 className="font-georgia max-w-4xl text-[2rem] font-semibold leading-[1.15] tracking-tight text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:text-4xl lg:text-[2.75rem]">
        {title}
      </h1>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-white/85 md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  </header>
);

export default PageHero;
