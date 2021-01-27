type RewardProbabilities = number[]
type Rewards = number[]

interface Environment {
  reward: (arm: number) => number
  nArms: number
  rewardProbabilities: RewardProbabilities
  rewards: number[]
}

interface Arm {
  counts: number[]
  rewards: number[]
}

interface LearningSummary {
  epsilons?: number[]
  arm: Arm
  qValues: number[]
  rewards: number[]
}
