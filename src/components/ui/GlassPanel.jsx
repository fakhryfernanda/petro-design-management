export default function GlassPanel({ children, className = '', level = 1 }) {
  const base = level === 2 ? 'glass-panel-high' : 'glass-panel'
  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  )
}
