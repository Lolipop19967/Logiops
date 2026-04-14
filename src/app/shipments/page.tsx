'use client'
import { useState } from 'react'
import { Plus, Search, Package } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, Tabs, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({'In Transit':'purple','Delivered':'green','Booked':'blue','Customs Hold':'red','Invoiced':'gray'}[s]??'gray') as any
const stages = ['All','Booked','In Transit','Customs Hold','Delivered']

export default function Shipments() {
  const { data: shipments, loading, add } = useCollection<any>('shipments')
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ customer:'',origin:'',dest:'',cargo:'',weight:'',driver:'',vehicle:'',eta:'' })

  const filtered = shipments.filter(s => {
    const matchTab = tab === 'All' || s.status === tab
    const q = search.toLowerCase()
    return matchTab && (!q || s.id?.toLowerCase().includes(q) || s.customer?.toLowerCase().includes(q) || s.origin?.toLowerCase().includes(q) || s.dest?.toLowerCase().includes(q))
  })

  const save = async () => {
    setSaving(true)
    const id = `SH-${Date.now()}`
    try {
      await add({ id, customerId:'', customer:form.customer, origin:form.origin, dest:form.dest, status:'Booked', driver:form.driver||'—', vehicle:form.vehicle||'—', weight:Number(form.weight), cargo:form.cargo, eta:form.eta, created:new Date().toISOString().split('T')[0], legs:1, value:0, pod:false })
      setModal(false)
      setForm({ customer:'',origin:'',dest:'',cargo:'',weight:'',driver:'',vehicle:'',eta:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Shipments" sub={loading?'Loading…':`${shipments.length} total shipments`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />New Shipment</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stages.slice(1).map(s => (
          <Card key={s} className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{shipments.filter(sh => sh.status===s).length}</p>
            <p className="text-xs text-slate-500 mt-1">{s}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="p-4 border-b border-purple-900/30 flex flex-col md:flex-row md:items-center gap-3">
          <Tabs tabs={stages} active={tab} onChange={setTab} />
          <div className="relative ml-auto w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className={`${inputClass} pl-9 py-1.5`} />
          </div>
        </div>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Shipment ID','Customer','Origin → Dest','Cargo','Weight (kg)','ETA','Driver','Status']}>
            {filtered.map(s => (
              <TR key={s.id}>
                <TD><span className="font-mono text-purple-400 text-xs font-semibold">{s.id}</span></TD>
                <TD><span className="font-medium text-sm">{s.customer}</span></TD>
                <TD><span className="text-slate-400 text-xs">{s.origin} → {s.dest}</span></TD>
                <TD>{s.cargo}</TD>
                <TD>{(s.weight||0).toLocaleString()}</TD>
                <TD><span className="text-xs text-slate-400">{s.eta}</span></TD>
                <TD>{s.driver}</TD>
                <TD><Badge variant={statusBadge(s.status)}>{s.status}</Badge></TD>
              </TR>
            ))}
          </Table>
        )}
        {!loading && filtered.length === 0 && <div className="text-center py-12 text-slate-600"><Package size={32} className="mx-auto mb-3" /><p>No shipments found</p></div>}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-5">New Shipment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Customer"><input className={inputClass} value={form.customer} onChange={e => setForm({...form,customer:e.target.value})} placeholder="Customer name" /></FormField></div>
              <FormField label="Origin"><input className={inputClass} value={form.origin} onChange={e => setForm({...form,origin:e.target.value})} placeholder="Johannesburg" /></FormField>
              <FormField label="Destination"><input className={inputClass} value={form.dest} onChange={e => setForm({...form,dest:e.target.value})} placeholder="Cape Town" /></FormField>
              <FormField label="Cargo Type"><input className={inputClass} value={form.cargo} onChange={e => setForm({...form,cargo:e.target.value})} placeholder="FMCG" /></FormField>
              <FormField label="Weight (kg)"><input type="number" className={inputClass} value={form.weight} onChange={e => setForm({...form,weight:e.target.value})} /></FormField>
              <FormField label="Driver (optional)"><input className={inputClass} value={form.driver} onChange={e => setForm({...form,driver:e.target.value})} placeholder="Driver name" /></FormField>
              <FormField label="Vehicle (optional)"><input className={inputClass} value={form.vehicle} onChange={e => setForm({...form,vehicle:e.target.value})} placeholder="Reg number" /></FormField>
              <div className="col-span-2"><FormField label="ETA"><input type="date" className={inputClass} value={form.eta} onChange={e => setForm({...form,eta:e.target.value})} /></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.customer||!form.origin||!form.dest||saving}>{saving?'Saving…':'Create Shipment'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
