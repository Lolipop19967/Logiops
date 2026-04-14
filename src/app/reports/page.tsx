'use client'
import { Card, PageHeader } from '@/components/ui'
import { useCollection, useChartConfig } from '@/lib/hooks'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const delayReasons = [
  { reason:'Traffic / Road', count:18 }, { reason:'Customs Delay', count:12 },
  { reason:'Vehicle Breakdown', count:7 }, { reason:'Customer Not Ready', count:5 }, { reason:'Weather', count:3 },
]

export default function Reports() {
  const { data: customers } = useCollection<any>('customers')
  const { data: drivers } = useCollection<any>('drivers')
  const { charts } = useChartConfig()

  const revenueChart = charts?.revenueChart || []
  const otifChart = charts?.otifChart || []
  const totalRevenue = revenueChart.reduce((s:number,r:any)=>s+r.revenue,0)
  const totalCost = revenueChart.reduce((s:number,r:any)=>s+r.cost,0)
  const avgOtif = otifChart.length ? Math.round(otifChart.reduce((s:number,r:any)=>s+r.otif,0)/otifChart.length) : 0
  const customerRevenue = customers.map(c => ({ name:(c.name||'').split(' ')[0], revenue:c.revenue||0, shipments:c.shipments||0 }))

  return (
    <div>
      <PageHeader title="Analytics & Reports" sub="Performance overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label:'6-Month Revenue', value:`R ${(totalRevenue/1000).toFixed(0)}k`, color:'text-purple-400' },
          { label:'6-Month Gross Profit', value:`R ${((totalRevenue-totalCost)/1000).toFixed(0)}k`, color:'text-emerald-400' },
          { label:'Avg Margin', value:totalRevenue?`${Math.round(((totalRevenue-totalCost)/totalRevenue)*100)}%`:'—', color:'text-blue-400' },
          { label:'Avg OTIF Rate', value:`${avgOtif}%`, color:'text-amber-400' },
        ].map(k => (
          <Card key={k.label} className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{k.label}</p><p className={`text-2xl font-bold ${k.color}`}>{k.value}</p></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="col-span-2 p-5">
          <p className="text-sm font-semibold text-white mb-4">Revenue vs Cost (6 months)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`R${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background:'#1a0f35',border:'1px solid #4c1d95',borderRadius:8,fontSize:12 }} formatter={(v:number)=>[`R ${v.toLocaleString()}`,''] as any} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#gr)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="cost" stroke="#6366f1" fill="url(#gc)" strokeWidth={2} name="Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-4">Top Delay Reasons</p>
          <div className="space-y-3">
            {delayReasons.map(d => (
              <div key={d.reason}>
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{d.reason}</span><span className="text-white font-semibold">{d.count}</span></div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full bg-purple-500" style={{ width:`${(d.count/delayReasons[0].count)*100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-4">OTIF Rate Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={otifChart}>
              <XAxis dataKey="month" tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[75,100]} tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
              <Tooltip contentStyle={{ background:'#1a0f35',border:'1px solid #4c1d95',borderRadius:8,fontSize:12 }} formatter={(v:number)=>[`${v}%`,'OTIF'] as any} />
              <Line type="monotone" dataKey="otif" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill:'#7c3aed',r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-white mb-4">Revenue by Customer (from Firestore)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={customerRevenue.slice(0,8)} barSize={28}>
              <XAxis dataKey="name" tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`R${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background:'#1a0f35',border:'1px solid #4c1d95',borderRadius:8,fontSize:12 }} formatter={(v:number)=>[`R ${v.toLocaleString()}`,'Revenue'] as any} />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <p className="text-sm font-semibold text-white mb-4">Driver Performance Scorecards (live from Firestore)</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {drivers.map(d => {
            const score = Math.round(90-(d.hours/d.maxHours)*15+(d.trips/100)*10)
            return (
              <div key={d.id} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-xs font-bold text-purple-300 mx-auto mb-2">{d.name?.split(' ').map((n:string)=>n[0]).join('')}</div>
                <p className="text-xs font-semibold text-white truncate">{d.name?.split(' ')[0]}</p>
                <p className={`text-xl font-bold mt-1 ${score>=85?'text-emerald-400':score>=70?'text-amber-400':'text-red-400'}`}>{score}</p>
                <p className="text-xs text-slate-600">/ 100</p>
                <p className="text-xs text-slate-500 mt-1">{d.trips} trips</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
