'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Building2,
  LayoutDashboard,
  FileText,
  Award,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Perfil } from '@/types'
import Logo from '@/components/ui/Logo'

const nav = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/empresa/nueva', label: 'Registrar empresa', icon: Building2 },
  { href: '/dashboard/tramites', label: 'Mis trámites', icon: FileText },
  { href: '/dashboard/certificados', label: 'Certificados', icon: Award },
]

export default function Sidebar({ perfil }: { perfil: Perfil | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 border-b border-gray-100 flex items-center px-4">
        <Logo variant="mini" href="/" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Usuario */}
      <div className="border-t border-gray-100 p-3">
        <div className="px-3 py-2 mb-1">
          <div className="text-sm font-medium text-gray-900 truncate">
            {perfil ? `${perfil.nombre} ${perfil.apellidos}` : 'Usuario'}
          </div>
          <div className="text-xs text-gray-400 capitalize">{perfil?.rol ?? 'ciudadano'}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
