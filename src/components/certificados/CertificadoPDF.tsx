import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const tipoLabel: Record<string, string> = {
  existencia: 'CERTIFICADO DE EXISTENCIA Y REPRESENTACIÓN LEGAL',
  representacion: 'CERTIFICADO DE REPRESENTACIÓN LEGAL',
  matricula: 'CERTIFICADO DE MATRÍCULA MERCANTIL',
}

const tipoEmpresaLabel: Record<string, string> = {
  natural: 'Persona Natural',
  srl: 'Sociedad de Responsabilidad Limitada',
  sa: 'Sociedad Anónima',
  cooperativa: 'Cooperativa',
  asociacion: 'Asociación',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '3px solid #15803d',
    paddingBottom: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  institucion: {
    fontSize: 10,
    color: '#15803d',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subInstitucion: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  logo: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#15803d',
  },
  titulo: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  intro: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.7,
    marginBottom: 20,
    textAlign: 'justify',
  },
  seccion: {
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  seccionTitulo: {
    fontSize: 8,
    color: '#15803d',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 6,
  },
  fila: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    width: 140,
    fontFamily: 'Helvetica-Bold',
  },
  valor: {
    fontSize: 9,
    color: '#111827',
    flex: 1,
  },
  codigoBox: {
    border: '1px solid #d1fae5',
    backgroundColor: '#f0fdf4',
    borderRadius: 4,
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  codigoLabel: {
    fontSize: 8,
    color: '#15803d',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codigo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#166534',
    marginTop: 4,
    letterSpacing: 2,
  },
  footer: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: 16,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
  firma: {
    marginTop: 40,
    alignItems: 'center',
  },
  firmaLinea: {
    borderTop: '1px solid #374151',
    width: 200,
    marginBottom: 4,
  },
  firmaNombre: {
    fontSize: 9,
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  firmaCargo: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
})

interface Props {
  certificado: {
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

export function CertificadoPDF({ certificado }: Props) {
  const empresa = certificado.empresa
  const fechaEmision = new Date().toLocaleDateString('es-GQ', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const fechaVigencia = new Date(certificado.vigente_hasta).toLocaleDateString('es-GQ', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.institucion}>Cámara de Comercio</Text>
            <Text style={styles.subInstitucion}>República de Guinea Ecuatorial</Text>
          </View>
          <Text style={styles.logo}>CCGE</Text>
        </View>

        {/* Título */}
        <Text style={styles.titulo}>
          {tipoLabel[certificado.tipo] ?? 'Certificado Empresarial'}
        </Text>

        {/* Intro */}
        <Text style={styles.intro}>
          La Cámara de Comercio de la República de Guinea Ecuatorial, en uso de sus facultades legales
          y de conformidad con el Código de Comercio vigente en el marco del derecho OHADA,
          CERTIFICA que en el Registro Mercantil de esta Institución aparece inscrita la siguiente empresa:
        </Text>

        {/* Datos empresa */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Datos de la empresa</Text>
          <View style={styles.fila}>
            <Text style={styles.label}>Nombre comercial:</Text>
            <Text style={styles.valor}>{empresa?.nombre_comercial ?? '—'}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Razón social:</Text>
            <Text style={styles.valor}>{empresa?.razon_social ?? '—'}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Tipo de empresa:</Text>
            <Text style={styles.valor}>{tipoEmpresaLabel[empresa?.tipo_empresa ?? ''] ?? empresa?.tipo_empresa ?? '—'}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>N.º de matrícula:</Text>
            <Text style={styles.valor}>{empresa?.numero_matricula ?? '—'}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Domicilio:</Text>
            <Text style={styles.valor}>{empresa?.ciudad}, {empresa?.provincia}</Text>
          </View>
        </View>

        {/* Fechas */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Vigencia</Text>
          <View style={styles.fila}>
            <Text style={styles.label}>Fecha de emisión:</Text>
            <Text style={styles.valor}>{fechaEmision}</Text>
          </View>
          <View style={styles.fila}>
            <Text style={styles.label}>Válido hasta:</Text>
            <Text style={styles.valor}>{fechaVigencia}</Text>
          </View>
        </View>

        {/* Código de verificación */}
        <View style={styles.codigoBox}>
          <Text style={styles.codigoLabel}>Código de verificación</Text>
          <Text style={styles.codigo}>{certificado.codigo_verificacion}</Text>
          <Text style={{ fontSize: 7, color: '#6b7280', marginTop: 4 }}>
            Verifica la autenticidad de este documento en el portal oficial de la CCGE
          </Text>
        </View>

        {/* Firma */}
        <View style={styles.firma}>
          <View style={styles.firmaLinea} />
          <Text style={styles.firmaNombre}>Director de Registro Mercantil</Text>
          <Text style={styles.firmaCargo}>Cámara de Comercio de Guinea Ecuatorial</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CCGE · Malabo, Guinea Ecuatorial</Text>
          <Text style={styles.footerText}>Documento generado digitalmente</Text>
          <Text style={styles.footerText}>{fechaEmision}</Text>
        </View>
      </Page>
    </Document>
  )
}
