export default function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={`flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden ${className}`}>
      <div className="h-full primary-gradient rounded-full" style={{ width: `${value}%` }} />
    </div>
  )
}
