import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import React, { FC } from 'react'
import { sum } from '../utils'

interface SummaryProps {
  summary: LearningSummary
}

const resolveCountData = (arm: Arm) =>
  arm.counts.map((count: number, index: number) => ({
    arm: `Arm ${index}`,
    count,
  }))

const countBar = (arm: Arm) => (
  <ResponsiveBar
    data={resolveCountData(arm)}
    indexBy="arm"
    keys={['count']}
    margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
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
    yFormat=" >-.2f"
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
      <div className="summary-epsilon">
        {summary.epsilons && epsilonLine(summary.epsilons)}
      </div>
    </>
  )
}

export default Summary
