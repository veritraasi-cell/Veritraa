import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[#8a3a17] text-white hover:bg-[#6e2e11] shadow-[0_12px_24px_-18px_rgba(138,58,23,0.75)]',
  outline: 'border border-[#d8a36f] bg-white text-[#8a3a17] hover:bg-[#f8ebdf]',
  ghost: 'bg-transparent text-[#6f4b3f] hover:bg-[#f8ebdf]',
  destructive: 'border border-red-300 bg-red-50 text-red-900 hover:bg-red-100',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
