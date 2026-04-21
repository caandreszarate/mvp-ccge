'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, FileText, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/empresa/nueva', label: 'Registrar', icon: Building2 },
  { href: '/dashboard/tramites', label: 'Trámites', icon: FileText },
  { href: '/dashboard/certificados', label: 'Certificados', icon: Award },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-1 text-[10px] font-medium transition-colors',
              active ? 'text-green-700' : 'text-gray-400'
            )}
          >
            <Icon className={cn('w-5 h-5', active ? 'text-green-700' : 'text-gray-400')} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
