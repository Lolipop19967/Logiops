'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({Accepted:'green',Rejected:'red',Sent:'blue',Draft:'gray'}[s]??'gray') as any

export default function Quotes() {
  const { data: quotes, loading, add } = useCollection<any>('quotes')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ customer:'',origin:'',dest:'',cargo:'',weight:'',amount:'',margin:'',rep:'' })

  const save = async () => {
    setSaving(true)
    const id = `QT-${Date.now()}`
    try {
      await add({ id, customerId:'', customer:form.customer, origin:form.origin, dest:form.dest, cargo:form.cargo, weight:Number(form.weight), amount:Number(form.amount), status:'Draft', created:new Date().toISOString().split('T')[0], margin:Number(form.margin), rep:form.rep } as any)
      setModal(false)
      setForm({ customer:'',origin:'',dest:'',cargo:'',weight:'',amount:'',margin:'',rep:'' })
    } finally { setSaving(false) }
  }

  const totalValue = quotes.filter(q => q.status==='Accepted').reduce((s,q) => s+(q.amount||0), 0)
  const nonDraft = quotes.filter(q => q.status!=='Draft').length
  const convRate = nonDraft ? Math.round((quotes.filter(q=>q.status==='Accepted').length/nonDraft)*100) : 0

  return (
    <div>
      <PageHeader title="Quotes" sub="Rate requests and pricing" actions={<Button onClick={() => setModal(true)}><Plus size={14} />New Quote</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Quotes</p><p className="text-2xl font-bold text-white">{quotes.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Conversion Rate</p><p className="text-2xl font-bold text-emerald-400">{convRate}%</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Won Value</p><p className="text-2xl font-bold text-purple-400">R {totalValue.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Avg Margin</p><p className="text-2xl font-bold text-blue-400">{quotes.length?Math.round(quotes.reduce((s,q)=>s+(q.margin||0),0)/quotes.length):0}%</p></Card>
      </div>
      <Card>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Quote ID','Customer','Route','Cargo','Weight (kg)','Amount','Margin','Rep','Status']}>
            {quotes.map(q => (
              <TR key={q.id}>
                <TD><span className="font-mono text-purple-400 text-xs font-semibold">{q.id}</span></TD>
                <TD><span className="font-medium text-white text-sm">{q.customer}</span></TD>
                <TD><span className="text-slate-400 text-xs">{q.origin} → {q.dest}</span></TD>
                <TD>{q.cargo}</TD>
                <TD>{(q.weight||0).toLocaleString()}</TD>
                <TD><span className="font-semibold text-white">R {(q.amount||0).toLocaleString()}</span></TD>
                <TD><span className={`font-semibold text-sm ${(q.margin||0)>20?'text-emerald-400':(q.margin||0)>15?'text-amber-400':'text-red-400'}`}>{q.margin}%</span></TD>
                <TD><span className="text-slate-400 text-sm">{q.rep}</span></TD>
                <TD><Badge variant={statusBadge(q.status)}>{q.status}</Badge></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">New Quote</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Customer"><input className={inputClass} value={form.customer} onChange={e => setForm({...form,customer:e.target.value})} placeholder="Customer name" /></FormField></div>
              <FormField label="Origin"><input className={inputClass} value={form.origin} onChange={e => setForm({...form,origin:e.target.value})} placeholder="Johannesburg" /></FormField>
              <FormField label="Destination"><input className={inputClass} value={form.dest} onChange={e => setForm({...form,dest:e.target.value})} placeholder="Cape Town" /></FormField>
              <FormField label="Cargo Type"><input className={inputClass} value={form.cargo} onChange={e => setForm({...form,cargo:e.target.value})} placeholder="FMCG" /></FormField>
              <FormField label="Weight (kg)"><input type="number" className={inputClass} value={form.weight} onChange={e => setForm({...form,weight:e.target.value})} /></FormField>
              <FormField label="Quote Amount (R)"><input type="number" className={inputClass} value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} /></FormField>
              <FormField label="Margin %"><input type="number" className={inputClass} value={form.margin} onChange={e => setForm({...form,margin:e.target.value})} /></FormField>
              <div className="col-span-2"><FormField label="Sales Rep"><input className={inputClass} value={form.rep} onChange={e => setForm({...form,rep:e.target.value})} /></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.customer||!form.amount||saving}>{saving?'Saving…':'Save Quote'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
