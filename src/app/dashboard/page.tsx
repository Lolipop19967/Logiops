'use client'
import { Package, Truck, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import { Card, StatCard, Badge, PageHeader, Table, TR, TD, Button, Progress } from '@/components/ui'
import { useCollection, useChartConfig } from '@/lib/hooks'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { data: shipments, loading: sl } = useCollection<any>('shipments')
  const { data: customers } = useCollection<any>('customers')
  const { data: invoices } = useCollection<any>('invoices')
  const { data: drivers } = useCollection<any>('drivers')
  const { charts } = useChartConfig()
  const router = useRouter()

  const activeShipments = shipments.filter(s => s.status === 'In Transit' || s.status === 'Customs Hold').length
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length
  const fatigueAlert = drivers.filter(d => d.hours / d.maxHours > 0.85).length
  const revenueChart = charts?.revenueChart || []
  const otifChart = charts?.otifChart || []

  return (
    <div>
      <PageHeader title="Dashboard" sub="Operations overview"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => router.push('/shipments')}><Plus size={13} />New Shipment</Button>
            <Button size="sm" onClick={() => router.push('/seed')}>Seed Data</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Shipments" value={activeShipments} sub={`${shipments.length} total`} icon={<Package size={18} />} />
        <StatCard label="Monthly Revenue" value="R 241k" sub="Jan 2025" icon={<TrendingUp size={18} />} />
        <StatCard label="Overdue Invoices" value={overdueInvoices} sub="Require action" icon={<AlertTriangle size={18} />} />
        <StatCard label="Fleet Active" value={`${shipments.filter(s=>s.vehicle && s.vehicle !== '—').length}`} sub="Vehicles assigned" icon={<Truck size={18} />} />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Customers', value: customers.length, sub: `${customers.filter(c=>c.status==='On Hold').length} on hold`, color: 'text-purple-400' },
          { label: 'Open Quotes', value: 0, sub: 'Live from DB', color: 'text-blue-400' },
          { label: 'OTIF Rate', value: '93%', sub: 'Jan 2025', color: 'text-emerald-400' },
          { label: 'Invoices', value: invoices.length, sub: `${overdueInvoices} overdue`, color: 'text-amber-400' },
          { label: 'Drivers', value: drivers.filter(d => d.status === 'Active').length, sub: '1 off duty', color: 'text-blue-400' },
          { label: 'Fatigue Alert', value: fatigueAlert, sub: 'drivers >85%', color: 'text-red-400' },
        ].map(k => (
          <Card key={k.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-1">{k.label}</p>
            <p className="text-xs text-slate-600">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-2 p-5">
          <p className="text-sm font-semibold text-white mb-4">Revenue vs Cost — 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1a0f35', border: '1px solid #4c1d95', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} formatter={(v: number) => [`R ${v.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#rev)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="cost" stroke="#6366f1" fill="url(#cost)" strokeWidth={2} name="Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-4">OTIF Rate %</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={otifChart} barSize={24}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#1a0f35', border: '1px solid #4c1d95', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'OTIF']} />
              <Bar dataKey="otif" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-4 border-b border-purple-900/30 flex items-center justify-between">
            <p className="font-semibold text-white text-sm">Active Shipments</p>
            <a href="/shipments" className="text-xs text-purple-400 hover:text-purple-300">View all →</a>
          </div>
          {sl ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> : (
            <Table headers={['Ref', 'Customer', 'Route', 'Status']}>
              {shipments.filter(s => ['In Transit','Customs Hold','Booked'].includes(s.status)).slice(0, 6).map(s => (
                <TR key={s.id}>
                  <TD><span className="font-mono text-purple-400 text-xs">{s.id}</span></TD>
                  <TD>{s.customer}</TD>
                  <TD><span className="text-slate-500 text-xs">{s.origin} → {s.dest}</span></TD>
                  <TD><Badge variant={s.status==='In Transit'?'purple':s.status==='Customs Hold'?'red':'blue'} >{s.status}</Badge></TD>
                </TR>
              ))}
            </Table>
          )}
        </Card>
        <Card>
          <div className="p-4 border-b border-purple-900/30 flex items-center justify-between">
            <p className="font-semibold text-white text-sm">Driver Hours (Fatigue Monitor)</p>
            <a href="/drivers" className="text-xs text-purple-400 hover:text-purple-300">View all →</a>
          </div>
          <div className="p-4 space-y-4">
            {drivers.map(d => {
              const pct = (d.hours / d.maxHours) * 100
              const color = pct > 85 ? 'red' : pct > 65 ? 'amber' : 'green'
              return (
                <div key={d.id}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{d.name}</span>
                    <span className={`font-semibold ${color==='red'?'text-red-400':color==='amber'?'text-amber-400':'text-emerald-400'}`}>{d.hours}h / {d.maxHours}h</span>
                  </div>
                  <Progress value={d.hours} max={d.maxHours} color={color} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
