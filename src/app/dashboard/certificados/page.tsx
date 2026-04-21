import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Download } from 'lucide-react'
import { formatFecha } from '@/lib/utils'
import DescargarCertificado from '@/components/certificados/DescargarCertificado'

export default async function CertificadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: empresas } = await supabase
    .from('empresas')
    .select('id')
    .eq('propietario_id', user.id)

  const empresaIds = (empresas ?? []).map((e) => e.id)

  const { data: certificados } = empresaIds.length > 0
    ? await supabase
        .from('certificados')
        .select('*, empresa:empresas(nombre_comercial, numero_matricula, razon_social, provincia, ciudad, tipo_empresa)')
        .in('empresa_id', empresaIds)
        .order('creado_en', { ascending: false })
    : { data: [] }

  const tipoLabel: Record<string, string> = {
    existencia: 'Certificado de Existencia',
    representacion: 'Certificado de Representación Legal',
    matricula: 'Certificado de Matrícula',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificados</h1>
        <p className="text-gray-500 text-sm mt-1">
          Descarga tus certificados empresariales en PDF
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mis certificados</CardTitle>
        </CardHeader>
        <CardContent>
          {(!certificados || certificados.length === 0) ? (
            <div className="text-center py-12">
              <Award className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No tienes certificados emitidos aún.</p>
              <p className="text-gray-400 text-xs mt-1">
                Los certificados se generan una vez que tus trámites sean aprobados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {certificados.map((cert) => (
                <div key={cert.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {tipoLabel[cert.tipo] ?? cert.tipo}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {cert.empresa?.nombre_comercial} · {cert.empresa?.numero_matricula}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400">
                            Código: <span className="font-mono font-medium text-gray-600">{cert.codigo_verificacion}</span>
                          </span>
                          <Badge
                            className={
                              new Date(cert.vigente_hasta) > new Date()
                                ? 'bg-green-100 text-green-700 text-xs'
                                : 'bg-red-100 text-red-700 text-xs'
                            }
                          >
                            {new Date(cert.vigente_hasta) > new Date() ? 'Vigente' : 'Vencido'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Válido hasta: {formatFecha(cert.vigente_hasta)}
                        </div>
                      </div>
                    </div>

                    <DescargarCertificado certificado={cert} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
