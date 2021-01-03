type RewardProbabilities = number[]
type Rewards = number[]

interface Environment {
  reward: (arm: number) => number
  nArms: number
  rewardProbabilities: RewardProbabilities
  rewards: number[]
}

interface AgentProps {
  decay?: number
  decayInterval?: number
  environment: Environment
  epsilon: number
  iterations: number
}

interface Agent extends AgentProps {
  act: () => LearningSummary
}

interface Arm {
  counts: number[]
  rewards: number[]
}

interface LearningSummary {
  arm: Arm
  qValues: number[]
  rewards: number[]
}
