import React from 'react';

/* ── Props ───────────────────────────────────────────────────── */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  /** Visual variant — accepted for API consistency but has no effect on native inputs. */
  variant?: 'default' | 'outline' | 'ghost';
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

/* ── Label sub-component ─────────────────────────────────────── */

const InputLabel: React.FC<LabelProps> = ({ children, className = '', ...props }) => (
  <label
    className={`block text-sm font-semibold text-neutral-text-primary ${className}`}
    {...props}
  >
    {children}
  </label>
);
InputLabel.displayName = 'Input.Label';

/* ── Input (forwardRef) ──────────────────────────────────────── */

const _Input = React.forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    icon,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    variant,          // accepted but not forwarded to the DOM
    className = '',
    ...props
  }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <InputLabel className="mb-2">{label}</InputLabel>
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
_Input.displayName = 'Input';

/* ── Compound export ─────────────────────────────────────────── */

/**
 * Input component with an optional compound sub-component:
 * - `<Input />` — standard text input
 * - `<Input.Label />` — styled label element
 */
export const Input = Object.assign(_Input, { Label: InputLabel });