import React, { ChangeEvent, FC } from 'react'

interface ProbabilityProps {
  arm: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>, arm: number) => void
  value: number
}

const ProbabilityInput: FC<ProbabilityProps> = ({ arm, onChange, value }) => {
  return (
    <>
      <label htmlFor={`reward-probability-${arm}`}>Reward probability</label>
      <input
        defaultValue={value}
        id={`reward-probability-${arm}`}
        max={1.0}
        min={0.0}
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          onChange(event, arm)
        }
        step={0.1}
        type="range"
      />
      <span>{value * 100}%</span>
    </>
  )
}

export default ProbabilityInput
