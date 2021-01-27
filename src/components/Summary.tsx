import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { NodeProps, ResponsiveScatterPlot } from '@nivo/scatterplot'
import React, { FC } from 'react'
import { sum } from '../utils'

interface SummaryProps {
  summary: LearningSummary
}

interface LineDataPoint {
  x: number
  y: string
}

const resolveCountBarData = (arm: Arm) =>
  arm.counts.map((count: number, index: number) => ({
    arm: `Arm ${index}`,
    count,
    reward: arm.rewards[index],
  }))

const countBar = (arm: Arm) => (
  <ResponsiveBar
    colors={{ scheme: 'category10' }}
    // @ts-expect-error no such prop
    colorBy="index"
    data={resolveCountBarData(arm)}
    defs={[
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: '#eed312',
        rotation: -45,
        lineWidth: 6,
        spacing: 7,
      },
    ]}
    fill={[
      {
        match: {
          id: 'reward',
        },
        id: 'lines',
      },
    ]}
    groupMode="grouped"
    indexBy="arm"
    keys={['count', 'reward']}
    labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 20,
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
    margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
  />
)

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
) =>
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

const countScatterPlot = (arm: Arm, armOrder: number[], rewards: number[]) => (
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

const resolveEpsilonData = (epsilons: number[]) => [
  {
    id: 'epsilon',
    data: epsilons.map((epsilon: number, index: number) => ({
      x: index,
      y: epsilon,
    })),
  },
]

const epsilonLine = (epsilons: number[]) => (
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

const Summary: FC<SummaryProps> = ({ summary }) => {
  return (
    <>
      <div className="summary-count">
        <span className="summary-count-title">
          How many times each arm was triggered
        </span>
        {countBar(summary.arm)}
        <div className="total-reward">
          Total reward: {sum(summary.arm.rewards)}
        </div>
      </div>
      <div className="summary-order">
        {countScatterPlot(summary.arm, summary.armOrder, summary.rewards)}
      </div>
      <div className="summary-epsilon">
        {summary.epsilons && epsilonLine(summary.epsilons)}
      </div>
    </>
  )
}

export default Summary
