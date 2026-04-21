import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-GQ', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function estadoColor(estado: string) {
  const mapa: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_revision: 'bg-blue-100 text-blue-800',
    aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800',
    activa: 'bg-green-100 text-green-800',
    suspendida: 'bg-yellow-100 text-yellow-800',
    cancelada: 'bg-red-100 text-red-800',
  }
  return mapa[estado] ?? 'bg-gray-100 text-gray-800'
}

export function estadoLabel(estado: string) {
  const mapa: Record<string, string> = {
    pendiente: 'Pendiente',
    en_revision: 'En revisión',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    activa: 'Activa',
    suspendida: 'Suspendida',
    cancelada: 'Cancelada',
    registro: 'Registro',
    renovacion: 'Renovación',
    certificado: 'Certificado',
    modificacion: 'Modificación',
    cancelacion: 'Cancelación',
  }
  return mapa[estado] ?? estado
}

export const PROVINCIAS_GE = [
  'Bioko Norte',
  'Bioko Sur',
  'Annobón',
  'Centro Sur',
  'Djibloho',
  'Kié-Ntem',
  'Litoral',
  'Wele-Nzas',
]

export const TIPOS_EMPRESA = [
  { value: 'natural', label: 'Persona Natural' },
  { value: 'srl', label: 'Sociedad de Responsabilidad Limitada (SRL)' },
  { value: 'sa', label: 'Sociedad Anónima (SA)' },
  { value: 'cooperativa', label: 'Cooperativa' },
  { value: 'asociacion', label: 'Asociación' },
]
