import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export const metadata: Metadata = {
  title: 'LogiCRM — Logistics Management System',
  description: '80-feature logistics CRM',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen overflow-hidden bg-[#0f0a1e]">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#0f0a1e] p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
