import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar solo en desktop */}
      <div className="hidden md:flex">
        <Sidebar perfil={perfil} />
      </div>

      {/* Header móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7">
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="8" fill="#FFFFFF" stroke="#e5e7eb" strokeWidth="2"/>
              <circle cx="26" cy="24" r="14" fill="#169B4A"/>
              <circle cx="30" cy="24" r="8" fill="#FFFFFF"/>
              <circle cx="42" cy="24" r="14" fill="#2F80ED"/>
              <circle cx="38" cy="24" r="8" fill="#FFFFFF"/>
              <text x="16" y="54" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#E94E4E">G</text>
              <text x="34" y="54" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#555555">E</text>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">CCGE</span>
        </div>
        <span className="text-xs text-gray-400">Portal Empresarial</span>
      </div>

      <main className="flex-1 min-w-0">
        {/* Padding top en móvil para compensar header fijo, padding bottom para BottomNav */}
        <div className="max-w-5xl mx-auto px-4 py-4 pt-[4.5rem] pb-24 md:px-6 md:py-8 md:pt-8 md:pb-8">
          {children}
        </div>
      </main>

      {/* Bottom nav solo en móvil */}
      <BottomNav />
    </div>
  )
}
