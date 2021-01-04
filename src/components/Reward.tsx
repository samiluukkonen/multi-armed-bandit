import React, { ChangeEvent } from 'react'

interface RewardProps {
  arm: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>, arm: number) => void
  value: number
}

const Reward: React.FC<RewardProps> = ({ arm, onChange, value }) => {
  return (
    <>
      <label htmlFor={`reward-input-${arm}`}>Arm {arm} reward value</label>
      <input
        className="reward-input"
        id={`reward-input-${arm}`}
        max={9}
        min={0}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event, arm)
        }
        step={1}
        type="range"
        value={value}
      />
      <span className="reward-input-value">{value}</span>
    </>
  )
}

export default Reward
