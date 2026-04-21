'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  certificado: {
    id: string
    tipo: string
    codigo_verificacion: string
    vigente_hasta: string
    empresa?: {
      nombre_comercial: string
      numero_matricula: string
      razon_social: string
      provincia: string
      ciudad: string
      tipo_empresa: string
    } | null
  }
}

export default function DescargarCertificado({ certificado }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDescargar() {
    setLoading(true)
    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { CertificadoPDF } = await import('./CertificadoPDF')
      const { createElement } = await import('react')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(createElement(CertificadoPDF, { certificado }) as any).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificado-${certificado.codigo_verificacion}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generando PDF:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDescargar}
      disabled={loading}
      className="gap-2 shrink-0"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {loading ? 'Generando...' : 'Descargar PDF'}
    </Button>
  )
}
