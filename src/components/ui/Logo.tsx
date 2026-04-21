import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'mini' | 'icon'
  href?: string
  className?: string
}

/** Símbolo CC — fiel al logo oficial CCGE (fondo blanco, C verde + C azul + GE) */
function CcSymbol({ size = 32 }: { size?: number }) {
  const s = size
  // Proporciones basadas en el SVG oficial 64x64
  const cx1 = s * 0.406   // 26/64
  const cx2 = s * 0.656   // 42/64
  const cy  = s * 0.375   // 24/64
  const r   = s * 0.219   // 14/64
  const ri  = s * 0.125   // 8/64

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={s} height={s} rx={s * 0.12} fill="#FFFFFF" />
      {/* C verde */}
      <circle cx={cx1} cy={cy} r={r} fill="#169B4A" />
      <circle cx={cx1 + s * 0.062} cy={cy} r={ri} fill="#FFFFFF" />
      {/* C azul */}
      <circle cx={cx2} cy={cy} r={r} fill="#2F80ED" />
      <circle cx={cx2 - s * 0.062} cy={cy} r={ri} fill="#FFFFFF" />
      {/* GE */}
      <text x={s * 0.25} y={s * 0.9} fontFamily="Arial, sans-serif" fontSize={s * 0.28} fontWeight="bold" fill="#E94E4E">G</text>
      <text x={s * 0.53} y={s * 0.9} fontFamily="Arial, sans-serif" fontSize={s * 0.28} fontWeight="bold" fill="#555555">E</text>
    </svg>
  )
}

/** Logo completo con símbolo + texto institucional */
function LogoFull() {
  return (
    <div className="flex items-center gap-3">
      <CcSymbol size={44} />
      <div className="leading-none">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Cámara de Comercio
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-bold text-[#2F80ED] leading-none">Guinea</span>
          <span className="text-base font-medium text-gray-400 leading-none">Ecuatorial</span>
        </div>
      </div>
    </div>
  )
}

/** Logo compacto para sidebar/header */
function LogoMini() {
  return (
    <div className="flex items-center gap-2">
      <CcSymbol size={34} />
      <div>
        <div className="font-bold text-gray-900 text-sm leading-none">CCGE</div>
        <div className="text-[10px] text-gray-400 leading-none mt-0.5">Guinea Ecuatorial</div>
      </div>
    </div>
  )
}

export default function Logo({ variant = 'mini', href, className }: LogoProps) {
  const content =
    variant === 'full' ? <LogoFull /> :
    variant === 'icon' ? <CcSymbol size={36} /> :
    <LogoMini />

  if (href) {
    return (
      <Link href={href} className={cn('inline-flex', className)}>
        {content}
      </Link>
    )
  }

  return <div className={cn('inline-flex', className)}>{content}</div>
}

export { CcSymbol }
