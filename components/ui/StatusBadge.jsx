const VARIANTS = {
  'Pending':     'border border-outline text-outline bg-outline/10',
  'In Progress': 'border border-primary text-primary bg-primary/10',
  'Accepted':    'border border-tertiary text-tertiary bg-tertiary/10',
  'On Revision': 'border border-secondary text-secondary bg-secondary/10',
  'Completed':   'bg-gradient-to-r from-green-500 to-emerald-400 text-white border-none',
}

export default function StatusBadge({ status }) {
  const cls = VARIANTS[status] ?? 'border border-outline text-outline bg-outline/10'
  return (
    <span className={`status-badge px-[10px] ${cls}`}>{status}</span>
  )
}
