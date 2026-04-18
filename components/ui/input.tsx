import type { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        'flex h-11 w-full rounded-2xl border border-[#d7c4af] bg-[#fffdf9] px-4 py-3 text-sm text-[#3d2219] outline-none transition placeholder:text-[#b58e79] focus:border-[#b56a3c] focus:ring-2 focus:ring-[#efc49b]/55 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
