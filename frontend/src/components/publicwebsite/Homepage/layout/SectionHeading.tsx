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
        badge: 'bg-primary-gold/8 text-primary-gold border-primary-gold/20',
        bar: 'bg-primary-gold',
        dot: 'bg-primary-green',
        iconRing: 'ring-primary-gold/25',
      }
    : {
        line: 'bg-primary-green/50',
        badge: 'bg-primary-green/8 text-primary-green border-primary-green/20',
        bar: 'bg-primary-green',
        dot: 'bg-primary-gold',
        iconRing: 'ring-primary-green/25',
      };

  const alignClass = align === 'center' ? 'mx-auto text-center' : 'text-left';
  const decorAlign = align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 max-w-4xl md:mb-20 ${alignClass}`}
    >
      {/* Eyebrow badge with flanking lines */}
      <div className={`mb-6 flex items-center gap-3 md:gap-4 ${decorAlign}`}>
        <span className={`hidden h-px w-8 sm:block md:w-14 ${styles.line}`} />
        <div
          className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm ${styles.badge}`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/80 ring-1 ${styles.iconRing}`}>
            <BadgeIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">{badge}</span>
        </div>
        <span className={`hidden h-px w-8 sm:block md:w-14 ${styles.line}`} />
      </div>

      {/* Main headline */}
      <h2 className="font-georgia text-[2.125rem] font-bold leading-[1.12] tracking-tight text-primary-dark md:text-4xl lg:text-[3.35rem]">
        {title}
      </h2>

      {/* Decorative divider */}
      <div className={`my-6 flex items-center gap-2.5 ${decorAlign}`}>
        <span className={`h-[2px] w-12 rounded-full ${styles.bar}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        <span className={`h-[2px] w-8 rounded-full ${styles.bar} opacity-45`} />
      </div>

      {/* Subtitle */}
      <p className="max-w-2xl text-base font-medium leading-relaxed text-neutral-text-secondary md:text-lg md:leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
};
