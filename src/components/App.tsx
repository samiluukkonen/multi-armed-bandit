import React, { ChangeEvent, useEffect, useState } from 'react'
import { createAgent } from '../agent'
import { createEnvironment } from '../environment'
import './App.css'
import Reward from './Reward'

const NR_ARMS = 5

const App: React.FC = () => {
  const [environment, setEnvironment] = useState<Environment>()
  const [epsilon, setEpsilon] = useState<number>(0.1)
  const [summary, setSummary] = useState<LearningSummary>()
  const [rewardProbabilities, setRewardProbabilities] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (): number => 0.2)
  )
  const [rewards, setRewards] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (_, n): number => n)
  )

  useEffect(() => {
    if (environment) {
      const epsilonGreedyAgent = createAgent({
        environment,
        epsilon,
        iterations: 1000,
      })

      const learningSummary = epsilonGreedyAgent.act()

      setSummary(learningSummary)

      console.log(environment, epsilonGreedyAgent.act())
    }
  }, [environment])

  const handleChangeReward = (
    event: ChangeEvent<HTMLInputElement>,
    arm: number
  ): void => {
    const value = parseInt(event.target.value)

    const newRewards = [...rewards]
    newRewards[arm] = value

    setRewards(newRewards)
  }

  const handleChangeProbability = (
    event: ChangeEvent<HTMLInputElement>,
    arm: number
  ): void => {
    const newProbabilities = [...rewardProbabilities]
    newProbabilities[arm] = Number(event.target.value)

    setRewardProbabilities(newProbabilities)
  }

  const handleClickLearn = () => {
    console.log(rewards)

    const env = createEnvironment(rewardProbabilities, rewards)

    setEnvironment(env)
  }

  const handleChangeEpsilon = (event: ChangeEvent<HTMLInputElement>) => {
    setEpsilon(Number(event.target.value))
  }

  return (
    <div className="content">
      <h1>Multi-armed bandit</h1>
      <p className="reward-instructions">
        Give every arm a reward of value [0 - 9]
      </p>
      <div className="reward-inputs">
        {Array.from({ length: NR_ARMS }).map((_, arm: number) => {
          return (
            <div
              className="reward-input-container"
              key={`reward-input-container-${arm}`}
            >
              <Reward
                arm={arm}
                onChange={handleChangeReward}
                value={rewards[arm]}
              />

              <label htmlFor={`reward-probability-${arm}`}>
                Reward probability
              </label>
              <input
                defaultValue={rewardProbabilities[arm]}
                id={`reward-probability-${arm}`}
                max={1.0}
                min={0.0}
                onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                  handleChangeProbability(event, arm)
                }
                step={0.1}
                type="range"
              />
              <span>{rewardProbabilities[arm] * 100}%</span>
            </div>
          )
        })}
      </div>
      <div className="epsilon-input-container">
        <label htmlFor={`epsilon-input`}>
          Epsilon value. The percentage we explore new arms.
        </label>
        <input
          className="epsilon-input"
          id={`epsilon-input`}
          max={1.0}
          min={0.0}
          onChange={handleChangeEpsilon}
          step={0.1}
          type="range"
          value={epsilon}
        />
        <span className="reward-input-value">{epsilon * 100}%</span>
      </div>
      <button onClick={handleClickLearn}>Learn</button>
      {summary && (
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
      )}
    </div>
  )
}

export default App
