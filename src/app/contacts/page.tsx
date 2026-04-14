'use client'
import { useState } from 'react'
import { Plus, Search, Mail, Phone } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

export default function Contacts() {
  const { data: contacts, loading, add } = useCollection<any>('contacts')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'',customerName:'',role:'',dept:'',email:'',phone:'' })

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.role?.toLowerCase().includes(search.toLowerCase())
  )

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, customerId:'' } as any)
      setModal(false)
      setForm({ name:'',customerName:'',role:'',dept:'',email:'',phone:'' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Contacts" sub={loading?'Loading…':`${contacts.length} contacts`} actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Contact</Button>} />
      <Card>
        <div className="p-4 border-b border-purple-900/30">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts…" className={`${inputClass} pl-9`} />
          </div>
        </div>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Name','Company','Role','Department','Email','Phone']}>
            {filtered.map(c => (
              <TR key={c.id}>
                <TD><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-xs font-bold text-purple-300">{c.name?.split(' ').map((n:string)=>n[0]).join('')}</div><span className="font-medium text-white text-sm">{c.name}</span></div></TD>
                <TD><Badge variant="purple">{c.customerName}</Badge></TD>
                <TD>{c.role}</TD>
                <TD><span className="text-slate-500 text-xs">{c.dept}</span></TD>
                <TD><a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm"><Mail size={12} />{c.email}</a></TD>
                <TD><span className="flex items-center gap-1.5 text-slate-400 text-sm"><Phone size={12} />{c.phone}</span></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Full Name"><input className={inputClass} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Full name" /></FormField></div>
              <FormField label="Company"><input className={inputClass} value={form.customerName} onChange={e => setForm({...form,customerName:e.target.value})} placeholder="Company name" /></FormField>
              <FormField label="Department"><input className={inputClass} value={form.dept} onChange={e => setForm({...form,dept:e.target.value})} placeholder="Finance, Ops…" /></FormField>
              <FormField label="Role / Title"><input className={inputClass} value={form.role} onChange={e => setForm({...form,role:e.target.value})} placeholder="Operations Manager" /></FormField>
              <FormField label="Phone"><input className={inputClass} value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="083 000 0000" /></FormField>
              <div className="col-span-2"><FormField label="Email"><input className={inputClass} value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="name@company.co.za" /></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name||saving}>{saving?'Saving…':'Save Contact'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
