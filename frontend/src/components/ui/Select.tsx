import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Array<{ value: string | number; label: string }>;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-neutral-text-primary">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border border-neutral-border rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-primary-green 
          focus:border-transparent transition-all duration-200
          ${error ? 'border-error' : ''}
          ${className}`}
        {...props}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};