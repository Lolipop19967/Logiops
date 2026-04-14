'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, Target, Package, FileText,
  Receipt, Truck, CreditCard, Map, Warehouse, Handshake,
  ShieldCheck, BarChart3, LogOut, ChevronRight, Database
} from 'lucide-react'
import clsx from 'clsx'
const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { section: 'CORE' },
  { label: 'Customers', href: '/customers', icon: Building2 },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Leads & Pipeline', href: '/leads', icon: Target },
  { section: 'OPERATIONS' },
  { label: 'Shipments', href: '/shipments', icon: Package },
  { label: 'Quotes', href: '/quotes', icon: FileText },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { section: 'FLEET' },
  { label: 'Vehicles', href: '/fleet', icon: Truck },
  { label: 'Drivers', href: '/drivers', icon: CreditCard },
  { section: 'NETWORK' },
  { label: 'Routes & Lanes', href: '/routes', icon: Map },
  { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { label: 'Carriers', href: '/carriers', icon: Handshake },
  { section: 'COMPLIANCE & REPORTS' },
  { label: 'Documents', href: '/compliance', icon: ShieldCheck },
  { label: 'Analytics', href: '/reports', icon: BarChart3 },
  { section: 'SETUP' },
  { label: 'Seed Database', href: '/seed', icon: Database },
]
export function Sidebar() {
  const pathname = usePathname()
  const active = pathname === '/' ? '/dashboard' : pathname
  return (
    <aside className="w-56 flex-shrink-0 bg-[#160d2e] border-r border-purple-900/40 flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-2 flex-1">
        {nav.map((item, i) => {
          if ('section' in item) {
            return (
              <p key={i} className="text-[10px] font-semibold text-purple-400/60 uppercase tracking-widest px-2 pt-5 pb-1.5">
                {item.label}
              </p>
            )
          }
          const Icon = item.icon!
          const isActive = active === item.href || (item.href !== '/dashboard' && active.startsWith(item.href!))
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all group',
                isActive
                  ? 'bg-purple-600/20 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} className={isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={12} className="text-purple-400" />}
            </Link>
          )
        })}
      </div>
      <div className="p-4 border-t border-purple-900/40">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <span className="inline-block text-[10px] bg-purple-600/30 text-purple-300 rounded px-1.5 py-0.5 font-medium">admin</span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm px-2 py-1.5 w-full rounded transition-colors">
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
