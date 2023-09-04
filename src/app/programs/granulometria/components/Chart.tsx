import { Component } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts'

import { scaleLog } from 'd3-scale'
const scale = scaleLog().base(Math.E)

interface IDataChart {
  name: string
  x: number
  y: number
}

interface Props {
  dataForChart: IDataChart[]
}

const CustomAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  )
}

const Chart = ({ dataForChart: data }: Props) => {
  return (
    <div className="">
      <LineChart
        width={900}
        height={400}
        data={data}
        margin={{ top: 15, right: 20, bottom: 15, left: 0 }}
      >
        <Line type="monotone" dataKey="y" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        {/* scale={scale} */}
        <XAxis
          type="number"
          dataKey="x"
          scale={scale}
          domain={[0.000001, 100]}
          orientation="bottom"
          reversed
          tick={<CustomAxisTick />}
          // ticks={[0.01, 0.1, 1, 10, 100]}
          ticks={[0.00001, 0.0001, 0.001, 0.01, 0.1, 1, 10, 100]}
        />
        <YAxis type="number" dataKey="y" domain={[0, 100]} />
        <Tooltip />
      </LineChart>
    </div>
  )
}

export default Chart
