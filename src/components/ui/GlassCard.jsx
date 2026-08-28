const BASE =
  'relative rounded-3xl border border-white/75 bg-grad-card shadow-soft backdrop-blur-[24px]';

const INTERACTIVE =
  'transition duration-300 ease-spring hover:-translate-y-0.5 hover:border-white/95 hover:shadow-lift';

export default function GlassCard({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag className={`${BASE} ${interactive ? INTERACTIVE : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
