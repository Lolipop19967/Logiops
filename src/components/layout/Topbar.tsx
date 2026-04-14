'use client'
import { Bell, Search } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-14 bg-[#160d2e] border-b border-purple-900/40 flex items-center px-5 gap-4 flex-shrink-0 z-10">
      <div className="flex items-center gap-2.5 w-52 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-content-center items-center justify-center">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">LogiCRM</p>
          <p className="text-purple-400 text-[10px] leading-tight">Logistics Management</p>
        </div>
      </div>
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search shipments, customers…"
            className="w-full bg-white/5 border border-purple-900/40 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all"
          />
        </div>
      </div>
      <div className="flex-1" />
      <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-purple-900/30 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white">D</div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-white leading-tight">David Snyman</p>
          <p className="text-xs text-slate-500 leading-tight">Administrator</p>
        </div>
      </div>
    </header>
  )
}
