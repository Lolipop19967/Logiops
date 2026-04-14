'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, Progress, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

export default function Carriers() {
  const { data: carriers, loading, add } = useCollection<any>('carriers')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'',type:'Road',contact:'',phone:'' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, rating:0, shipments:0, onTime:0, status:'Active' } as any)
      setModal(false)
      setForm({ name:'',type:'Road',contact:'',phone:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Carriers & Subcontractors" sub={loading?'Loading…':`${carriers.length} partners`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Carrier</Button>} />
      <Card>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Carrier','Type','Contact','Shipments','On-Time %','Rating','Status']}>
            {carriers.map(c => (
              <TR key={c.id}>
                <TD><span className="font-semibold text-white">{c.name}</span></TD>
                <TD><Badge variant={c.type==='Sea'?'blue':c.type==='Cross-Border'||c.type==='Air'?'purple':'gray'}>{c.type}</Badge></TD>
                <TD><div><p className="text-sm text-white">{c.contact}</p><p className="text-xs text-slate-500">{c.phone}</p></div></TD>
                <TD><span className="font-semibold text-white">{c.shipments||0}</span></TD>
                <TD><div className="w-24"><div className="flex justify-between text-xs mb-1"><span className={(c.onTime||0)>=90?'text-emerald-400':(c.onTime||0)>=80?'text-amber-400':'text-red-400'}>{c.onTime||0}%</span></div><Progress value={c.onTime||0} max={100} color={(c.onTime||0)>=90?'green':(c.onTime||0)>=80?'amber':'red'} /></div></TD>
                <TD><div className="flex items-center gap-1"><span className="text-amber-400 font-bold">{c.rating||0}</span><span className="text-amber-400 text-xs">★</span><span className="text-slate-600 text-xs">/ 5</span></div></TD>
                <TD><Badge variant="green">{c.status}</Badge></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Carrier</h2>
            <div className="space-y-4">
              <FormField label="Carrier Name"><input className={inputClass} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Company name" /></FormField>
              <FormField label="Type"><select className={inputClass} value={form.type} onChange={e => setForm({...form,type:e.target.value})}>{['Road','Sea','Air','Rail','Cross-Border'].map(t => <option key={t}>{t}</option>)}</select></FormField>
              <FormField label="Contact Person"><input className={inputClass} value={form.contact} onChange={e => setForm({...form,contact:e.target.value})} /></FormField>
              <FormField label="Phone"><input className={inputClass} value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></FormField>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name||saving}>{saving?'Saving…':'Save Carrier'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
