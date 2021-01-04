import React, { ChangeEvent, useEffect, useState } from 'react'
import { createAgent } from '../agent'
import { createEnvironment } from '../environment'
import './App.css'
import EpsilonInput from './EpsilonInput'
import ProbabilityInput from './ProbabilityInput'
import RewardInput from './RewardInput'
import Summary from './Summary'

const NR_ARMS = 5

const App: React.FC = () => {
  const [environment, setEnvironment] = useState<Environment>()
  const [epsilon, setEpsilon] = useState<number>(0.1)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [rewardProbabilities, setRewardProbabilities] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (): number => 0.2)
  )
  const [rewards, setRewards] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (_, n): number => n)
  )
  const [summary, setSummary] = useState<LearningSummary>()

  useEffect(() => {
    if (environment) {
      const epsilonGreedyAgent = createAgent({
        environment,
        epsilon,
        iterations: 1000,
      })

      const learningSummary = epsilonGreedyAgent.act()

      setSummary(learningSummary)
      setIsDisabled(false)

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

    setIsDisabled(true)
    setSummary(undefined)
    setEnvironment(undefined)

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
      <div className="arm-inputs">
        {Array.from({ length: NR_ARMS }).map((_, arm: number) => {
          return (
            <div
              className="arm-input-container"
              key={`arm-input-container-${arm}`}
            >
              <RewardInput
                arm={arm}
                onChange={handleChangeReward}
                value={rewards[arm]}
              />

              <ProbabilityInput
                arm={arm}
                onChange={handleChangeProbability}
                value={rewardProbabilities[arm]}
              />
            </div>
          )
        })}
      </div>
      <EpsilonInput onChange={handleChangeEpsilon} value={epsilon} />
      <button disabled={isDisabled} onClick={handleClickLearn}>
        Learn
      </button>
      {summary && <Summary summary={summary} />}
    </div>
  )
}

export default App
