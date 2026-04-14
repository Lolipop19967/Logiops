'use client'
import { useState } from 'react'
import { Plus, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, Tabs, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const statusBadge = (s: string) => ({Valid:'green',Expiring:'amber',Expired:'red'}[s]??'gray') as any
const StatusIcon = ({ s }: { s: string }) =>
  s==='Valid' ? <CheckCircle2 size={14} className="text-emerald-400" /> :
  s==='Expiring' ? <AlertTriangle size={14} className="text-amber-400" /> :
  <XCircle size={14} className="text-red-400" />

export default function Compliance() {
  const { data: docs, loading, add } = useCollection<any>('compliance')
  const [tab, setTab] = useState('All')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ category:'Driver',entity:'',doc:'',expiry:'' })

  const categories = ['All','Driver','Vehicle','Customer','Company']
  const filtered = tab==='All' ? docs : docs.filter(d => d.category===tab)
  const today = new Date()
  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime()-today.getTime())/86400000)

  const save = async () => {
    setSaving(true)
    const days = daysUntil(form.expiry)
    const status = days < 0 ? 'Expired' : days < 60 ? 'Expiring' : 'Valid'
    try {
      await add({ ...form, status } as any)
      setModal(false)
      setForm({ category:'Driver',entity:'',doc:'',expiry:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Compliance & Documents" sub="Expiry tracking and document vault" actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Document</Button>} />
      {docs.filter(d=>d.status==='Expired').length > 0 && (
        <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3 mb-4">
          <XCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300"><span className="font-semibold">{docs.filter(d=>d.status==='Expired').length} document(s) have expired</span> and require immediate attention.</p>
        </div>
      )}
      {docs.filter(d=>d.status==='Expiring').length > 0 && (
        <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-800/30 rounded-xl px-4 py-3 mb-4">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300"><span className="font-semibold">{docs.filter(d=>d.status==='Expiring').length} document(s) expiring soon</span> — renew within 60 days.</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4"><CheckCircle2 size={28} className="text-emerald-400 flex-shrink-0" /><div><p className="text-2xl font-bold text-white">{docs.filter(d=>d.status==='Valid').length}</p><p className="text-xs text-slate-500">Valid</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><AlertTriangle size={28} className="text-amber-400 flex-shrink-0" /><div><p className="text-2xl font-bold text-white">{docs.filter(d=>d.status==='Expiring').length}</p><p className="text-xs text-slate-500">Expiring Soon</p></div></Card>
        <Card className="p-4 flex items-center gap-4"><XCircle size={28} className="text-red-400 flex-shrink-0" /><div><p className="text-2xl font-bold text-white">{docs.filter(d=>d.status==='Expired').length}</p><p className="text-xs text-slate-500">Expired</p></div></Card>
      </div>
      <Card>
        <div className="p-4 border-b border-purple-900/30"><Tabs tabs={categories} active={tab} onChange={setTab} /></div>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['','Category','Entity','Document','Expiry Date','Days Left','Status']}>
            {filtered.map(d => {
              const days = d.expiry ? daysUntil(d.expiry) : 999
              return (
                <TR key={d.id}>
                  <TD><StatusIcon s={d.status} /></TD>
                  <TD><Badge variant={d.category==='Driver'?'purple':d.category==='Vehicle'?'blue':'gray'}>{d.category}</Badge></TD>
                  <TD><span className="font-medium text-white text-sm">{d.entity}</span></TD>
                  <TD>{d.doc}</TD>
                  <TD><span className="text-xs text-slate-400">{d.expiry}</span></TD>
                  <TD><span className={`font-semibold text-sm ${days<0?'text-red-400':days<30?'text-red-400':days<60?'text-amber-400':'text-emerald-400'}`}>{days<0?`${Math.abs(days)}d ago`:`${days}d`}</span></TD>
                  <TD><Badge variant={statusBadge(d.status)}>{d.status}</Badge></TD>
                </TR>
              )
            })}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Document</h2>
            <div className="space-y-4">
              <FormField label="Category"><select className={inputClass} value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{['Driver','Vehicle','Customer','Company'].map(c => <option key={c}>{c}</option>)}</select></FormField>
              <FormField label="Entity"><input className={inputClass} value={form.entity} onChange={e => setForm({...form,entity:e.target.value})} placeholder="Name or registration" /></FormField>
              <FormField label="Document Type"><input className={inputClass} value={form.doc} onChange={e => setForm({...form,doc:e.target.value})} placeholder="PDP, Roadworthy, Contract…" /></FormField>
              <FormField label="Expiry Date"><input type="date" className={inputClass} value={form.expiry} onChange={e => setForm({...form,expiry:e.target.value})} /></FormField>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.entity||!form.doc||!form.expiry||saving}>{saving?'Saving…':'Save Document'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
