export default function Button({ children, variant = 'primary', className = '', onClick, type = 'button', disabled }) {
  const variants = {
    primary:   'primary-gradient text-white shadow-lg active:opacity-80',
    secondary: 'glass-button border-white/20 text-on-surface hover:bg-white/5',
    ghost:     'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-xs px-md py-sm rounded-xl font-label-md text-label-md transition-all ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}
