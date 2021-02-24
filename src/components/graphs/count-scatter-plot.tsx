import React from 'react'
import { NodeProps, ResponsiveScatterPlot } from '@nivo/scatterplot'

interface LineDataPoint {
  x: number
  y: string
}

const CustomNode = ({
  node,
  x,
  y,
  size,
  color,
  blendMode,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
}: NodeProps & {
  node: {
    data: {
      withoutReward?: boolean
    }
  }
}) => {
  if (node.data.withoutReward) {
    return (
      <g transform={`translate(${x},${y})`}>
        <circle
          fill="none"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          opacity={0.5}
          r={size / 2}
          stroke={color}
          strokeWidth={2}
          style={{ mixBlendMode: blendMode }}
        />
      </g>
    )
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <circle
        fill={color}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        r={size / 2}
        stroke={color}
        strokeWidth={2}
        style={{ mixBlendMode: blendMode }}
      />
    </g>
  )
}

const resolveCountLineData = (
  arm: Arm,
  armOrder: number[],
  rewards: number[]
): {
  id: string
  data: LineDataPoint[]
}[] =>
  arm.counts.map((_, armIndex: number) => ({
    id: `Arm ${armIndex}`,
    data: armOrder
      .map((_, index: number) => ({
        x: index,
        y: `${armIndex}`,
        withoutReward: rewards[index] === 0,
      }))
      .reduce(
        (prev: LineDataPoint[], curr: LineDataPoint, currentIndex: number) => {
          if (`${curr.y}` === `${armOrder[currentIndex]}`) {
            return [...prev, curr]
          }

          return prev
        },
        [] as LineDataPoint[]
      ),
  }))

export const countScatterPlot = (
  arm: Arm,
  armOrder: number[],
  rewards: number[]
): JSX.Element => (
  <ResponsiveScatterPlot
    data={resolveCountLineData(arm, armOrder, rewards)}
    nodeSize={5}
    animate={false}
    colors={{ scheme: 'category10' }}
    margin={{ top: 50, right: 120, bottom: 50, left: 10 }}
    xScale={{ type: 'linear', min: 0, max: 'auto' }}
    yScale={{ type: 'linear', min: -1, max: arm.counts.length }}
    blendMode="multiply"
    enableGridX={false}
    enableGridY={false}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'iteration',
      legendPosition: 'middle',
      legendOffset: 46,
    }}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 130,
        translateY: 0,
        itemWidth: 100,
        itemHeight: 12,
        itemsSpacing: 5,
        itemDirection: 'left-to-right',
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    renderNode={CustomNode}
  />
)
