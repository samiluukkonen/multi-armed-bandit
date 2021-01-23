import { ResponsiveBar } from '@nivo/bar'
import React, { FC } from 'react'
import { sum } from '../utils'

interface SummaryProps {
  summary: LearningSummary
}

const resolveCountData = (arm: Arm) => {
  return arm.counts.map((count: number, index: number) => {
    return {
      arm: `Arm ${index}`,
      count,
    }
  })
}

const countBar = (arm: Arm) => (
  <ResponsiveBar
    data={resolveCountData(arm)}
    indexBy="arm"
    keys={['count']}
    margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
  />
)

const Summary: FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="summary-count">
      <span className="summary-count-title">
        How many times each arm was triggered
      </span>
      {countBar(summary.arm)}
      <div className="total-reward">
        Total reward: {sum(summary.arm.rewards)}
      </div>
    </div>
  )
}

export default Summary
