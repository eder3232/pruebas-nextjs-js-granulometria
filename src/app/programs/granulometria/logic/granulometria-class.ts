import { IGranulometriaParsed } from '../types/granulometria-types'
import { number } from 'zod'
import { interp } from '../utils/interpolator'

const numberSchema = number().refine((val) => !isNaN(val), {
  message: 'El valor debe ser un numero',
})

interface IUtils {
  cc: number
  cu: number
  d10: number
  d30: number
  d60: number
}

interface IInternal {
  pesosCorregidos: number[]
  retenidos: number[]
  retenidosAcumulados: number[]
  pasantes: number[]
}

interface ISettings {
  pesoMallasTotal: number
  pesoCorregidoTotal: number
  hayCorreccion: boolean
}

interface IProcessed {
  malla: string
  abertura: number
  pesoRetenido: number
  pesoCorregido: number
  retenido: number
  retenidoAcumulado: number
  pasante: number
}

export interface IReturn {
  utils: IUtils
  settings: ISettings
  arrayProcessed: IProcessed[]
}

export class CLassGranulometria {
  dataArray: IGranulometriaParsed[] = []
  utils: IUtils = {
    cc: 0,
    cu: 0,
    d10: 0,
    d30: 0,
    d60: 0,
  }
  settings: ISettings = {
    pesoMallasTotal: 0,
    pesoCorregidoTotal: 0,
    hayCorreccion: false,
  }
  internal: IInternal = {
    pesosCorregidos: [],
    retenidos: [],
    retenidosAcumulados: [],
    pasantes: [],
  }

  constructor() {}

  corregirPeso(pesoCorregido: number | null = null) {
    if (pesoCorregido !== null) {
      this.settings.hayCorreccion = true
      this.settings.pesoCorregidoTotal = pesoCorregido
    }
  }

  agregarMalla({ malla, abertura, pesoRetenido }: IGranulometriaParsed) {
    //verificar si la malla no existe en el arreglo data array si existe arrojar un error
    //si no existe agregarla al arreglo
    //si existe arrojar un error
    const existeMalla = this.dataArray.find((el) => el.malla === malla)
    if (existeMalla) {
      throw new Error(`La malla ${malla} ya existe`)
    }
    //verificar si la abertura y el peso retenido son numeros validos
    //si no son numeros validos arrojar un error
    //si son numeros validos agregarlos al arreglo
    try {
      numberSchema.parse(abertura)
    } catch (e) {
      throw new Error(`La abertura debe ser un numero valido`)
    }

    try {
      numberSchema.parse(pesoRetenido)
    } catch (e) {
      throw new Error(`El peso retenido debe ser un numero valido`)
    }

    this.settings.pesoMallasTotal += pesoRetenido

    this.dataArray.push({ malla, abertura, pesoRetenido })
  }

  correccion() {
    if (this.settings.hayCorreccion) {
      this.dataArray.map((e) => {
        this.internal.pesosCorregidos.push(
          e.pesoRetenido *
            (this.settings.pesoCorregidoTotal / this.settings.pesoMallasTotal)
        )
      })
    } else {
      this.internal.pesosCorregidos = this.dataArray.map((e) => e.pesoRetenido)
      this.settings = {
        ...this.settings,
        pesoCorregidoTotal: this.settings.pesoMallasTotal,
      }
    }
  }

  retenidos() {
    this.dataArray.map((e, i) => {
      this.internal.retenidos.push(
        (this.internal.pesosCorregidos[i] / this.settings.pesoCorregidoTotal) *
          100
      )
    })
  }

  retenidosAcumulados() {
    this.internal.retenidosAcumulados.push(this.internal.retenidos[0])
    for (let i = 1; i < this.internal.retenidos.length; i++) {
      this.internal.retenidosAcumulados.push(
        this.internal.retenidos[i] + this.internal.retenidosAcumulados[i - 1]
      )
    }
  }

  pasantes() {
    this.internal.retenidosAcumulados.map((e) => {
      this.internal.pasantes.push(100 - e)
    })
  }

  decil(d: number) {
    let pasanteSuperior = 0
    let pasanteInferior = 0
    let aberturaSuperior = 0
    let aberturaInferior = 0
    let decil = d
    for (let i = 0; i < this.internal.pasantes.length; i++) {
      if (this.internal.pasantes[i] < decil) {
        pasanteSuperior = this.internal.pasantes[i - 1]
        pasanteInferior = this.internal.pasantes[i]
        aberturaSuperior = this.dataArray[i - 1].abertura
        aberturaInferior = this.dataArray[i].abertura
        break
      }
    }
    let apertura = interp(
      pasanteInferior,
      pasanteSuperior,
      aberturaInferior,
      aberturaSuperior,
      decil
    )
    return apertura
  }

  deciles() {
    this.utils = {
      cc: this.decil(60) / this.decil(10),
      cu: this.decil(30) ** 2 / (this.decil(10) * this.decil(60)),
      d10: this.decil(10),
      d30: this.decil(30),
      d60: this.decil(60),
    }
    // this.utils.d10 = this.decil(10)
    // this.utils.d30 = this.decil(30)
    // this.utils.d60 = this.decil(60)
    // this.utils.cc = this.utils.d60 / this.utils.d10
    // this.utils.cu = this.utils.d30 ** 2 / (this.utils.d10 * this.utils.d60)
  }

  calcular(): IReturn {
    this.correccion()
    this.retenidos()
    this.retenidosAcumulados()
    this.pasantes()
    this.deciles()

    return {
      utils: this.utils,
      settings: this.settings,
      arrayProcessed: this.dataArray.map((e, i) => ({
        malla: e.malla,
        abertura: e.abertura,
        pesoRetenido: e.pesoRetenido,
        pesoCorregido: this.internal.pesosCorregidos[i],
        retenido: this.internal.retenidos[i],
        retenidoAcumulado: this.internal.retenidosAcumulados[i],
        pasante: this.internal.pasantes[i],
      })),
    }
  }
}
