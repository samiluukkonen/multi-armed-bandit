import React, { FC } from 'react'
import classNames from 'classnames'
import { sum } from '../utils'
import { confidenceIntervalStream } from './graphs/confidence-interval-stream'
import { countBar } from './graphs/count-bar'
import { countScatterPlot } from './graphs/count-scatter-plot'
import { epsilonLine } from './graphs/epsilon-line'

interface SummaryProps {
  summary: LearningSummary
}

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
        <span className="summary-order-title">
          The order where amrs were chosen
          <ul className="summary-order-explanation">
            <li className="empty">Triggered with no reward</li>
            <li className="full">Triggered with reward</li>
          </ul>
        </span>
        {countScatterPlot(summary.arm, summary.armOrder, summary.rewards)}
      </div>
      <div
        className={classNames('summary-epsilon', {
          hidden: !summary.epsilons,
        })}
      >
        {summary.epsilons && (
          <>
            <span className="summary-epsilon-title">Epsilon decay</span>
            {epsilonLine(summary.epsilons)}
          </>
        )}
      </div>
      {summary.condifenceIntervals && (
        <div className="summary-confidence-intervals">
          <span className="summary-confidence-intervals-title">
            Confidence interval
          </span>
          {confidenceIntervalStream(summary.condifenceIntervals)}
        </div>
      )}
    </>
  )
}

export default Summary
