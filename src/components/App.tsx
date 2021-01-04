import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { createAgent } from '../agent'
import { createEnvironment } from '../environment'
import './App.css'
import DecayInput from './DecayInput'
import EpsilonInput from './EpsilonInput'
import ProbabilityInput from './ProbabilityInput'
import RewardInput from './RewardInput'
import Summary from './Summary'

const NR_ARMS = 5

const App: React.FC = () => {
  const [decay, setDecay] = useState<number>(0.0)
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
        decay,
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

  const handleChangeReward = useCallback(
    (event: ChangeEvent<HTMLInputElement>, arm: number): void => {
      const value = parseInt(event.target.value)

      const newRewards = [...rewards]
      newRewards[arm] = value

      setRewards(newRewards)
    },
    [rewards]
  )

  const handleChangeProbability = useCallback(
    (event: ChangeEvent<HTMLInputElement>, arm: number): void => {
      const newProbabilities = [...rewardProbabilities]
      newProbabilities[arm] = Number(event.target.value)

      setRewardProbabilities(newProbabilities)
    },
    [rewardProbabilities]
  )

  const handleClickLearn = useCallback(() => {
    console.log(rewards)

    setIsDisabled(true)
    setSummary(undefined)
    setEnvironment(undefined)

    const env = createEnvironment(rewardProbabilities, rewards)

    setEnvironment(env)
  }, [rewardProbabilities, rewards])

  const handleChangeEpsilon = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEpsilon(Number(event.target.value))
    },
    []
  )

  const handleChangeDecay = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDecay(Number(event.target.value))
    },
    []
  )

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
      <div className="settings-container">
        <EpsilonInput onChange={handleChangeEpsilon} value={epsilon} />
        <DecayInput onChange={handleChangeDecay} value={decay} />
      </div>
      <button
        className="learn"
        disabled={isDisabled}
        onClick={handleClickLearn}
      >
        Learn
      </button>
      {summary && <Summary summary={summary} />}
    </div>
  )
}

export default App
