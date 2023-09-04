'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGranulometriaStore } from './logic/store'
import { IGranulometriaInput } from './types/granulometria-types'
import { useEffect, useLayoutEffect } from 'react'
import { Input } from '@/components/ui/input'
import TH1 from '@/components/typography/typography-h1'
import Chart from './components/Chart'
import { Button } from '@/components/ui/button'
import TP from '@/components/typography/typography-p'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface Props {
  initialData: IGranulometriaInput[]
}

const Granulometria = ({ initialData }: Props) => {
  const router = useRouter()
  //supabase
  const supabase = createClientComponentClient()
  //propio
  const stringData = useGranulometriaStore((state) => state.stringData)
  const update_data = useGranulometriaStore((state) => state.update_data)
  const calculate = useGranulometriaStore((state) => state.calculate)
  const toggleLossMaterial = useGranulometriaStore(
    (state) => state.toggleLossMaterial
  )
  const setLossMaterial = useGranulometriaStore(
    (state) => state.setLossMaterial
  )

  const initialWeight = useGranulometriaStore((state) => state.initialWeight)

  const isThereLossMaterial = useGranulometriaStore(
    (state) => state.isThereLossMaterial
  )
  const results = useGranulometriaStore((state) => state.results)

  const errors = useGranulometriaStore((state) => state.errors)

  // console.log(initialData)
  useLayoutEffect(() => {
    update_data(initialData)
    calculate()
  }, [calculate, initialData, update_data])

  // console.log(results)

  const dataForChart = results.arrayProcessed.map((e, i) => ({
    name: e.malla,
    x: e.abertura,
    y: e.pasante,
  }))

  const numberDecimals = 3

  const handleSubmit = async () => {
    const { data } = await supabase.auth.getSession()

    const obj = {
      data: stringData,
      user_id: data?.session?.user?.id,
    }

    const res = await fetch(
      'http://localhost:3000/api/programs/granulometria',
      {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const json = await res.json()
    if (json.error) {
      console.log(json.error)
    }
    if (json.data) {
      console.log(json.data)
      router.push(`/programs/granulometria/${json.data.id}`)
    }
  }

  return (
    <div className="flex flex-col gap-y-6 my-6">
      <TH1>Granulometría</TH1>
      <Table className="w-fit relative overflow-auto bg-primary-foreground">
        {/* <TableCaption>Tabla de granulometría</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 break-words text-center">
              Agregar tamiz
            </TableHead>
            <TableHead className="w-16 break-words text-center">
              Quitar tamiz
            </TableHead>
            <TableHead className="w-28 break-words text-center">
              Tamiz
            </TableHead>
            <TableHead className="w-28 break-words text-center">
              Abertura
            </TableHead>
            <TableHead className="w-28 break-words text-center">
              Peso retenido
            </TableHead>
            {isThereLossMaterial && (
              <TableHead className="w-28 break-words text-center">
                Peso corregido
              </TableHead>
            )}
            <TableHead className="w-28 break-words text-center">
              %Peso retenido
            </TableHead>
            <TableHead className="w-28 break-words text-center">
              %Peso retenido acumulado
            </TableHead>
            <TableHead className="w-28 break-words text-center">
              % Pasante
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.arrayProcessed.map((e, i) => (
            <TableRow key={i}>
              <TableCell className="text-center font-bold text-xl">+</TableCell>
              <TableCell className="text-center font-bold text-xl">-</TableCell>
              <TableCell className="text-right">{e.malla}</TableCell>
              <TableCell className="text-right">{e.abertura}</TableCell>
              <TableCell className="text-right">
                {e.pesoRetenido.toFixed(numberDecimals)}
              </TableCell>
              {isThereLossMaterial && (
                <TableCell className="text-right">
                  {e.pesoCorregido.toFixed(numberDecimals)}
                </TableCell>
              )}
              <TableCell className="text-right">
                {e.retenido.toFixed(numberDecimals)}
              </TableCell>
              <TableCell className="text-right">
                {e.retenidoAcumulado.toFixed(numberDecimals)}
              </TableCell>
              <TableCell className="text-right">
                {e.pasante.toFixed(numberDecimals)}
              </TableCell>
            </TableRow>
          ))}
          {/* <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>

      {/* errores */}
      <div>
        {errors.map((e, i) => (
          <span key={i} className="text-destructive block">
            {e.message}
          </span>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <div className="flex w-fit gap-x-4">
            <span>Hay perdida de material?</span>
            <input
              type="checkbox"
              className=""
              checked={isThereLossMaterial}
              onChange={() => toggleLossMaterial()}
            />
          </div>
          {isThereLossMaterial && (
            <div className="flex w-fit gap-x-4 items-center">
              <span>¿Cuánto era el peso inicial?</span>
              <Input
                type="text"
                placeholder="peso inicial"
                className="w-32"
                value={initialWeight}
                onChange={(e) => {
                  setLossMaterial(e.target.value)
                }}
              />
            </div>
          )}
        </div>
        <Button onClick={() => calculate()}>Calcular</Button>
        <Button onClick={() => handleSubmit()}>Guardar</Button>
      </div>

      <div className="">
        {/*grafico */}
        <Chart dataForChart={dataForChart} />
      </div>
      <div>
        <TP>Coeficientes:</TP>
        <Table className="w-64">
          <TableBody>
            <TableRow>
              <TableCell>D10</TableCell>
              <TableCell>{results.utils.d10.toFixed(numberDecimals)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>D30</TableCell>
              <TableCell>{results.utils.d30.toFixed(numberDecimals)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>D60</TableCell>
              <TableCell>{results.utils.d60.toFixed(numberDecimals)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CC</TableCell>
              <TableCell>{results.utils.cc.toFixed(numberDecimals)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CU</TableCell>
              <TableCell>{results.utils.cu.toFixed(numberDecimals)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Granulometria
