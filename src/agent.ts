import { argMax, initArray, randomChoice, sum } from './utils'

export type StrategyType =
  | 'epsilon-decreasing'
  | 'epsilon-greedy'
  | 'random'
  | 'softmax'

interface BaseAgentProps {
  environment: Environment
  iterations: number
}

interface SoftmaxAgentProps extends BaseAgentProps {
  tau: number
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
        epsilonDecreasing *= 1 - decay
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
