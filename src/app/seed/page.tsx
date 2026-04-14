'use client'
import { useState } from 'react'
import { seedAll } from '@/lib/seed'
import { Button, Card, PageHeader } from '@/components/ui'
import { Database, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle')
  const [log, setLog] = useState<string[]>([])

  const run = async () => {
    setStatus('seeding')
    setLog([])
    try {
      // Patch console.log to capture output
      const orig = console.log
      console.log = (...args) => {
        orig(...args)
        setLog(prev => [...prev, args.join(' ')])
      }
      await seedAll()
      console.log = orig
      setStatus('done')
    } catch (e: any) {
      setLog(prev => [...prev, '❌ Error: ' + e.message])
      setStatus('error')
    }
  }

  return (
    <div>
      <PageHeader title="Database Seed" sub="Populate Firestore with demo data" />
      <Card className="p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Database size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Seed Demo Data</p>
            <p className="text-sm text-slate-500">Writes 15 customers, 20 shipments, 14 invoices, and more to Firestore.</p>
          </div>
        </div>

        {status === 'idle' && (
          <Button onClick={run} className="w-full justify-center">
            <Database size={14} /> Seed All Collections
          </Button>
        )}
        {status === 'seeding' && (
          <div className="flex items-center gap-3 text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            Seeding Firestore…
          </div>
        )}
        {status === 'done' && (
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 size={16} /> All data seeded successfully! Navigate to any page.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={16} /> Seeding failed. Check the log below.
          </div>
        )}

        {log.length > 0 && (
          <div className="mt-4 bg-black/30 rounded-lg p-4 font-mono text-xs text-slate-400 space-y-1 max-h-64 overflow-y-auto">
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}
      </Card>
    </div>
  )
}
