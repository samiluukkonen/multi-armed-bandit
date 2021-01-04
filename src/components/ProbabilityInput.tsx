import React, { ChangeEvent, FC } from 'react'

interface ProbabilityInputProps {
  arm: number
  onChange: (event: ChangeEvent<HTMLInputElement>, arm: number) => void
  value: number
}

const ProbabilityInput: FC<ProbabilityInputProps> = ({
  arm,
  onChange,
  value,
}) => {
  return (
    <>
      <label htmlFor={`arm-input-probability-${arm}`}>Reward probability</label>
      <input
        defaultValue={value}
        id={`arm-input-probability-${arm}`}
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
