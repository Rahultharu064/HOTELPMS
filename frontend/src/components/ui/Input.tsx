import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-neutral-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-text-secondary">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border border-neutral-border rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-primary-green 
            focus:border-transparent transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';