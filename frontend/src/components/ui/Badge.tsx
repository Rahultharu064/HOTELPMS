import React from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'gold'
  | 'outline'
  | 'vip'
  | 'corporate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  /** Prefix icon */
  icon?: React.ReactNode;
  /** Show a pulsing dot (e.g. for live status) */
  dot?: boolean;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  default:    'bg-gray-100 text-gray-600 border-gray-200',
  success:    'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
  warning:    'bg-amber-50 text-amber-600 border-amber-200',
  danger:     'bg-red-50 text-red-600 border-red-200',
  info:       'bg-blue-50 text-blue-600 border-blue-200',
  gold:       'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  outline:    'bg-transparent text-gray-600 border-gray-300',
  vip:        'bg-gradient-to-r from-[#F59E0B] to-orange-400 text-white border-transparent shadow-md',
  corporate:  'bg-[#1F7A3A]/10 text-[#1F7A3A] border-[#1F7A3A]/20',
};

const dotColorMap: Record<BadgeVariant, string> = {
  default:    'bg-gray-400',
  success:    'bg-[#1F7A3A]',
  warning:    'bg-amber-500',
  danger:     'bg-red-500',
  info:       'bg-blue-500',
  gold:       'bg-[#F59E0B]',
  outline:    'bg-gray-400',
  vip:        'bg-white',
  corporate:  'bg-[#1F7A3A]',
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-[9px] gap-1',
  md: 'px-2.5 py-1 text-[10px] gap-1.5',
};

/**
 * Badge — inline status / label chip.
 *
 * ```tsx
 * <Badge variant="vip">VIP</Badge>
 * <Badge variant="success" dot>Active</Badge>
 * <Badge variant="warning" icon={<AlertCircle size={10} />}>Pending</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-black uppercase tracking-widest
        rounded-[8px] border whitespace-nowrap
        ${variantMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorMap[variant]} animate-pulse`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
