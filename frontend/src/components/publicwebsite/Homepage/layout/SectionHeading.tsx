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
  const accentStyles = accent === 'gold'
    ? { badge: 'bg-primary-gold/10 text-primary-gold', bar: 'bg-primary-gold', highlight: 'gradient-text' }
    : { badge: 'bg-primary-green/10 text-primary-green', bar: 'bg-primary-green', highlight: 'text-primary-green' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 ${accentStyles.badge}`}>
        <BadgeIcon className="h-4 w-4" />
        <span className="font-bold text-[10px] uppercase tracking-[0.25em]">{badge}</span>
      </div>

      <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-primary-dark tracking-tight leading-[1.1] mb-5">
        {title}
      </h2>

      <div className={`flex items-center gap-3 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`h-1.5 w-14 rounded-full ${accentStyles.bar}`} />
        <span className="h-1 w-1 rounded-full bg-primary-dark/20" />
        <span className={`h-1 w-8 rounded-full ${accentStyles.bar} opacity-40`} />
      </div>

      <p className="text-lg text-neutral-text-secondary font-medium leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
};
