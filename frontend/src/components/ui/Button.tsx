import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'hero' | 'hero-outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  asChild?: boolean;
  to?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  loading = false,
  asChild = false,
  to,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-green text-white hover:bg-primary-dark focus:ring-primary-green shadow-sm',
    secondary: 'bg-primary-gold text-white hover:bg-primary-orange focus:ring-primary-gold',
    outline: 'border border-primary-green text-primary-green hover:bg-primary-green hover:text-white focus:ring-primary-green',
    ghost: 'text-primary-green hover:bg-primary-green/10 focus:ring-primary-green',
    gold: 'bg-primary-gold text-white hover:bg-primary-orange focus:ring-primary-gold',
    hero: 'bg-[#F59E0B] text-[#14532D] hover:bg-[#D97706] focus:ring-[#F59E0B] shadow-xl hover:shadow-2xl hover:-translate-y-0.5',
    'hero-outline': 'border-2 border-white/40 text-white hover:bg-white/10 hover:border-white focus:ring-white',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };
  
  const buttonContent = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && <span>{icon}</span>}
      {children}
    </>
  );
  
  if (asChild && to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {buttonContent}
      </Link>
    );
  }
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};