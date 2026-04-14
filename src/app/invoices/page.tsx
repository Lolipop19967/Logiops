'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, Tabs, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({Paid:'green',Overdue:'red',Sent:'blue',Draft:'gray'}[s]??'gray') as any

export default function Invoices() {
  const { data: invoices, loading, add } = useCollection<any>('invoices')
  const [tab, setTab] = useState('All')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ customer:'',shipment:'',amount:'',due:'' })

  const tabs = ['All','Draft','Sent','Overdue','Paid']
  const filtered = tab === 'All' ? invoices : invoices.filter(i => i.status===tab)
  const totalOutstanding = invoices.filter(i=>i.status!=='Paid').reduce((s,i)=>s+((i.amount||0)-(i.paid||0)),0)
  const totalOverdue = invoices.filter(i=>i.status==='Overdue').reduce((s,i)=>s+((i.amount||0)-(i.paid||0)),0)

  const save = async () => {
    setSaving(true)
    const id = `INV-${Date.now()}`
    try {
      await add({ id, customerId:'', customer:form.customer, shipment:form.shipment, amount:Number(form.amount), status:'Draft', issued:new Date().toISOString().split('T')[0], due:form.due, paid:0 } as any)
      setModal(false)
      setForm({ customer:'',shipment:'',amount:'',due:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Invoices" sub="Billing and receivables" actions={<Button onClick={() => setModal(true)}><Plus size={14} />New Invoice</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p><p className="text-2xl font-bold text-red-400">R {totalOutstanding.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Overdue</p><p className="text-2xl font-bold text-amber-400">R {totalOverdue.toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Collected</p><p className="text-2xl font-bold text-emerald-400">R {invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+(i.amount||0),0).toLocaleString()}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Draft Invoices</p><p className="text-2xl font-bold text-white">{invoices.filter(i=>i.status==='Draft').length}</p></Card>
      </div>
      <Card>
        <div className="p-4 border-b border-purple-900/30"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Invoice','Customer','Shipment','Amount','Paid','Balance','Due Date','Status']}>
            {filtered.map(inv => (
              <TR key={inv.id}>
                <TD><span className="font-mono text-purple-400 text-xs font-semibold">{inv.id}</span></TD>
                <TD><span className="font-medium text-sm">{inv.customer}</span></TD>
                <TD><span className="text-slate-500 text-xs">{inv.shipment}</span></TD>
                <TD><span className="font-semibold">R {(inv.amount||0).toLocaleString()}</span></TD>
                <TD><span className="text-emerald-400">R {(inv.paid||0).toLocaleString()}</span></TD>
                <TD>{(inv.amount||0)-(inv.paid||0)>0 ? <span className="text-red-400 font-semibold">R {((inv.amount||0)-(inv.paid||0)).toLocaleString()}</span> : <span className="text-emerald-400">—</span>}</TD>
                <TD><span className="text-xs text-slate-400">{inv.due}</span></TD>
                <TD><Badge variant={statusBadge(inv.status)}>{inv.status}</Badge></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-5">New Invoice</h2>
            <div className="space-y-4">
              <FormField label="Customer"><input className={inputClass} value={form.customer} onChange={e => setForm({...form,customer:e.target.value})} placeholder="Customer name" /></FormField>
              <FormField label="Shipment Ref"><input className={inputClass} value={form.shipment} onChange={e => setForm({...form,shipment:e.target.value})} placeholder="SH-XXXX" /></FormField>
              <FormField label="Amount (R)"><input type="number" className={inputClass} value={form.amount} onChange={e => setForm({...form,amount:e.target.value})} /></FormField>
              <FormField label="Due Date"><input type="date" className={inputClass} value={form.due} onChange={e => setForm({...form,due:e.target.value})} /></FormField>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.customer||!form.amount||saving}>{saving?'Saving…':'Create Invoice'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
