import classNames from 'classnames'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  createEpsilonDecreasingAgent,
  createEpsilonFirstAgent,
  createEpsilonGreedyAgent,
  createRandomAgent,
  // createSoftmaxAgent,
  createThompsonSamplingAgent,
  createUCB1Agent,
  PolicyType,
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
// import TauInput from './inputs/TauInput'

const NR_ARMS = 3

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
  // const [tau, setTau] = useState<number>(0.1)
  const [policy, setPolicy] = useState<PolicyType>('epsilon-greedy')
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

    switch (policy) {
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
      // case 'softmax':
      //   return createSoftmaxAgent({ environment, iterations, tau })
      case 'thompson-sampling':
        return createThompsonSamplingAgent({ environment, iterations })
      case 'ucb1':
        return createUCB1Agent({ environment, iterations })
      default:
        return undefined
    }
  }

  const resolveEpsilon = (): number => {
    switch (policy) {
      case 'epsilon-greedy':
        return epsilonGreedy
      case 'epsilon-decreasing':
        return epsilonDecreasing
      default:
        return 0
    }
  }

  const resolveUpdateEpsilon = (value: number): void => {
    switch (policy) {
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
    [policy]
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

  const handleClickPolicy = useCallback((policyType: PolicyType): void => {
    setPolicy(policyType)
  }, [])

  // const handleChangeTau = useCallback(
  //   (event: ChangeEvent<HTMLInputElement>): void => {
  //     setTau(Number(event.target.value))
  //   },
  //   []
  // )

  const isEpsilonDecreasing = policy === 'epsilon-decreasing'
  const isEpsilonFirst = policy === 'epsilon-first'
  const isEpsilonGreedy = policy === 'epsilon-greedy'
  const isRandom = policy === 'random'
  // const isSoftmax = policy === 'softmax'
  const isUCB1 = policy === 'ucb1'
  const isThompsonSampling = policy === 'thompson-sampling'

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
      <label className="policies-label" htmlFor="policies-container">
        Policies
      </label>
      <div className="policies-container" id="policies-container">
        <fieldset
          className={classNames('policy random', {
            active: isRandom,
          })}
          onClick={() => handleClickPolicy('random')}
        >
          <legend className="name">Random</legend>
          <p>Randomly choose different arm everytime.</p>
        </fieldset>
        <fieldset
          className={classNames('policy epsilon-first', {
            active: isEpsilonFirst,
          })}
          onClick={() => handleClickPolicy('epsilon-first')}
        >
          <legend className="name">&epsilon;-first</legend>
          <div className="policy-settings">
            <EpsilonFirstInput
              disabled={policy !== 'epsilon-first'}
              onChange={handleChangeExploration}
              value={exploration}
            />
          </div>
          <p>
            A pure exploration phase is followed by a pure exploitation phase.
          </p>
        </fieldset>
        <fieldset
          className={classNames('policy epsilon-greedy', {
            active: isEpsilonGreedy,
          })}
          onClick={() => handleClickPolicy('epsilon-greedy')}
        >
          <legend className="name">&epsilon;-greedy</legend>
          <div className="policy-settings">
            <EpsilonInput
              disabled={policy !== 'epsilon-greedy'}
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
          className={classNames('policy epsilon-decreasing', {
            active: isEpsilonDecreasing,
          })}
          onClick={() => handleClickPolicy('epsilon-decreasing')}
        >
          <legend className="name">&epsilon;-decreasing</legend>
          <div className="policy-settings">
            <EpsilonInput
              disabled={policy !== 'epsilon-decreasing'}
              onChange={handleChangeEpsilon}
              value={epsilonDecreasing}
            />
            <DecayInput
              disabled={policy !== 'epsilon-decreasing'}
              onChange={handleChangeDecay}
              value={decay}
            />
            <DecayIntervalInput
              disabled={policy !== 'epsilon-decreasing'}
              onChange={handleChangeDecayInterval}
              value={decayInterval}
            />
          </div>
          <p>
            Similar to the epsilon-greedy policy, except that the value of
            &epsilon; decreases as the experiment progresses, resulting in
            highly explorative behaviour at the start and highly exploitative
            behaviour at the finish.
          </p>
        </fieldset>
        {/* <fieldset
          className={classNames('policy softmax', {
            active: isSoftmax,
          })}
          onClick={() => handleClickPolicy('softmax')}
        >
          <legend className="name">Softmax</legend>
          <div className="policy-settings">
            <TauInput
              disabled={policy !== 'softmax'}
              onChange={handleChangeTau}
              value={tau}
            />
          </div>
        </fieldset> */}
        <fieldset
          className={classNames('policy ucb1', {
            active: isUCB1,
          })}
          onClick={() => handleClickPolicy('ucb1')}
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
        <fieldset
          className={classNames('policy thompson-sampling', {
            active: isThompsonSampling,
          })}
          onClick={() => handleClickPolicy('thompson-sampling')}
        >
          <legend className="name">Thompson Sampling</legend>
          <p>
            Thompson Sampling is also known as probability matching policy, or
            Bayesian Bandit.
          </p>
          <p>
            Probability matching policies reflect the idea that the number of
            actions taken for a given action should match its actual probability
            of being the optimal action.
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
