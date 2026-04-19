type SectionHeadingAlign = 'left' | 'center';

interface SectionHeadingProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: SectionHeadingAlign;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: Readonly<SectionHeadingProps>) {
  const alignmentClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 ${alignmentClass}`}>
      {eyebrow ? (
        <span className="font-label text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-headline text-4xl text-on-background md:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
