export type Rol = 'ciudadano' | 'funcionario' | 'admin'

export type TipoEmpresa = 'natural' | 'srl' | 'sa' | 'cooperativa' | 'asociacion'

export type EstadoEmpresa = 'activa' | 'suspendida' | 'cancelada'

export type TipoTramite = 'registro' | 'renovacion' | 'certificado' | 'modificacion' | 'cancelacion'

export type EstadoTramite = 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'

export type TipoCertificado = 'existencia' | 'representacion' | 'matricula'

export interface Perfil {
  id: string
  nombre: string
  apellidos: string
  telefono?: string
  documento_id?: string
  rol: Rol
  creado_en: string
}

export interface Empresa {
  id: string
  propietario_id: string
  numero_matricula: string
  nombre_comercial: string
  razon_social: string
  tipo_empresa: TipoEmpresa
  actividad_ciiu: string
  descripcion_actividad?: string
  provincia: string
  ciudad: string
  direccion: string
  estado: EstadoEmpresa
  fecha_registro: string
  fecha_renovacion?: string
  telefono?: string
  email?: string
  creado_en: string
}

export interface Tramite {
  id: string
  empresa_id: string
  solicitante_id: string
  tipo: TipoTramite
  estado: EstadoTramite
  descripcion?: string
  motivo_rechazo?: string
  procesado_por?: string
  creado_en: string
  empresa?: Empresa
}

export interface Certificado {
  id: string
  empresa_id: string
  tramite_id?: string
  tipo: TipoCertificado
  codigo_verificacion: string
  vigente_hasta: string
  creado_en: string
  empresa?: Empresa
}

export interface ActividadCIIU {
  codigo: string
  descripcion: string
  seccion: string
}

// Formulario crear empresa (3 pasos)
export interface FormEmpresaPaso1 {
  nombre: string
  apellidos: string
  documento_id: string
  telefono: string
}

export interface FormEmpresaPaso2 {
  nombre_comercial: string
  razon_social: string
  tipo_empresa: TipoEmpresa
  actividad_ciiu: string
  descripcion_actividad: string
}

export interface FormEmpresaPaso3 {
  provincia: string
  ciudad: string
  direccion: string
  telefono: string
  email: string
}

export interface FormEmpresa extends FormEmpresaPaso1, FormEmpresaPaso2, FormEmpresaPaso3 {}
