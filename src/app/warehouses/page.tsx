'use client'
import { useState } from 'react'
import { Plus, Warehouse as WIcon } from 'lucide-react'
import { Card, Badge, Button, PageHeader, Progress, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

export default function Warehouses() {
  const { data: warehouses, loading, add } = useCollection<any>('warehouses')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'',city:'',capacity:'',type:'General',cold:false,hazmat:false,manager:'' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, capacity:Number(form.capacity), used:0 } as any)
      setModal(false)
      setForm({ name:'',city:'',capacity:'',type:'General',cold:false,hazmat:false,manager:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Warehouses & Depots" sub={loading?'Loading…':`${warehouses.length} storage nodes`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Warehouse</Button>} />
      {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {warehouses.map(w => {
            const pct = w.capacity ? Math.round((w.used/w.capacity)*100) : 0
            return (
              <Card key={w.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center"><WIcon size={18} className="text-purple-400" /></div>
                    <div><p className="font-bold text-white">{w.name}</p><p className="text-xs text-slate-500">{w.city}</p></div>
                  </div>
                  <Badge variant={pct>90?'red':pct>70?'amber':'green'}>{pct}% full</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div><span className="text-slate-500">Capacity</span><p className="text-white font-medium">{(w.capacity||0).toLocaleString()} m²</p></div>
                  <div><span className="text-slate-500">In Use</span><p className="text-white font-medium">{(w.used||0).toLocaleString()} m²</p></div>
                  <div><span className="text-slate-500">Type</span><p className="text-white font-medium">{w.type}</p></div>
                  <div><span className="text-slate-500">Manager</span><p className="text-white font-medium">{w.manager}</p></div>
                </div>
                <div className="mb-3"><Progress value={w.used||0} max={w.capacity||100} color={pct>90?'red':pct>70?'amber':'purple'} /></div>
                <div className="flex gap-2 flex-wrap">
                  {w.cold && <Badge variant="blue">Cold Storage</Badge>}
                  {w.hazmat && <Badge variant="amber">Hazmat Certified</Badge>}
                  {!w.cold && !w.hazmat && <Badge variant="gray">General Storage</Badge>}
                </div>
              </Card>
            )
          })}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Warehouse</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Name"><input className={inputClass} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="JHB North Hub" /></FormField></div>
              <FormField label="City"><input className={inputClass} value={form.city} onChange={e => setForm({...form,city:e.target.value})} placeholder="Johannesburg" /></FormField>
              <FormField label="Type"><select className={inputClass} value={form.type} onChange={e => setForm({...form,type:e.target.value})}>{['General','Port Adjacent','Rail Hub','Cold Chain'].map(t => <option key={t}>{t}</option>)}</select></FormField>
              <FormField label="Capacity (m²)"><input type="number" className={inputClass} value={form.capacity} onChange={e => setForm({...form,capacity:e.target.value})} /></FormField>
              <FormField label="Manager"><input className={inputClass} value={form.manager} onChange={e => setForm({...form,manager:e.target.value})} /></FormField>
              <div className="col-span-2 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={form.cold} onChange={e => setForm({...form,cold:e.target.checked})} className="accent-purple-500" />Cold Storage</label>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer"><input type="checkbox" checked={form.hazmat} onChange={e => setForm({...form,hazmat:e.target.checked})} className="accent-purple-500" />Hazmat Certified</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name||saving}>{saving?'Saving…':'Save Warehouse'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
