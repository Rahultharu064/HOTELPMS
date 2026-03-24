import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'error' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#1F7A3A] text-white hover:bg-[#14532D] shadow-lg shadow-green-900/20 active:scale-95 hover:scale-[1.02]',
      secondary: 'bg-[#14532D] text-white hover:bg-[#0a2e19] active:scale-95 hover:scale-[1.02]',
      gold: 'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-lg shadow-orange-900/20 active:scale-95 hover:scale-[1.02]',
      outline: 'border-2 border-[#1F7A3A] text-[#1F7A3A] hover:bg-green-50 active:scale-95 hover:scale-[1.02]',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95 hover:scale-[1.02]',
      error: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 hover:scale-[1.02]',
      white: 'bg-white text-[#1F7A3A] hover:bg-gray-50 active:scale-95 hover:scale-[1.02] border border-gray-100',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg font-semibold rounded-xl',
      xl: 'px-10 py-5 text-xl font-bold rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none relative overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
