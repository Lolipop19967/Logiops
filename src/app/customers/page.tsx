'use client'
import { useState } from 'react'
import { Plus, Search, Building2 } from 'lucide-react'
import { Card, Badge, Button, Table, TR, TD, PageHeader, FormField, inputClass } from '@/components/ui'
import { useCollection } from '@/lib/hooks'

type Customer = {
  id: string; name: string; industry: string; region: string; tier: string
  revenue: number; shipments: number; balance: number; status: string
  phone: string; email: string; contact: string; credit: number
}

const tierBadge = (t: string) => t === 'Enterprise' ? 'purple' : t === 'Premium' ? 'blue' : 'gray'
const statusBadge = (s: string) => s === 'Active' ? 'green' : 'amber'

export default function Customers() {
  const { data: customers, loading, add } = useCollection<Customer>('customers')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', region: '', tier: 'Standard', email: '', phone: '', contact: '', credit: '30' })

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.region?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  )

  const save = async () => {
    setSaving(true)
    try {
      await add({ ...form, revenue: 0, shipments: 0, balance: 0, status: 'Active', credit: Number(form.credit) } as any)
      setModal(false)
      setForm({ name: '', industry: '', region: '', tier: 'Standard', email: '', phone: '', contact: '', credit: '30' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader title="Customers" sub={loading ? 'Loading…' : `${customers.length} accounts`}
        actions={<Button onClick={() => setModal(true)}><Plus size={14} />Add Customer</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Accounts', value: customers.length },
          { label: 'Enterprise', value: customers.filter(c => c.tier === 'Enterprise').length },
          { label: 'On Hold', value: customers.filter(c => c.status === 'On Hold').length },
          { label: 'Outstanding', value: `R ${customers.reduce((s, c) => s + (c.balance || 0), 0).toLocaleString()}` },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <div className="p-4 border-b border-purple-900/30">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…" className={`${inputClass} pl-9`} />
          </div>
        </div>
        {loading ? <div className="p-12 text-center text-slate-500">Loading from Firestore…</div> : (
          <Table headers={['Company', 'Industry', 'Region', 'Tier', 'Revenue', 'Outstanding', 'Status']}>
            {filtered.map(c => (
              <TR key={c.id}>
                <TD><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center"><Building2 size={14} className="text-purple-400" /></div><div><p className="font-medium text-white text-sm">{c.name}</p><p className="text-xs text-slate-500">{c.contact}</p></div></div></TD>
                <TD>{c.industry}</TD><TD>{c.region}</TD>
                <TD><Badge variant={tierBadge(c.tier) as any}>{c.tier}</Badge></TD>
                <TD><span className="text-emerald-400 font-medium">R {(c.revenue||0).toLocaleString()}</span></TD>
                <TD>{c.balance > 0 ? <span className="text-red-400 font-medium">R {c.balance.toLocaleString()}</span> : <span className="text-emerald-400">—</span>}</TD>
                <TD><Badge variant={statusBadge(c.status) as any}>{c.status}</Badge></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a0f35] border border-purple-900/50 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-white mb-5">Add Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><FormField label="Company Name"><input className={inputClass} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Acme Freight Ltd" /></FormField></div>
              <FormField label="Industry"><input className={inputClass} value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} placeholder="FMCG" /></FormField>
              <FormField label="Region"><input className={inputClass} value={form.region} onChange={e => setForm({...form, region: e.target.value})} placeholder="Gauteng" /></FormField>
              <FormField label="Tier"><select className={inputClass} value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}>{['Standard','Premium','Enterprise'].map(t => <option key={t}>{t}</option>)}</select></FormField>
              <FormField label="Credit Terms (days)"><select className={inputClass} value={form.credit} onChange={e => setForm({...form, credit: e.target.value})}>{['30','60','90'].map(t => <option key={t}>{t}</option>)}</select></FormField>
              <FormField label="Email"><input className={inputClass} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ops@company.co.za" /></FormField>
              <FormField label="Phone"><input className={inputClass} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="011 000 0000" /></FormField>
              <div className="col-span-2"><FormField label="Primary Contact"><input className={inputClass} value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="Full name" /></FormField></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.name || saving}>{saving ? 'Saving…' : 'Save Customer'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
