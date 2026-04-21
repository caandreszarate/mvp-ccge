'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, User, MapPin, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { PROVINCIAS_GE, TIPOS_EMPRESA } from '@/lib/utils'
import { FormEmpresa } from '@/types'

const CIIU_SAMPLE = [
  { codigo: '4711', descripcion: 'Comercio al por menor en almacenes' },
  { codigo: '5610', descripcion: 'Restaurantes y afines' },
  { codigo: '4100', descripcion: 'Construcción de edificios' },
  { codigo: '7490', descripcion: 'Otras actividades profesionales' },
  { codigo: '8299', descripcion: 'Otras actividades de apoyo a empresas' },
  { codigo: '0311', descripcion: 'Pesca marítima' },
  { codigo: '5510', descripcion: 'Alojamiento en hoteles' },
  { codigo: '6110', descripcion: 'Telecomunicaciones' },
]

const pasos = [
  { num: 1, label: 'Datos personales', icon: User },
  { num: 2, label: 'Datos empresa', icon: Building2 },
  { num: 3, label: 'Ubicación', icon: MapPin },
]

const estadoInicial: FormEmpresa = {
  nombre: '', apellidos: '', documento_id: '', telefono: '',
  nombre_comercial: '', razon_social: '', tipo_empresa: 'natural',
  actividad_ciiu: '', descripcion_actividad: '',
  provincia: '', ciudad: '', direccion: '', email: '',
}

export default function NuevaEmpresaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState<FormEmpresa>(estadoInicial)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState<{ matricula: string; id: string } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function validarPaso(): boolean {
    if (paso === 1) {
      if (!form.nombre || !form.apellidos || !form.documento_id) {
        setError('Completa todos los campos obligatorios.')
        return false
      }
    }
    if (paso === 2) {
      if (!form.nombre_comercial || !form.razon_social || !form.actividad_ciiu) {
        setError('Completa todos los campos obligatorios.')
        return false
      }
    }
    if (paso === 3) {
      if (!form.provincia || !form.ciudad || !form.direccion) {
        setError('Completa todos los campos obligatorios.')
        return false
      }
    }
    return true
  }

  function siguiente() {
    if (!validarPaso()) return
    setError('')
    setPaso((p) => Math.min(p + 1, 3))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validarPaso()) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesión expirada. Inicia sesión nuevamente.'); setLoading(false); return }

    // Generar matrícula en cliente (simplificada — en producción usar RPC)
    const anio = new Date().getFullYear()
    const seq = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
    const matricula = `CCGE-${anio}-${seq}`

    const { data: empresa, error: errEmpresa } = await supabase
      .from('empresas')
      .insert({
        propietario_id: user.id,
        numero_matricula: matricula,
        nombre_comercial: form.nombre_comercial,
        razon_social: form.razon_social,
        tipo_empresa: form.tipo_empresa,
        actividad_ciiu: form.actividad_ciiu,
        descripcion_actividad: form.descripcion_actividad,
        provincia: form.provincia,
        ciudad: form.ciudad,
        direccion: form.direccion,
        telefono: form.telefono,
        email: form.email,
      })
      .select()
      .single()

    if (errEmpresa) {
      setError('Error al registrar la empresa: ' + errEmpresa.message)
      setLoading(false)
      return
    }

    // Crear trámite de registro automáticamente
    await supabase.from('tramites').insert({
      empresa_id: empresa.id,
      solicitante_id: user.id,
      tipo: 'registro',
      estado: 'pendiente',
      descripcion: 'Solicitud de registro de matrícula mercantil.',
    })

    // Actualizar perfil con documento
    await supabase
      .from('perfiles')
      .update({ nombre: form.nombre, apellidos: form.apellidos, documento_id: form.documento_id, telefono: form.telefono })
      .eq('id', user.id)

    setExito({ matricula, id: empresa.id })
    setLoading(false)
  }

  if (exito) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Empresa registrada!</h1>
        <p className="text-gray-500 mb-6">
          Tu empresa ha sido registrada exitosamente. Tu trámite está en revisión.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <div className="text-xs text-green-700 font-medium mb-1">Número de matrícula</div>
          <div className="text-2xl font-bold text-green-800 font-mono">{exito.matricula}</div>
          <div className="text-xs text-green-600 mt-1">Guarda este número — es tu identificador oficial</div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/tramites')}
          >
            Ver mis trámites
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={() => router.push('/dashboard')}
          >
            Ir al dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Registrar empresa</h1>
        <p className="text-gray-500 text-sm mt-1">
          Completa los 3 pasos para obtener tu matrícula mercantil.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {pasos.map((p, idx) => (
          <div key={p.num} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 ${paso >= p.num ? 'text-green-700' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                paso > p.num ? 'bg-green-700 border-green-700 text-white' :
                paso === p.num ? 'border-green-700 text-green-700' :
                'border-gray-200 text-gray-400'
              }`}>
                {paso > p.num ? <CheckCircle2 className="w-4 h-4" /> : p.num}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${paso >= p.num ? 'text-green-700' : 'text-gray-400'}`}>
                {p.label}
              </span>
            </div>
            {idx < pasos.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-colors ${paso > p.num ? 'bg-green-700' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Paso 1 */}
        {paso === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-green-700" /> Datos del titular
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Obiang Nguema" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="documento_id">Número de documento (DNI/Pasaporte) *</Label>
              <Input id="documento_id" name="documento_id" value={form.documento_id} onChange={handleChange} placeholder="GQ123456" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+240 222 000 000" />
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {paso === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-700" /> Datos de la empresa
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="nombre_comercial">Nombre comercial *</Label>
              <Input id="nombre_comercial" name="nombre_comercial" value={form.nombre_comercial} onChange={handleChange} placeholder="Comercial Obiang" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="razon_social">Razón social *</Label>
              <Input id="razon_social" name="razon_social" value={form.razon_social} onChange={handleChange} placeholder="Comercial Obiang SRL" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tipo_empresa">Tipo de empresa *</Label>
              <select
                id="tipo_empresa"
                name="tipo_empresa"
                value={form.tipo_empresa}
                onChange={handleChange}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                {TIPOS_EMPRESA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="actividad_ciiu">Actividad económica (CIIU) *</Label>
              <select
                id="actividad_ciiu"
                name="actividad_ciiu"
                value={form.actividad_ciiu}
                onChange={handleChange}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Selecciona una actividad</option>
                {CIIU_SAMPLE.map((a) => (
                  <option key={a.codigo} value={a.codigo}>{a.codigo} — {a.descripcion}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descripcion_actividad">Descripción de la actividad</Label>
              <Textarea
                id="descripcion_actividad"
                name="descripcion_actividad"
                value={form.descripcion_actividad}
                onChange={handleChange}
                placeholder="Describe brevemente la actividad principal de la empresa..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {paso === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-700" /> Ubicación y contacto
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="provincia">Provincia *</Label>
              <select
                id="provincia"
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Selecciona una provincia</option>
                {PROVINCIAS_GE.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input id="ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Malabo" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle de la Independencia, 12" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo empresa</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@empresa.gq" />
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Resumen</div>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-400">Titular:</span> <span className="font-medium">{form.nombre} {form.apellidos}</span></div>
                <div><span className="text-gray-400">Empresa:</span> <span className="font-medium">{form.nombre_comercial}</span></div>
                <div><span className="text-gray-400">Tipo:</span> <span className="font-medium">{TIPOS_EMPRESA.find(t => t.value === form.tipo_empresa)?.label}</span></div>
                <div><span className="text-gray-400">CIIU:</span> <span className="font-medium">{form.actividad_ciiu}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPaso((p) => Math.max(p - 1, 1))}
            disabled={paso === 1}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>

          {paso < 3 ? (
            <Button
              type="button"
              onClick={siguiente}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white gap-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
              ) : (
                'Registrar empresa'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
