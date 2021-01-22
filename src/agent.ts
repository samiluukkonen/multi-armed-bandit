import { argMax, initArray, randomChoice } from './utils'

interface EpsilonGreedyAgentProps {
  environment: Environment
  epsilon: number
  iterations: number
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

  const rewards: number[] = []

  return { arm, qValues, rewards }
}

export const createEpsilonGreedyAgent = ({
  environment,
  epsilon,
  iterations,
}: EpsilonGreedyAgentProps): EpsilonGreedyAgentProps & Agent => ({
  environment,
  epsilon,
  iterations,
  act: (): LearningSummary => {
    const { arm, qValues, rewards } = initializeLearningSummary(
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
      qValues[chosenArm] = arm.rewards[chosenArm] / arm.counts[chosenArm]

      rewards.push(reward)
    }

    return { arm, qValues, rewards }
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
    const { arm, qValues, rewards } = initializeLearningSummary(
      environment.nArms
    )
    let epsilonDecreasing = epsilon

    for (let i = 1; i <= iterations; i++) {
      const chosenArm =
        Math.random() > epsilonDecreasing
          ? argMax(qValues)
          : randomChoice(environment.nArms)
      const reward = environment.reward(chosenArm)

      arm.rewards[chosenArm] += reward
      arm.counts[chosenArm] += 1
      qValues[chosenArm] = arm.rewards[chosenArm] / arm.counts[chosenArm]

      rewards.push(reward)

      if (decayInterval && decay && i % decayInterval === 0) {
        epsilonDecreasing *= 1 - decay
      }
    }

    return { arm, qValues, rewards }
  },
})
