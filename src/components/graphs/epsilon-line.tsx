import React from 'react'
import { ResponsiveLine } from '@nivo/line'

const resolveEpsilonData = (
  epsilons: number[]
): {
  id: string
  data: {
    x: number
    y: number
  }[]
}[] => [
  {
    id: 'epsilon',
    data: epsilons.map((epsilon: number, index: number) => ({
      x: index,
      y: epsilon,
    })),
  },
]

export const epsilonLine = (epsilons: number[]): JSX.Element => (
  <ResponsiveLine
    data={resolveEpsilonData(epsilons)}
    margin={{ top: 50, right: 40, bottom: 50, left: 80 }}
    xScale={{ type: 'linear' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'iterations',
      legendOffset: 36,
      legendPosition: 'middle',
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'epsilon',
      legendOffset: -60,
      legendPosition: 'middle',
    }}
    enableGridX={false}
    enablePoints={false}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
  />
)
