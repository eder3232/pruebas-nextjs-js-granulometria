export interface IGranulometriaInput {
  malla: string
  abertura: string
  pesoRetenido: string
}

export interface IGranulometriaParsed {
  malla: string
  abertura: number
  pesoRetenido: number
}

export interface IGranulometriaProcessed {
  malla: string
  abertura: number
  pesoRetenido: number
  pesoRetenidoAcumulado: number
  porcentajeRetenido: number
  porcentajeRetenidoAcumulado: number
  porcentajePasante: number
}

export interface IGranulometriaOutput {
  malla: string
  abertura: string
  pesoRetenido: string
  pesoRetenidoAcumulado: string
  porcentajeRetenido: string
  porcentajeRetenidoAcumulado: string
  porcentajePasante: string
}
