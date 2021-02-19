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

interface ConfidenceInterval {
  max: number
  min: number
}

interface LearningSummary {
  arm: Arm
  armOrder: number[]
  condifenceIntervals?: ConfidenceInterval[][]
  epsilons?: number[]
  qValues: number[]
  rewards: number[]
}
