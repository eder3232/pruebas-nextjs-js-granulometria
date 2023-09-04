'use client'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  IGranulometriaInput,
  IGranulometriaParsed,
  IGranulometriaProcessed,
  IGranulometriaOutput,
} from '../types/granulometria-types'
import { CLassGranulometria, IReturn } from './granulometria-class'

interface IError {
  name: string
  message: string
  typeError: string
  errorCode: number
  severity: 'error' | 'warning' | 'info' | 'success'
}

interface IGranulometriaState {
  stringData: IGranulometriaInput[]
  isThereLossMaterial: boolean
  initialWeight: string
  errors: IError[]
  results: IReturn
}

interface IGranulometriaActions {
  update_data: (data: IGranulometriaInput[]) => void
  toggleLossMaterial: () => void
  setLossMaterial: (value: string) => void
  calculate: () => IReturn
  casting: () => IGranulometriaParsed[]
  checkInputData: () => boolean
  checkNoDuplicates: () => boolean
  checkAtLeastOneMeshIsNotZero: () => boolean
  checkIfInitialWeightIsANumber: () => boolean
}

const granulometriaErrors = {
  1: 'El valor de la malla debe ser un número',
  2: 'El peso retenido en la malla debe ser un número',
  3: 'Hay mallas duplicadas',
  4: 'Al menos una malla debe tener un valor diferente de cero.',
  5: 'El peso inicial debe ser un número.',
}

export const useGranulometriaStore = create(
  immer<IGranulometriaState & IGranulometriaActions>((set, get) => ({
    stringData: [],
    isThereLossMaterial: false,
    initialWeight: '0',
    errors: [],
    results: {
      utils: {
        cc: 0,
        cu: 0,
        d10: 0,
        d30: 0,
        d60: 0,
      },
      settings: {
        pesoMallasTotal: 0,
        pesoCorregidoTotal: 0,
        hayCorreccion: false,
      },
      arrayProcessed: [],
    },
    toggleLossMaterial: () => {
      set((state) => {
        state.isThereLossMaterial = !state.isThereLossMaterial
      })
    },
    setLossMaterial: (value: string) => {
      set((state) => {
        state.initialWeight = value
      })
    },
    update_data: (data: IGranulometriaInput[]) => {
      set((state) => {
        state.stringData = data
      })
    },
    checkInputData: () => {
      let areThereMistakes = false

      const stringData = get().stringData

      stringData.map((e, i) => {
        if (Number.isNaN(Number(e.abertura))) {
          areThereMistakes = true
          set((state) => {
            state.errors.push({
              name: 'malla',
              message: `El valor de la malla ${e.malla} debe ser un número`,
              typeError: 'NaN',
              errorCode: 1,
              severity: 'error',
            })
          })
        }
        if (Number.isNaN(Number(e.pesoRetenido))) {
          areThereMistakes = true
          set((state) => {
            state.errors.push({
              name: 'malla',
              message: `El peso retenido en la malla ${e.malla} debe ser un número`,
              typeError: 'NaN',
              errorCode: 2,
              severity: 'error',
            })
          })
        }
      })
      if (!areThereMistakes) {
        set((state) => {
          state.errors = state.errors.filter((e) => e.errorCode !== 1 || 2)
        })
      }
      return areThereMistakes
    },
    checkNoDuplicates: () => {
      const stringData = get().stringData
      let areThereDuplicates = false
      const mallas = stringData.map((e) => e.malla)
      const mallasSet = new Set(mallas)
      if (mallas.length !== mallasSet.size) {
        areThereDuplicates = true
        set((state) => {
          state.errors.push({
            name: 'malla',
            message: `Hay mallas duplicadas`,
            typeError: 'duplicates',
            errorCode: 3,
            severity: 'error',
          })
        })
      } else {
        set((state) => {
          state.errors = state.errors.filter((e) => e.errorCode !== 3)
        })
      }
      return areThereDuplicates
    },
    casting: () => {
      const stringData = get().stringData
      const parsedData: IGranulometriaParsed[] = []

      stringData.map((e) => {
        parsedData.push({
          malla: e.malla,
          abertura: Number(e.abertura),
          pesoRetenido: Number(e.pesoRetenido),
        })
      })
      return parsedData
    },
    checkAtLeastOneMeshIsNotZero: () => {
      const stringData = get().casting()
      let atLeastOneMeshIsNotZero = false
      stringData.map((e) => {
        if (e.abertura !== 0) {
          atLeastOneMeshIsNotZero = true
        }
      })

      //colocar el error de que si esto pasa no se puede calcular
      if (atLeastOneMeshIsNotZero) {
        set((state) => {
          state.errors = state.errors.filter((e) => e.errorCode !== 4)
        })
      } else {
        set((state) => {
          state.errors.push({
            name: 'noValidValue',
            message: `Al menos una malla debe tener un valor diferente de cero.`,
            typeError: 'atLeastOneMeshIsNotZero',
            errorCode: 4,
            severity: 'error',
          })
        })
      }

      return atLeastOneMeshIsNotZero
    },
    checkIfInitialWeightIsANumber: () => {
      const initialWeight = get().initialWeight
      let isANumber = false
      if (Number.isNaN(Number(initialWeight))) {
        set((state) => {
          state.errors.push({
            name: 'initialWeight',
            message: `El peso inicial debe ser un número.`,
            typeError: 'NaN',
            errorCode: 5,
            severity: 'error',
          })
        })
      } else {
        set((state) => {
          state.errors = state.errors.filter((e) => e.errorCode !== 5)
        })
        isANumber = true
      }
      return isANumber
    },

    calculate: () => {
      let parsedData: IGranulometriaParsed[] = []
      if (
        get().checkInputData() ||
        get().checkNoDuplicates() ||
        get().checkAtLeastOneMeshIsNotZero()
      ) {
        parsedData = get().casting()
      }

      const granulometria = new CLassGranulometria()
      if (get().isThereLossMaterial && get().checkIfInitialWeightIsANumber()) {
        granulometria.corregirPeso(Number(get().initialWeight))
      }
      granulometria.corregirPeso()

      parsedData.map((e) => {
        granulometria.agregarMalla({
          malla: e.malla,
          abertura: e.abertura,
          pesoRetenido: e.pesoRetenido,
        })
      })

      set((state) => {
        state.results = granulometria.calcular()
      })

      return granulometria.calcular()
    },
  }))
)
//TODO: solicitar al usuario que el primer peso debe ser cero
