import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  FileText,
  Award,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { estadoColor, estadoLabel, formatFecha } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  let { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Si no existe el perfil (usuario registrado antes del schema), lo creamos
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

  const { data: empresas } = await supabase
    .from('empresas')
    .select('*')
    .eq('propietario_id', user.id)
    .order('creado_en', { ascending: false })
    .limit(3)

  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, empresa:empresas(nombre_comercial)')
    .eq('solicitante_id', user.id)
    .order('creado_en', { ascending: false })
    .limit(5)

  const { data: certificados } = await supabase
    .from('certificados')
    .select('*, empresa:empresas(nombre_comercial)')
    .in('empresa_id', (empresas ?? []).map((e) => e.id))
    .order('creado_en', { ascending: false })
    .limit(3)

  const totalEmpresas = empresas?.length ?? 0
  const tramitesPendientes = (tramites ?? []).filter((t) => t.estado === 'pendiente').length
  const totalCertificados = certificados?.length ?? 0

  const nombre = perfil?.nombre ?? 'Usuario'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Hola, {nombre} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">
            Cámara de Comercio de Guinea Ecuatorial
          </p>
        </div>
        <Link href="/dashboard/empresa/nueva" className="shrink-0">
          <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nueva empresa</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalEmpresas}</div>
                <div className="text-xs text-gray-500">Empresas registradas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tramitesPendientes}</div>
                <div className="text-xs text-gray-500">Trámites pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalCertificados}</div>
                <div className="text-xs text-gray-500">Certificados emitidos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mis empresas */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Mis empresas</CardTitle>
              <Link href="/dashboard/empresa/nueva">
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 gap-1 text-xs">
                  <Plus className="w-3 h-3" /> Registrar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(!empresas || empresas.length === 0) ? (
              <div className="text-center py-8">
                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aún no tienes empresas registradas</p>
                <Link href="/dashboard/empresa/nueva">
                  <Button size="sm" className="mt-3 bg-green-700 hover:bg-green-800 text-white gap-1">
                    <Plus className="w-3 h-3" /> Registrar empresa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {empresas.map((empresa) => (
                  <div key={empresa.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {empresa.nombre_comercial}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {empresa.numero_matricula}
                      </div>
                    </div>
                    <Badge className={`text-xs shrink-0 ml-2 ${estadoColor(empresa.estado)}`}>
                      {estadoLabel(empresa.estado)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trámites recientes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Trámites recientes</CardTitle>
              <Link href="/dashboard/tramites">
                <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 gap-1 text-xs">
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {(!tramites || tramites.length === 0) ? (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No hay trámites registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tramites.map((tramite) => {
                  const Icon =
                    tramite.estado === 'aprobado' ? CheckCircle2 :
                    tramite.estado === 'rechazado' ? XCircle :
                    AlertCircle
                  const iconColor =
                    tramite.estado === 'aprobado' ? 'text-green-500' :
                    tramite.estado === 'rechazado' ? 'text-red-500' :
                    'text-yellow-500'
                  return (
                    <div key={tramite.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {estadoLabel(tramite.tipo)}
                          </span>
                          <Badge className={`text-xs shrink-0 ${estadoColor(tramite.estado)}`}>
                            {estadoLabel(tramite.estado)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 truncate">
                          {tramite.empresa?.nombre_comercial ?? '—'} · {formatFecha(tramite.creado_en)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/empresa/nueva', label: 'Registrar empresa', icon: Building2, color: 'bg-blue-50 text-blue-700' },
            { href: '/dashboard/tramites', label: 'Ver trámites', icon: FileText, color: 'bg-yellow-50 text-yellow-700' },
            { href: '/dashboard/certificados', label: 'Mis certificados', icon: Award, color: 'bg-green-50 text-green-700' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
