'use client'
import { useState } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, Progress, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({Active:'green','Off Duty':'gray',Suspended:'red'}[s]??'gray') as any
const prcpBadge = (s: string) => ({Valid:'green',Expiring:'amber',Expired:'red'}[s]??'gray') as any

export default function Drivers() {
  const { data: drivers, loading, add } = useCollection<any>('drivers')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'',license:'Code 14',prcp:'Valid',medical:'',phone:'',vehicle:'' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, hours:0, maxHours:60, status:'Active', trips:0 } as any)
      setModal(false)
      setForm({ name:'',license:'Code 14',prcp:'Valid',medical:'',phone:'',vehicle:'' })
    } finally { setSaving(false) }
  }

  const today = new Date()
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000)

  return (
    <div>
      <PageHeader title="Drivers" sub={loading?'Loading…':`${drivers.length} registered drivers`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Driver</Button>} />
      {drivers.filter(d => d.hours/d.maxHours > 0.85).map(d => (
        <div key={d.id} className="flex items-center gap-3 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3 mb-3">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300"><span className="font-semibold">{d.name}</span> is approaching legal hour limit — {d.hours}h / {d.maxHours}h.</p>
        </div>
      ))}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Active Drivers', value:drivers.filter(d=>d.status==='Active').length, color:'text-emerald-400' },
          { label:'On Assignment', value:drivers.filter(d=>d.vehicle&&d.vehicle!=='Available'&&d.vehicle!=='—').length, color:'text-purple-400' },
          { label:'Fatigue Alerts', value:drivers.filter(d=>d.hours/d.maxHours>0.85).length, color:'text-red-400' },
          { label:'Expiring PrDP', value:drivers.filter(d=>d.prcp==='Expiring').length, color:'text-amber-400' },
        ].map(s => (
          <Card key={s.label} className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p></Card>
        ))}
      </div>
      <Card>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Driver','License','PrDP','Medical Expiry','Current Vehicle','Hours This Week','Trips','Status']}>
            {drivers.map(d => {
              const pct = (d.hours/d.maxHours)*100
              const medDays = d.medical ? daysUntil(d.medical) : 999
              return (
                <TR key={d.id}>
                  <TD><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-xs font-bold text-purple-400">{d.name?.split(' ').map((n:string)=>n[0]).join('')}</div><div><p className="font-medium text-white text-sm">{d.name}</p><p className="text-xs text-slate-500">{d.phone}</p></div></div></TD>
                  <TD><Badge variant="purple">{d.license}</Badge></TD>
                  <TD><Badge variant={prcpBadge(d.prcp)}>{d.prcp}</Badge></TD>
                  <TD><span className={`text-xs font-medium ${medDays<30?'text-red-400':medDays<90?'text-amber-400':'text-slate-400'}`}>{d.medical}</span></TD>
                  <TD><span className="text-xs font-mono text-slate-300">{d.vehicle||'—'}</span></TD>
                  <TD><div className="w-28"><div className="flex justify-between text-xs mb-1"><span className={pct>85?'text-red-400 font-semibold':'text-slate-400'}>{d.hours}h</span><span className="text-slate-600">{d.maxHours}h</span></div><Progress value={d.hours} max={d.maxHours} color={pct>85?'red':pct>65?'amber':'green'} /></div></TD>
                  <TD><span className="font-semibold text-white">{d.trips}</span></TD>
                  <TD><Badge variant={statusBadge(d.status)}>{d.status}</Badge></TD>
                </TR>
              )
            })}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Driver</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Full Name"><input className={inputClass} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Full name" /></FormField></div>
              <FormField label="License Class"><select className={inputClass} value={form.license} onChange={e => setForm({...form,license:e.target.value})}>{['Code 10','Code 14','Code EC'].map(l => <option key={l}>{l}</option>)}</select></FormField>
              <FormField label="PrDP Status"><select className={inputClass} value={form.prcp} onChange={e => setForm({...form,prcp:e.target.value})}>{['Valid','Expiring','Expired'].map(s => <option key={s}>{s}</option>)}</select></FormField>
              <FormField label="Medical Expiry"><input type="date" className={inputClass} value={form.medical} onChange={e => setForm({...form,medical:e.target.value})} /></FormField>
              <FormField label="Phone"><input className={inputClass} value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="083 000 0000" /></FormField>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name||saving}>{saving?'Saving…':'Save Driver'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
