import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { estadoColor, estadoLabel, formatFecha } from '@/lib/utils'

export default async function TramitesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: tramites } = await supabase
    .from('tramites')
    .select('*, empresa:empresas(nombre_comercial, numero_matricula)')
    .eq('solicitante_id', user.id)
    .order('creado_en', { ascending: false })

  const stats = {
    total: tramites?.length ?? 0,
    pendientes: tramites?.filter((t) => t.estado === 'pendiente').length ?? 0,
    aprobados: tramites?.filter((t) => t.estado === 'aprobado').length ?? 0,
    rechazados: tramites?.filter((t) => t.estado === 'rechazado').length ?? 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis trámites</h1>
        <p className="text-gray-500 text-sm mt-1">
          Seguimiento en tiempo real de todas tus solicitudes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Pendientes', value: stats.pendientes, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Aprobados', value: stats.aprobados, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Rechazados', value: stats.rechazados, color: 'text-red-700', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historial de trámites</CardTitle>
        </CardHeader>
        <CardContent>
          {(!tramites || tramites.length === 0) ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No tienes trámites registrados aún.</p>
              <p className="text-gray-400 text-xs mt-1">
                Al registrar una empresa, se crea un trámite automáticamente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tramites.map((tramite) => {
                const Icon =
                  tramite.estado === 'aprobado' ? CheckCircle2 :
                  tramite.estado === 'rechazado' ? XCircle :
                  tramite.estado === 'en_revision' ? Clock :
                  AlertCircle

                const iconColor =
                  tramite.estado === 'aprobado' ? 'text-green-500' :
                  tramite.estado === 'rechazado' ? 'text-red-500' :
                  tramite.estado === 'en_revision' ? 'text-blue-500' :
                  'text-yellow-500'

                return (
                  <div key={tramite.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {estadoLabel(tramite.tipo)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {tramite.empresa?.nombre_comercial ?? '—'}
                              {tramite.empresa?.numero_matricula && (
                                <span className="ml-1 font-mono">· {tramite.empresa.numero_matricula}</span>
                              )}
                            </div>
                          </div>
                          <Badge className={`text-xs shrink-0 ${estadoColor(tramite.estado)}`}>
                            {estadoLabel(tramite.estado)}
                          </Badge>
                        </div>

                        {tramite.descripcion && (
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                            {tramite.descripcion}
                          </p>
                        )}

                        {tramite.motivo_rechazo && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-600">
                              <strong>Motivo del rechazo:</strong> {tramite.motivo_rechazo}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-2">
                          Creado el {formatFecha(tramite.creado_en)}
                        </div>
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
  )
}
