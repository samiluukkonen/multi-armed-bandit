export const createEnvironment = (
  rewardProbabilities: RewardProbabilities,
  rewards: Rewards
): Environment => ({
  reward: (arm: number): number => {
    if (Math.random() > rewardProbabilities[arm]) {
      return 0
    }

    return rewards[arm]
  },
  nArms: rewards.length,
  rewardProbabilities,
  rewards,
})
