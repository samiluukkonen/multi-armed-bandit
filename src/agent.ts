import { argMax, initArray, randomChoice, sum } from './utils'

export type StrategyType =
  | 'epsilon-decreasing'
  | 'epsilon-first'
  | 'epsilon-greedy'
  | 'random'
  | 'softmax'
  | 'ucb1'

interface BaseAgentProps {
  environment: Environment
  iterations: number
}

interface SoftmaxAgentProps extends BaseAgentProps {
  tau: number
}

interface EpsilonFirstAgentProps extends BaseAgentProps {
  exploration: number
}

interface EpsilonGreedyAgentProps extends BaseAgentProps {
  epsilon: number
}

interface EpsilonDecreasingAgentProps extends EpsilonGreedyAgentProps {
  decay?: number
  decayInterval?: number
}

interface Agent {
  act: () => LearningSummary
}

const initializeLearningSummary = (length: number): LearningSummary => {
  const initializedArray = initArray(length)

  const qValues = [...initializedArray]

  const arm: Arm = {
    counts: [...initializedArray],
    rewards: [...initializedArray],
  }

  const armOrder: number[] = []
  const rewards: number[] = []

  return { arm, armOrder, qValues, rewards }
}

export const createRandomAgent = ({
  environment,
  iterations,
}: BaseAgentProps): BaseAgentProps & Agent => ({
  environment,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    for (let i = 1; i <= iterations; i++) {
      const chosenArm = randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] = arm.rewards[chosenArm] / arm.counts[chosenArm]

      armOrder.push(chosenArm)
      rewards.push(reward)
    }

    return { arm, armOrder, qValues, rewards }
  },
})

export const createEpsilonFirstAgent = ({
  environment,
  exploration,
  iterations,
}: EpsilonFirstAgentProps): EpsilonFirstAgentProps & Agent => ({
  environment,
  exploration,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    for (let i = 1; i <= iterations; i++) {
      const chosenArm =
        i > exploration ? argMax(qValues) : randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] =
        qValues[chosenArm] +
        (reward - qValues[chosenArm]) / arm.counts[chosenArm]

      armOrder.push(chosenArm)
      rewards.push(reward)
    }

    return { arm, armOrder, qValues, rewards }
  },
})

export const createEpsilonGreedyAgent = ({
  environment,
  epsilon,
  iterations,
}: EpsilonGreedyAgentProps): EpsilonGreedyAgentProps & Agent => ({
  environment,
  epsilon,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    for (let i = 1; i <= iterations; i++) {
      const chosenArm =
        Math.random() > epsilon
          ? argMax(qValues)
          : randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] =
        qValues[chosenArm] +
        (reward - qValues[chosenArm]) / arm.counts[chosenArm]

      armOrder.push(chosenArm)
      rewards.push(reward)
    }

    return { arm, armOrder, qValues, rewards }
  },
})

export const createEpsilonDecreasingAgent = ({
  decay,
  decayInterval,
  environment,
  epsilon,
  iterations,
}: EpsilonDecreasingAgentProps): EpsilonDecreasingAgentProps & Agent => ({
  decay,
  decayInterval,
  environment,
  epsilon,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    const epsilons: number[] = [epsilon]
    let epsilonDecreasing = epsilon

    for (let i = 1; i <= iterations; i++) {
      const chosenArm =
        Math.random() > epsilonDecreasing
          ? argMax(qValues)
          : randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] =
        qValues[chosenArm] +
        (reward - qValues[chosenArm]) / arm.counts[chosenArm]

      armOrder.push(chosenArm)
      rewards.push(reward)

      if (decayInterval && decay && i % decayInterval === 0) {
        epsilonDecreasing =
          Math.round(
            (epsilonDecreasing * (1 - decay) + Number.EPSILON) * 1000
          ) / 1000
      }

      epsilons.push(epsilonDecreasing)
    }

    return { arm, armOrder, qValues, rewards, epsilons }
  },
})

export const createSoftmaxAgent = ({
  environment,
  tau,
  iterations,
}: SoftmaxAgentProps): SoftmaxAgentProps & Agent => ({
  environment,
  tau,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    for (let i = 1; i <= iterations; i++) {
      const values = qValues.map((value: number): number =>
        Math.exp(value / tau)
      )
      const summedValues = sum(values)
      const softmaxValues = values.map((value: number) => value / summedValues)

      const random = Math.random()
      const foundArmIndex = softmaxValues.findIndex(
        (value: number) => value > random
      )

      const chosenArm =
        foundArmIndex > -1 ? foundArmIndex : randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1

      qValues[chosenArm] =
        qValues[chosenArm] +
        (reward - qValues[chosenArm]) / arm.counts[chosenArm]

      armOrder.push(chosenArm)
      rewards.push(reward)
    }

    return { arm, armOrder, qValues, rewards }
  },
})

export const createUCB1Agent = ({
  environment,
  iterations,
}: BaseAgentProps): BaseAgentProps & Agent => ({
  environment,
  iterations,
  act: (): LearningSummary => {
    const { arm, armOrder, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )

    const condifenceIntervals = Array.from({
      length: iterations,
    }).map(() =>
      Array.from({ length: environment.nArms }).map(
        (): ConfidenceInterval => ({ max: 0, min: 0 })
      )
    )

    const calculateConfidenceIntervals = ({
      iteration,
    }: {
      iteration: number
    }): void => {
      for (let nthArm = 0; nthArm < environment.nArms; nthArm++) {
        const avgReward =
          arm.rewards[nthArm] / (arm.counts[nthArm] + Number.EPSILON)
        const confidence = Math.sqrt(
          (3 * Math.log(iteration)) / (2 * arm.counts[nthArm] + Number.EPSILON)
        )
        condifenceIntervals[iteration - 1][nthArm] = {
          max: avgReward + confidence,
          min: avgReward - confidence,
        }
      }
    }

    for (let i = 1; i <= iterations; i++) {
      const items: number[] = Array.from({ length: environment.nArms })
        .fill(0)
        .map(
          (_, index: number): number =>
            qValues[index] +
            Math.sqrt((2 * Math.log(i)) / (1 + arm.counts[index]))
        )

      const chosenArm = argMax(items)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] =
        qValues[chosenArm] +
        (reward - qValues[chosenArm]) / arm.counts[chosenArm]

      calculateConfidenceIntervals({ iteration: i })

      armOrder.push(chosenArm)
      rewards.push(reward)
    }

    return { arm, armOrder, qValues, rewards, condifenceIntervals }
  },
})
