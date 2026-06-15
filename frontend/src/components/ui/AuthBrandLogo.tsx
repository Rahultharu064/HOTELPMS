import { motion } from 'framer-motion';

interface AuthBrandLogoProps {
  variant?: 'guest' | 'staff';
  size?: 'md' | 'lg';
}

export const AuthBrandLogo = ({ variant = 'guest', size = 'md' }: AuthBrandLogoProps) => {
  const logoHeight = size === 'lg' ? 'h-20' : 'h-16';
  const accent = variant === 'staff'
    ? 'from-primary-green/25 to-primary-gold/25 ring-primary-green/15'
    : 'from-blue-500/15 to-indigo-500/15 ring-blue-500/10';

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative mb-5">
        <div className={`absolute -inset-3 bg-gradient-to-br ${accent} rounded-[2rem] blur-2xl opacity-80`} />
        <div className={`relative p-4 bg-white rounded-[1.75rem] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-white ring-1 ${accent.split(' ').pop()}`}>
          <img
            src="/Logos1.png"
            alt="Itahari Namuna Logo"
            className={`${logoHeight} w-auto object-contain`}
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="w-8 h-1 rounded-full bg-primary-green" />
          <span className="w-3 h-1 rounded-full bg-primary-gold" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-gold">
          Itahari Namuna
        </p>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
          Luxury Property Management
        </p>
      </div>
    </motion.div>
  );
};
