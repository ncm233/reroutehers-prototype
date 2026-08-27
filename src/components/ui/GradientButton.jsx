const SIZES = {
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

/**
 * Native <button> so keyboard activation and the focus ring come for free.
 */
export default function GradientButton({
  size = 'lg',
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white',
        'bg-grad-btn shadow-card transition duration-300 ease-spring',
        'hover:bg-grad-btn-hover hover:-translate-y-0.5 hover:shadow-card-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        'disabled:pointer-events-none disabled:opacity-45',
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
