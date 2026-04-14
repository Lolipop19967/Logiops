'use client'
import { useState } from 'react'
import { Plus, Truck } from 'lucide-react'
import { Card, Badge, Button, PageHeader, Progress, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({'In Use':'purple',Available:'green',Maintenance:'amber','Off-Road':'red'}[s]??'gray') as any

export default function Fleet() {
  const { data: vehicles, loading, add } = useCollection<any>('vehicles')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ reg:'',make:'',model:'',type:'Truck',capacity:'',service:'',rw:'',insurance:'' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, capacity:Number(form.capacity), status:'Available', km:0, driver:'—' } as any)
      setModal(false)
      setForm({ reg:'',make:'',model:'',type:'Truck',capacity:'',service:'',rw:'',insurance:'' })
    } finally { setSaving(false) }
  }

  const today = new Date()
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000)

  return (
    <div>
      <PageHeader title="Fleet" sub={loading?'Loading…':`${vehicles.length} registered vehicles`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Vehicle</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label:'In Use', value:vehicles.filter(v=>v.status==='In Use').length, color:'text-purple-400' },
          { label:'Available', value:vehicles.filter(v=>v.status==='Available').length, color:'text-emerald-400' },
          { label:'Maintenance', value:vehicles.filter(v=>v.status==='Maintenance').length, color:'text-amber-400' },
          { label:'Expiring Docs', value:vehicles.filter(v=>v.rw&&daysUntil(v.rw)<60).length, color:'text-red-400' },
        ].map(s => (
          <Card key={s.label} className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p></Card>
        ))}
      </div>
      {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {vehicles.map(v => {
            const rwDays = v.rw ? daysUntil(v.rw) : 999
            return (
              <Card key={v.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center"><Truck size={18} className="text-purple-400" /></div>
                    <div><p className="font-bold text-white">{v.reg}</p><p className="text-xs text-slate-500">{v.make} {v.model}</p></div>
                  </div>
                  <Badge variant={statusBadge(v.status)}>{v.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div><span className="text-slate-500">Capacity</span><p className="text-white font-medium">{(v.capacity||0).toLocaleString()} kg</p></div>
                  <div><span className="text-slate-500">Odometer</span><p className="text-white font-medium">{(v.km||0).toLocaleString()} km</p></div>
                  <div><span className="text-slate-500">Driver</span><p className="text-white font-medium">{v.driver||'—'}</p></div>
                  <div><span className="text-slate-500">Next Service</span><p className={`font-medium ${v.service&&daysUntil(v.service)<14?'text-amber-400':'text-white'}`}>{v.service}</p></div>
                </div>
                {v.rw && (
                  <div className="border-t border-purple-900/20 pt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Roadworthy</span>
                      <span className={rwDays<60?'text-red-400 font-semibold':'text-slate-400'}>{rwDays}d remaining</span>
                    </div>
                    <Progress value={Math.max(0,Math.min(365,365-rwDays))} max={365} color={rwDays<30?'red':rwDays<60?'amber':'green'} />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Vehicle</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Registration"><input className={inputClass} value={form.reg} onChange={e => setForm({...form,reg:e.target.value})} placeholder="GP 12 XYZ" /></FormField>
              <FormField label="Type"><select className={inputClass} value={form.type} onChange={e => setForm({...form,type:e.target.value})}>{['Truck','Rigid','Reefer','Trailer','Van'].map(t => <option key={t}>{t}</option>)}</select></FormField>
              <FormField label="Make"><input className={inputClass} value={form.make} onChange={e => setForm({...form,make:e.target.value})} placeholder="Volvo" /></FormField>
              <FormField label="Model"><input className={inputClass} value={form.model} onChange={e => setForm({...form,model:e.target.value})} placeholder="FH 460" /></FormField>
              <FormField label="Capacity (kg)"><input type="number" className={inputClass} value={form.capacity} onChange={e => setForm({...form,capacity:e.target.value})} placeholder="30000" /></FormField>
              <FormField label="Next Service"><input type="date" className={inputClass} value={form.service} onChange={e => setForm({...form,service:e.target.value})} /></FormField>
              <FormField label="Roadworthy Expiry"><input type="date" className={inputClass} value={form.rw} onChange={e => setForm({...form,rw:e.target.value})} /></FormField>
              <FormField label="Insurance Expiry"><input type="date" className={inputClass} value={form.insurance} onChange={e => setForm({...form,insurance:e.target.value})} /></FormField>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.reg||saving}>{saving?'Saving…':'Add Vehicle'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
