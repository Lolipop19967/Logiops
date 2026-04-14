'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, PageHeader, Tabs, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

const STAGES = ['Prospect','Qualified','Quoted','Won','Lost']
const stageColor: Record<string,string> = {
  Prospect: 'text-slate-400 border-slate-700/50', Qualified: 'text-blue-400 border-blue-800/40',
  Quoted: 'text-purple-400 border-purple-700/50', Won: 'text-emerald-400 border-emerald-800/40', Lost: 'text-red-400 border-red-800/40',
}

export default function Leads() {
  const { data: leads, loading, add, update } = useCollection<any>('leads')
  const [view, setView] = useState('Kanban')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ company:'',contact:'',value:'',stage:'Prospect',source:'Referral',rep:'',notes:'' })

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, value:Number(form.value), created:new Date().toISOString().split('T')[0] } as any)
      setModal(false)
      setForm({ company:'',contact:'',value:'',stage:'Prospect',source:'Referral',rep:'',notes:'' })
    } finally { setSaving(false) }
  }

  const move = async (id: string, stage: string) => { await update(id, { stage }) }

  const totalPipeline = leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l) => s + (l.value||0), 0)

  return (
    <div>
      <PageHeader title="Leads & Pipeline" sub={loading?'Loading…':`R ${totalPipeline.toLocaleString()} pipeline value`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Lead</Button>} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {STAGES.map(s => (
          <Card key={s} className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{leads.filter(l=>l.stage===s).length}</p>
            <p className={`text-xs font-semibold mt-1 ${stageColor[s].split(' ')[0]}`}>{s}</p>
            <p className="text-xs text-slate-600 mt-0.5">R {leads.filter(l=>l.stage===s).reduce((a,l)=>a+(l.value||0),0).toLocaleString()}</p>
          </Card>
        ))}
      </div>
      <Tabs tabs={['Kanban','List']} active={view} onChange={setView} />
      {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : view === 'Kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[900px]">
            {STAGES.map(stage => (
              <div key={stage} className="flex-1 min-w-[180px]">
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 px-1 border-b pb-2 ${stageColor[stage]}`}>{stage} · {leads.filter(l=>l.stage===stage).length}</div>
                <div className="space-y-2">
                  {leads.filter(l=>l.stage===stage).map(lead => (
                    <Card key={lead.id} className="p-3 hover:border-purple-600/50 cursor-pointer transition-all">
                      <p className="text-sm font-semibold text-white mb-0.5">{lead.company}</p>
                      <p className="text-xs text-slate-500 mb-2">{lead.contact}</p>
                      <p className="text-emerald-400 text-sm font-bold mb-2">R {(lead.value||0).toLocaleString()}</p>
                      <div className="flex flex-wrap gap-1"><Badge variant="gray">{lead.source}</Badge><Badge variant="purple">{lead.rep}</Badge></div>
                      <div className="mt-3 pt-2 border-t border-purple-900/20 flex gap-1 flex-wrap">
                        {STAGES.filter(s=>s!==stage).slice(0,2).map(s => (
                          <button key={s} onClick={() => move(lead.id, s)} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-500 hover:text-white hover:bg-purple-600/20 transition-all">→ {s}</button>
                        ))}
                      </div>
                    </Card>
                  ))}
                  {leads.filter(l=>l.stage===stage).length === 0 && <div className="border-2 border-dashed border-purple-900/30 rounded-xl p-6 text-center"><p className="text-xs text-slate-600">No leads</p></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-purple-900/30">{['Company','Contact','Value','Stage','Source','Rep','Created'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-purple-900/20 hover:bg-purple-900/10">
                  <td className="px-4 py-3 font-medium text-white">{l.company}</td>
                  <td className="px-4 py-3 text-slate-400">{l.contact}</td>
                  <td className="px-4 py-3 text-emerald-400 font-semibold">R {(l.value||0).toLocaleString()}</td>
                  <td className="px-4 py-3"><Badge variant={l.stage==='Won'?'green':l.stage==='Lost'?'red':l.stage==='Quoted'?'purple':'blue'}>{l.stage}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{l.source}</td>
                  <td className="px-4 py-3 text-slate-400">{l.rep}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{l.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Lead</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Company"><input className={inputClass} value={form.company} onChange={e => setForm({...form,company:e.target.value})} placeholder="Company name" /></FormField></div>
              <FormField label="Contact Name"><input className={inputClass} value={form.contact} onChange={e => setForm({...form,contact:e.target.value})} placeholder="Full name" /></FormField>
              <FormField label="Est. Value (R)"><input type="number" className={inputClass} value={form.value} onChange={e => setForm({...form,value:e.target.value})} placeholder="0" /></FormField>
              <FormField label="Stage"><select className={inputClass} value={form.stage} onChange={e => setForm({...form,stage:e.target.value})}>{STAGES.map(s => <option key={s}>{s}</option>)}</select></FormField>
              <FormField label="Source"><select className={inputClass} value={form.source} onChange={e => setForm({...form,source:e.target.value})}>{['Referral','Cold Call','Web','Tender','Existing Customer'].map(s => <option key={s}>{s}</option>)}</select></FormField>
              <div className="col-span-2"><FormField label="Sales Rep"><input className={inputClass} value={form.rep} onChange={e => setForm({...form,rep:e.target.value})} placeholder="Rep name" /></FormField></div>
              <div className="col-span-2"><FormField label="Notes"><textarea className={inputClass} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} rows={2} placeholder="Any notes…" /></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.company||saving}>{saving?'Saving…':'Save Lead'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
