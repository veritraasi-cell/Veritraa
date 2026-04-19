import type { LabelHTMLAttributes } from 'react';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={['text-sm font-semibold text-[#7d5a4d]', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
