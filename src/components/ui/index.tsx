import clsx from 'clsx'
import { ReactNode } from 'react'

/* ── Card ─────────────────────────────────────────────── */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-[#1a0f35] border border-purple-900/40 rounded-xl', className)}>
      {children}
    </div>
  )
}

/* ── Stat Card ────────────────────────────────────────── */
export function StatCard({
  label, value, sub, icon, color = 'purple', trend,
}: {
  label: string; value: string | number; sub?: string; icon?: ReactNode; color?: string; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

/* ── Badge ────────────────────────────────────────────── */
type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'gray'
const badgeStyles: Record<BadgeVariant, string> = {
  green:  'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30',
  red:    'bg-red-900/30 text-red-400 border border-red-800/30',
  amber:  'bg-amber-900/30 text-amber-400 border border-amber-800/30',
  blue:   'bg-blue-900/30 text-blue-400 border border-blue-800/30',
  purple: 'bg-purple-900/40 text-purple-300 border border-purple-700/30',
  gray:   'bg-white/5 text-slate-400 border border-white/10',
}
export function Badge({ children, variant = 'gray' }: { children: ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', badgeStyles[variant])}>
      {children}
    </span>
  )
}

/* ── Button ───────────────────────────────────────────── */
export function Button({
  children, onClick, variant = 'primary', size = 'md', className, type = 'button', disabled,
}: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md'; className?: string; type?: 'button' | 'submit'; disabled?: boolean;
}) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
  const variants = {
    primary:   'bg-purple-600 hover:bg-purple-500 text-white',
    secondary: 'bg-white/5 hover:bg-white/10 text-slate-300 border border-purple-900/40',
    danger:    'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/30',
    ghost:     'text-slate-400 hover:text-white hover:bg-white/5',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={clsx(base, sizes[size], variants[variant], className)}>
      {children}
    </button>
  )
}

/* ── Table ────────────────────────────────────────────── */
export function Table({ headers, children, empty }: {
  headers: string[]; children: ReactNode; empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-900/40">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick}
      className={clsx('border-b border-purple-900/20 transition-colors', onClick && 'cursor-pointer hover:bg-purple-900/10')}>
      {children}
    </tr>
  )
}

export function TD({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={clsx('px-4 py-3 text-slate-300', className)}>{children}</td>
  )
}

/* ── Page Header ──────────────────────────────────────── */
export function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

/* ── Empty State ──────────────────────────────────────── */
export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-slate-600 mb-3">{icon}</div>
      <p className="text-slate-400 font-medium">{title}</p>
      {description && <p className="text-slate-600 text-sm mt-1">{description}</p>}
    </div>
  )
}

/* ── Form helpers ─────────────────────────────────────── */
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export const inputClass = 'w-full bg-white/5 border border-purple-900/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all'

/* ── Progress ─────────────────────────────────────────── */
export function Progress({ value, max = 100, color = 'purple' }: { value: number; max?: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className={clsx('h-full rounded-full transition-all', color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : color === 'green' ? 'bg-emerald-500' : 'bg-purple-500')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ── Tabs ─────────────────────────────────────────────── */
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-5">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={clsx('flex-1 py-2 text-sm font-medium rounded-lg transition-all',
            active === t ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300')}>
          {t}
        </button>
      ))}
    </div>
  )
}
