import type { HTMLAttributes } from 'react';

function baseClassName(extraClassName?: string) {
  return [
    'rounded-[1.5rem] border border-[#e6cdb3] bg-white/90 text-[#4b1f0f] shadow-[0_14px_30px_-28px_rgba(63,28,16,0.25)]',
    extraClassName,
  ]
    .filter(Boolean)
    .join(' ');
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={baseClassName(className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['flex flex-col gap-1.5 p-6', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={['font-headline text-2xl leading-none tracking-tight', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={['text-sm leading-6 text-[#7f5a4a]', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['px-6 pb-6', className].filter(Boolean).join(' ')} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['flex items-center p-6 pt-0', className].filter(Boolean).join(' ')} {...props} />;
}
