import type { ButtonHTMLAttributes } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: number;
};

const base =
  'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/** Visible destructive action — always red-tinted, not gray */
export function DeleteIconButton({
  size = 16,
  className = '',
  title = 'Delete',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`${base} p-2.5 bg-red-50 text-red-600 border border-red-200 shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 focus-visible:ring-red-400 ${className}`}
      {...props}
    >
      <Trash2 size={size} strokeWidth={2.25} />
    </button>
  );
}

/** Visible edit action — brand green */
export function EditIconButton({
  size = 16,
  className = '',
  title = 'Edit',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`${base} p-2.5 bg-primary-green/10 text-primary-green border border-primary-green/20 shadow-sm hover:bg-primary-green hover:text-white hover:border-primary-green focus-visible:ring-primary-green ${className}`}
      {...props}
    >
      <Edit2 size={size} strokeWidth={2.25} />
    </button>
  );
}
