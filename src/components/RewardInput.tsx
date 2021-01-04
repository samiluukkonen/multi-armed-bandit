import React, { ChangeEvent, FC } from 'react'

interface RewardInputProps {
  arm: number
  onChange: (event: ChangeEvent<HTMLInputElement>, arm: number) => void
  value: number
}

const RewardInput: FC<RewardInputProps> = ({ arm, onChange, value }) => {
  return (
    <>
      <label htmlFor={`arm-input-reward-${arm}`}>Reward value</label>
      <input
        className="arm-input-reward"
        id={`arm-input-reward-${arm}`}
        max={9}
        min={0}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event, arm)
        }
        step={1}
        type="range"
        value={value}
      />
      <span className="arm-input-reward-value">{value}</span>
    </>
  )
}

export default RewardInput
