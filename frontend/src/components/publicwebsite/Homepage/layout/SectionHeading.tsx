import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: React.ReactNode;
  subtitle: string;
  accent?: 'gold' | 'green';
  align?: 'center' | 'left';
}

export const SectionHeading = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  accent = 'gold',
  align = 'center',
}: SectionHeadingProps) => {
  const isGold = accent === 'gold';

  const styles = isGold
    ? {
        line: 'bg-primary-gold/60',
        badge: 'bg-primary-gold/10 text-primary-dark border-primary-gold/25',
        iconRing: 'ring-primary-gold/25',
      }
    : {
        line: 'bg-primary-green/50',
        badge: 'bg-primary-green/8 text-primary-dark border-primary-green/20',
        iconRing: 'ring-primary-green/25',
      };

  const alignClass = align === 'center' ? 'mx-auto text-center' : 'text-left';
  const decorAlign = align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '-32px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 max-w-4xl md:mb-14 ${alignClass}`}
    >
      {/* Eyebrow badge with flanking lines */}
      <div className={`mb-6 flex items-center gap-3 md:gap-4 ${decorAlign}`}>
        <span aria-hidden="true" className={`hidden h-px w-8 sm:block md:w-14 ${styles.line}`} />
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${styles.badge}`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/80 ring-1 ${styles.iconRing}`}>
            <BadgeIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">{badge}</span>
        </div>
        <span aria-hidden="true" className={`hidden h-px w-8 sm:block md:w-14 ${styles.line}`} />
      </div>

      {/* Main headline */}
      <h2 className="font-georgia text-[2rem] font-medium leading-[1.12] tracking-[-0.025em] text-primary-dark md:text-4xl lg:text-[3rem]">
        {title}
      </h2>

      {/* Decorative divider */}
      {/* Subtitle */}
      <p className="mt-4 max-w-2xl text-sm font-normal leading-7 text-neutral-text-secondary md:text-base md:leading-7">
        {subtitle}
      </p>
    </motion.div>
  );
};
