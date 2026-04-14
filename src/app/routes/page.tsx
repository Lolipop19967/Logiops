'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

export default function Routes() {
  const { data: routes, loading, add } = useCollection<any>('routes')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ origin:'',dest:'',distance:'',transitDays:'1',baseRate:'',cargoType:'General',sla:'24h' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, distance:Number(form.distance), transitDays:Number(form.transitDays), baseRate:Number(form.baseRate), volume:0 } as any)
      setModal(false)
      setForm({ origin:'',dest:'',distance:'',transitDays:'1',baseRate:'',cargoType:'General',sla:'24h' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Routes & Lanes" sub={loading?'Loading…':`${routes.length} configured lanes`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Route</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Lanes</p><p className="text-2xl font-bold text-white">{routes.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cross-Border</p><p className="text-2xl font-bold text-purple-400">{routes.filter(r=>r.cargoType==='Cross-Border').length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Avg Base Rate</p><p className="text-2xl font-bold text-emerald-400">R {routes.length?((routes.reduce((s,r)=>s+(r.baseRate||0),0)/routes.length)).toFixed(2):0}/km</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monthly Volume</p><p className="text-2xl font-bold text-blue-400">{routes.reduce((s,r)=>s+(r.volume||0),0)}</p></Card>
      </div>
      <Card>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Origin','Destination','Distance','Transit','Base Rate','Cargo Type','SLA','Volume']}>
            {routes.map(r => (
              <TR key={r.id}>
                <TD><span className="font-medium text-white">{r.origin}</span></TD>
                <TD><span className="font-medium text-white">{r.dest}</span></TD>
                <TD><span className="text-slate-400">{(r.distance||0).toLocaleString()} km</span></TD>
                <TD><span className="text-slate-400">{r.transitDays}d</span></TD>
                <TD><span className="text-emerald-400 font-semibold">R {(r.baseRate||0).toFixed(2)}/km</span></TD>
                <TD><Badge variant={r.cargoType==='Cross-Border'?'purple':r.cargoType==='Bulk'?'amber':'blue'}>{r.cargoType}</Badge></TD>
                <TD><Badge variant="gray">{r.sla}</Badge></TD>
                <TD><span className="font-semibold text-white">{r.volume||0}</span></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Route</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Origin"><input className={inputClass} value={form.origin} onChange={e => setForm({...form,origin:e.target.value})} placeholder="Johannesburg" /></FormField>
              <FormField label="Destination"><input className={inputClass} value={form.dest} onChange={e => setForm({...form,dest:e.target.value})} placeholder="Cape Town" /></FormField>
              <FormField label="Distance (km)"><input type="number" className={inputClass} value={form.distance} onChange={e => setForm({...form,distance:e.target.value})} /></FormField>
              <FormField label="Transit Days"><input type="number" className={inputClass} value={form.transitDays} onChange={e => setForm({...form,transitDays:e.target.value})} /></FormField>
              <FormField label="Base Rate (R/km)"><input type="number" step="0.01" className={inputClass} value={form.baseRate} onChange={e => setForm({...form,baseRate:e.target.value})} /></FormField>
              <FormField label="SLA"><select className={inputClass} value={form.sla} onChange={e => setForm({...form,sla:e.target.value})}>{['24h','48h','72h'].map(s => <option key={s}>{s}</option>)}</select></FormField>
              <div className="col-span-2"><FormField label="Cargo Type"><select className={inputClass} value={form.cargoType} onChange={e => setForm({...form,cargoType:e.target.value})}>{['General','Bulk','Cross-Border','Hazmat','Refrigerated'].map(t => <option key={t}>{t}</option>)}</select></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.origin||!form.dest||saving}>{saving?'Saving…':'Save Route'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
