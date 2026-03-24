import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'glass' | 'green';
  isHoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'white', isHoverable = true, children, ...props }, ref) => {
    const variants = {
      white: 'bg-white border border-[#E5E7EB]',
      glass: 'bg-white/70 backdrop-blur-xl border border-white/20',
      green: 'bg-[#14532D] border border-[#1F7A3A]/20 text-white',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300 shadow-sm',
          variants[variant],
          isHoverable && 'hover:shadow-xl hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
