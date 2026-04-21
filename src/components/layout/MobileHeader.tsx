'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Perfil } from '@/types'

export default function MobileHeader({ perfil }: { perfil: Perfil | null }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Cerrar menú al tocar fuera
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  async function handleLogout() {
    setOpen(false)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const iniciales = perfil
    ? `${perfil.nombre[0] ?? ''}${perfil.apellidos[0] ?? ''}`.toUpperCase()
    : 'U'

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
      {/* Logo */}
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

      {/* Menú usuario */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {iniciales}
          </div>
          <span className="text-xs font-medium text-gray-700 max-w-[80px] truncate">
            {perfil?.nombre ?? 'Usuario'}
          </span>
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            {/* Info usuario */}
            <div className="px-4 py-3 border-b border-gray-50">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {perfil ? `${perfil.nombre} ${perfil.apellidos}` : 'Usuario'}
              </div>
              <div className="text-xs text-gray-400 capitalize mt-0.5 flex items-center gap-1">
                <User className="w-3 h-3" />
                {perfil?.rol ?? 'ciudadano'}
              </div>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
