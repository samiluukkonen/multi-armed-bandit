import classNames from 'classnames'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { createAgent } from '../agent'
import { createEnvironment } from '../environment'
import './App.css'
import DecayInput from './DecayInput'
import EpsilonInput from './EpsilonInput'
import IterationsInput from './IterationsInput'
import ProbabilityInput from './ProbabilityInput'
import RewardInput from './RewardInput'
import Summary from './Summary'

const NR_ARMS = 5

const App: React.FC = () => {
  const [decay, setDecay] = useState<number>(0.0)
  const [environment, setEnvironment] = useState<Environment>()
  const [epsilonGreedy, setEpsilonGreedy] = useState<number>(0.1)
  const [epsilonDecreasing, setEpsilonDecreasing] = useState<number>(0.1)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [iterations, setIterations] = useState<number>(1000)
  const [rewardProbabilities, setRewardProbabilities] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (): number => 0.2)
  )
  const [rewards, setRewards] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (_, n): number => n)
  )
  const [strategy, setStrategy] = useState<string>('epsilon-greedy')
  const [summary, setSummary] = useState<LearningSummary>()

  useEffect(() => {
    if (environment) {
      const epsilon = resolveEpsilon()

      const epsilonGreedyAgent = createAgent({
        decay,
        environment,
        epsilon,
        iterations,
      })

      const learningSummary = epsilonGreedyAgent.act()

      setSummary(learningSummary)
      setIsDisabled(false)

      console.log(environment, epsilonGreedyAgent.act())
    }
  }, [environment])

  const resolveEpsilon = (): number => {
    switch (strategy) {
      case 'epsilon-greedy':
        return epsilonGreedy
      case 'epsilon-decreasing':
        return epsilonDecreasing
      default:
        return 0
    }
  }

  const resolveUpdateEpsilon = (value: number): void => {
    switch (strategy) {
      case 'epsilon-greedy':
        setEpsilonGreedy(value)
        break
      case 'epsilon-decreasing':
        setEpsilonDecreasing(value)
        break
    }
  }

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

  const handleClickLearn = useCallback((): void => {
    console.log(rewards)

    setIsDisabled(true)
    setSummary(undefined)
    setEnvironment(undefined)

    const env = createEnvironment(rewardProbabilities, rewards)

    setEnvironment(env)
  }, [rewardProbabilities, rewards])

  const handleChangeIterations = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setIterations(Number(event.target.value))
    },
    []
  )

  const handleChangeEpsilon = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      resolveUpdateEpsilon(Number(event.target.value))
    },
    [strategy]
  )

  const handleChangeDecay = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setDecay(Number(event.target.value))
    },
    []
  )

  const handleClickStrategy = useCallback((value: string): void => {
    setStrategy(value)
  }, [])

  const resolveStrategyDescription = (): string => {
    switch (strategy) {
      case 'epsilon-greedy':
        return 'The best arm is selected for a proportion 1 - &epsilon; of the trials, and a arm is selected at random for a proportion &epsilon;. A typical parameter value might be &epsilon; = 0.1'
      case 'epsilon-decreasing':
        return 'Similar to the epsilon-greedy strategy, except that the value of &epsilon; decreases as the experiment progresses, resulting in highly explorative behaviour at the start and highly exploitative behaviour at the finish.'
      default:
        return ''
    }
  }

  const isEpsilonGreedy = strategy === 'epsilon-greedy'
  const isEpsilonDecreasing = strategy === 'epsilon-decreasing'

  return (
    <div className="content">
      <h1>Multi-armed bandit</h1>
      <p className="description">
        The arms provide rewards from a probability distribution. The objective
        of the agent is to maximize the sum of rewards earned through
        iterations.
      </p>
      <div className="arm-inputs">
        {Array.from({ length: NR_ARMS }).map((_, arm: number) => {
          return (
            <div
              className="arm-input-with-label"
              key={`arm-input-with-label--${arm}`}
            >
              <label htmlFor={`arm-input-container-${arm}`}>Arm {arm}</label>
              <div
                className="arm-input-container"
                id={`arm-input-container-${arm}`}
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
            </div>
          )
        })}
      </div>
      <label className="settings-label" htmlFor="settings-container">
        Settings
      </label>
      <div className="settings-container" id="settings-container">
        <IterationsInput onChange={handleChangeIterations} value={iterations} />
      </div>
      <label className="strategies-label" htmlFor="strategies-container">
        Strategies
      </label>
      <div className="strategies-container" id="strategies-container">
        <div
          className={classNames('strategy epsilon-greedy', {
            active: isEpsilonGreedy,
          })}
          onClick={() => handleClickStrategy('epsilon-greedy')}
        >
          <div className="name">&epsilon;-greedy</div>
          <div className="strategy-settings">
            <EpsilonInput
              disabled={strategy !== 'epsilon-greedy'}
              onChange={handleChangeEpsilon}
              value={epsilonGreedy}
            />
          </div>
        </div>
        <div
          className={classNames('strategy epsilon-decreasing', {
            active: isEpsilonDecreasing,
          })}
          onClick={() => handleClickStrategy('epsilon-decreasing')}
        >
          <div className="name">&epsilon;-decreasing</div>
          <div className="strategy-settings">
            <EpsilonInput
              disabled={strategy !== 'epsilon-decreasing'}
              onChange={handleChangeEpsilon}
              value={epsilonDecreasing}
            />
            <DecayInput
              disabled={strategy !== 'epsilon-decreasing'}
              onChange={handleChangeDecay}
              value={decay}
            />
          </div>
        </div>
      </div>
      <div
        className="strategy-description"
        dangerouslySetInnerHTML={{ __html: resolveStrategyDescription() }}
      ></div>
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
