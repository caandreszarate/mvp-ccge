import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import MobileHeader from '@/components/layout/MobileHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  let { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    const meta = user.user_metadata ?? {}
    const { data: nuevoPerfil } = await supabase
      .from('perfiles')
      .upsert({
        id: user.id,
        nombre: meta.nombre ?? user.email?.split('@')[0] ?? 'Usuario',
        apellidos: meta.apellidos ?? '',
      })
      .select()
      .single()
    perfil = nuevoPerfil
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar solo en desktop */}
      <div className="hidden md:flex">
        <Sidebar perfil={perfil} />
      </div>

      {/* Header móvil con menú de usuario */}
      <MobileHeader perfil={perfil} />

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
