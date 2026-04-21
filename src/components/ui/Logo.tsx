import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'mini' | 'icon'
  href?: string
  className?: string
}

/** Símbolo CC — dos C entrelazadas (verde + azul) sobre fondo rojo */
function CcSymbol({ size = 32 }: { size?: number }) {
  const s = size
  const cx1 = s * 0.30
  const cx2 = s * 0.55
  const cy = s * 0.42
  const r = s * 0.22
  const ri = s * 0.13

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={s} height={s} rx={s * 0.18} fill="#E30613" />
      {/* C verde */}
      <circle cx={cx1} cy={cy} r={r} fill="#1FAF5A" />
      <circle cx={cx1 + s * 0.065} cy={cy} r={ri} fill="#E30613" />
      {/* C azul */}
      <circle cx={cx2} cy={cy} r={r} fill="#4A90E2" />
      <circle cx={cx2 - s * 0.065} cy={cy} r={ri} fill="#E30613" />
      {/* GE letras pequeñas */}
      <text
        x={s * 0.18}
        y={s * 0.92}
        fontFamily="Arial, sans-serif"
        fontSize={s * 0.22}
        fontWeight="bold"
        fill="#FF6B6B"
      >G</text>
      <text
        x={s * 0.50}
        y={s * 0.92}
        fontFamily="Arial, sans-serif"
        fontSize={s * 0.22}
        fontWeight="bold"
        fill="#BFBFBF"
      >E</text>
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
          <span className="text-lg font-bold text-[#4A90E2] leading-none">Guinea</span>
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
