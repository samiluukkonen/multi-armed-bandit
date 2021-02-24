import classNames from 'classnames'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  createEpsilonDecreasingAgent,
  createEpsilonFirstAgent,
  createEpsilonGreedyAgent,
  createRandomAgent,
  createSoftmaxAgent,
  createUCB1Agent,
  StrategyType,
} from '../agent'
import { createEnvironment } from '../environment'
import './App.css'
import DecayInput from './inputs/DecayInput'
import DecayIntervalInput from './inputs/DecayIntervalInput'
import EpsilonInput from './inputs/EpsilonInput'
import EpsilonFirstInput from './inputs/EpsilonFirstInput'
import IterationsInput from './inputs/IterationsInput'
import ProbabilityInput from './inputs/ProbabilityInput'
import RewardInput from './inputs/RewardInput'
import Summary from './Summary'
import TauInput from './inputs/TauInput'

const NR_ARMS = 5

const App: React.FC = () => {
  const [decay, setDecay] = useState<number>(0.0)
  const [decayInterval, setDecayInterval] = useState<number>(0)
  const [environment, setEnvironment] = useState<Environment>()
  const [exploration, setExploration] = useState<number>(100)
  const [epsilonGreedy, setEpsilonGreedy] = useState<number>(0.1)
  const [epsilonDecreasing, setEpsilonDecreasing] = useState<number>(0.1)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [iterations, setIterations] = useState<number>(150)
  const [rewardProbabilities, setRewardProbabilities] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (): number => 0.2)
  )
  const [rewards, setRewards] = useState<number[]>(
    Array.from({ length: NR_ARMS }, (_, n): number => n)
  )
  const [tau, setTau] = useState<number>(0.1)
  const [strategy, setStrategy] = useState<StrategyType>('epsilon-greedy')
  const [summary, setSummary] = useState<LearningSummary>()

  useEffect(() => {
    if (environment) {
      const agent = resolveAgent(environment)

      if (!agent) {
        throw new Error('cannot resolve agent function')
      }

      const learningSummary = agent.act()

      setSummary(learningSummary)
      setIsDisabled(false)

      console.log(environment, learningSummary, agent)
    }
  }, [environment])

  const resolveAgent = (environment: Environment) => {
    const epsilon = resolveEpsilon()

    switch (strategy) {
      case 'epsilon-first':
        return createEpsilonFirstAgent({
          environment,
          exploration,
          iterations,
        })
      case 'epsilon-greedy':
        return createEpsilonGreedyAgent({
          environment,
          epsilon,
          iterations,
        })
      case 'epsilon-decreasing':
        return createEpsilonDecreasingAgent({
          decay,
          decayInterval,
          environment,
          epsilon,
          iterations,
        })
      case 'random':
        return createRandomAgent({ environment, iterations })
      case 'softmax':
        return createSoftmaxAgent({ environment, iterations, tau })
      case 'ucb1':
        return createUCB1Agent({ environment, iterations })
      default:
        return undefined
    }
  }

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

  const handleChangeExploration = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setExploration(Number(event.target.value))
    },
    []
  )

  const handleChangeDecay = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setDecay(Number(event.target.value))
    },
    []
  )

  const handleChangeDecayInterval = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setDecayInterval(Number(event.target.value))
    },
    []
  )

  const handleClickStrategy = useCallback(
    (strategyType: StrategyType): void => {
      setStrategy(strategyType)
    },
    []
  )

  const handleChangeTau = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setTau(Number(event.target.value))
    },
    []
  )

  const isEpsilonDecreasing = strategy === 'epsilon-decreasing'
  const isEpsilonFirst = strategy === 'epsilon-first'
  const isEpsilonGreedy = strategy === 'epsilon-greedy'
  const isRandom = strategy === 'random'
  const isSoftmax = strategy === 'softmax'
  const isUCB1 = strategy === 'ucb1'

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
            <fieldset
              className="arm-input-with-label"
              key={`arm-input-with-label--${arm}`}
            >
              <legend>Arm {arm}</legend>
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
            </fieldset>
          )
        })}
      </div>
      <fieldset className="settings-container" id="settings-container">
        <legend className="settings-label">Settings</legend>
        <IterationsInput onChange={handleChangeIterations} value={iterations} />
      </fieldset>
      <label className="strategies-label" htmlFor="strategies-container">
        Strategies
      </label>
      <div className="strategies-container" id="strategies-container">
        <fieldset
          className={classNames('strategy random', {
            active: isRandom,
          })}
          onClick={() => handleClickStrategy('random')}
        >
          <legend className="name">Random</legend>
          <p>Randomly choose different arm everytime.</p>
        </fieldset>
        <fieldset
          className={classNames('strategy epsilon-first', {
            active: isEpsilonFirst,
          })}
          onClick={() => handleClickStrategy('epsilon-first')}
        >
          <legend className="name">&epsilon;-first</legend>
          <div className="strategy-settings">
            <EpsilonFirstInput
              disabled={strategy !== 'epsilon-first'}
              onChange={handleChangeExploration}
              value={exploration}
            />
          </div>
          <p>
            A pure exploration phase is followed by a pure exploitation phase.
          </p>
        </fieldset>
        <fieldset
          className={classNames('strategy epsilon-greedy', {
            active: isEpsilonGreedy,
          })}
          onClick={() => handleClickStrategy('epsilon-greedy')}
        >
          <legend className="name">&epsilon;-greedy</legend>
          <div className="strategy-settings">
            <EpsilonInput
              disabled={strategy !== 'epsilon-greedy'}
              onChange={handleChangeEpsilon}
              value={epsilonGreedy}
            />
          </div>
          <p>
            The best arm is selected for a proportion 1 - &epsilon; of the
            trials, and a arm is selected at random for a proportion &epsilon;.
            A typical parameter value might be &epsilon; = 0.1.
          </p>
        </fieldset>
        <fieldset
          className={classNames('strategy epsilon-decreasing', {
            active: isEpsilonDecreasing,
          })}
          onClick={() => handleClickStrategy('epsilon-decreasing')}
        >
          <legend className="name">&epsilon;-decreasing</legend>
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
            <DecayIntervalInput
              disabled={strategy !== 'epsilon-decreasing'}
              onChange={handleChangeDecayInterval}
              value={decayInterval}
            />
          </div>
          <p>
            Similar to the epsilon-greedy strategy, except that the value of
            &epsilon; decreases as the experiment progresses, resulting in
            highly explorative behaviour at the start and highly exploitative
            behaviour at the finish.
          </p>
        </fieldset>
        <fieldset
          className={classNames('strategy softmax', {
            active: isSoftmax,
          })}
          onClick={() => handleClickStrategy('softmax')}
        >
          <legend className="name">Softmax</legend>
          <div className="strategy-settings">
            <TauInput
              disabled={strategy !== 'softmax'}
              onChange={handleChangeTau}
              value={tau}
            />
          </div>
        </fieldset>
        <fieldset
          className={classNames('strategy ucb1', {
            active: isUCB1,
          })}
          onClick={() => handleClickStrategy('ucb1')}
        >
          <legend className="name">UCB1</legend>
          <p>
            Upper confidence bound. Achieves regret that grows only
            logarithmically with the number of actions taken.
          </p>
          <p>
            Confidence bound grows with the total number of actions we have
            taken but shrinks with the number of times we have tried this
            particular action. This ensures each action is tried infinitely
            often but still balances exploration and exploitation.
          </p>
        </fieldset>
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
