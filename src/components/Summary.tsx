import React, { FC } from 'react'

interface SummaryProps {
  summary: LearningSummary
}

const Summary: FC<SummaryProps> = ({ summary }) => {
  return (
    <div className="summary">
      <span>How many times each arm was triggered</span>
      <div className="arm-counts">
        {summary.arm.counts.map((count: number, arm: number) => (
          <div className="arm-count" key={`arm-count-${arm}`}>
            <span className="arm-count-title">Arm {arm}</span>: {count}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Summary
