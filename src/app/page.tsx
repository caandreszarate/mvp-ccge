import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/ui/Logo'
import {
  Building2,
  FileText,
  Award,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'

const servicios = [
  {
    icon: Building2,
    titulo: 'Registro de Empresas',
    descripcion: 'Registra tu empresa en minutos con nuestro formulario guiado paso a paso.',
  },
  {
    icon: FileText,
    titulo: 'Gestión de Trámites',
    descripcion: 'Sigue el estado de tus trámites en tiempo real desde cualquier dispositivo.',
  },
  {
    icon: Award,
    titulo: 'Certificados Digitales',
    descripcion: 'Obtén certificados de existencia y representación legal al instante.',
  },
  {
    icon: RefreshCw,
    titulo: 'Renovaciones',
    descripcion: 'Renueva tu matrícula mercantil de forma rápida y sin filas.',
  },
]

const ventajas = [
  'Sin desplazamientos — todo desde tu dispositivo',
  'Documentos digitales con validez legal',
  'Seguimiento en tiempo real de tus trámites',
  'Soporte en español y francés',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo variant="mini" href="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="#servicios" className="hover:text-gray-900 transition-colors">Servicios</Link>
            <Link href="#como-funciona" className="hover:text-gray-900 transition-colors">Cómo funciona</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 text-center">
        <Badge className="mb-5 bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs md:text-sm">
          Portal Oficial · República de Guinea Ecuatorial
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
          Registra y gestiona tu empresa
          <span className="text-green-700 block">sin complicaciones</span>
        </h1>
        <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          La plataforma digital de la Cámara de Comercio de Guinea Ecuatorial.
          Trámites empresariales rápidos, seguros y desde cualquier lugar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white gap-2">
              Registrar mi empresa <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Acceder al portal</Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[
            { num: '100%', label: 'Digital' },
            { num: '24/7', label: 'Disponible' },
            { num: '8', label: 'Provincias' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-700">{s.num}</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="bg-gray-50 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">Todo lo que necesitas</h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto text-sm md:text-base">
            Una plataforma integrada para todos los trámites de tu empresa.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.titulo}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">Simple, rápido y seguro</h2>
              <div className="space-y-4">
                {ventajas.map((v) => (
                  <div key={v} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/auth/register">
                  <Button className="bg-green-700 hover:bg-green-800 text-white gap-2">
                    Comenzar gratis <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { paso: '01', titulo: 'Crea tu cuenta', desc: 'Regístrate con tu correo en menos de 2 minutos.' },
                { paso: '02', titulo: 'Completa el formulario', desc: 'Sigue el asistente guiado con los datos de tu empresa.' },
                { paso: '03', titulo: 'Recibe tu número de matrícula', desc: 'Tu empresa queda registrada y obtienes tu matrícula oficial.' },
                { paso: '04', titulo: 'Descarga tus certificados', desc: 'Genera y descarga certificados legales en PDF.' },
              ].map((item) => (
                <div key={item.paso} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white">
                  <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold">
                    {item.paso}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.titulo}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Formaliza tu negocio hoy</h2>
          <p className="text-green-100 mb-8">
            Gestiona todos tus trámites empresariales de forma digital, segura y oficial.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 gap-2 font-semibold">
              Registrar empresa <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo variant="full" href="/" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Atención digital 24/7 · Portal Oficial</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
