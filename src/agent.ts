import { argMax, randomChoice } from './utils'

export const createAgent = ({
  decay,
  decayInterval,
  environment,
  epsilon,
  iterations,
}: AgentProps): Agent => ({
  decay,
  decayInterval,
  environment,
  epsilon,
  iterations,
  act: (): LearningSummary => {
    const initArray = Array.from(
      { length: environment.nArms },
      (): number => 0.0
    )

    const qValues = [...initArray]

    const arm: Arm = {
      counts: [...initArray],
      rewards: [...initArray],
    }

    const rewards = []

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

      if (decayInterval && decay && i % decayInterval === 0) {
        epsilon *= 1 - decay
      }
    }

    return { arm, qValues, rewards }
  },
})
