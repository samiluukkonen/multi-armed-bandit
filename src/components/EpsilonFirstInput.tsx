import React, { ChangeEvent, FC } from 'react'

interface EpsilonFirstInputProps {
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const EpsilonFirstInput: FC<EpsilonFirstInputProps> = ({
  disabled,
  onChange,
  value,
}) => {
  return (
    <div className="epsilon-input-container">
      <div className="epsilon-input-container">
        <label htmlFor={`epsilon-first-input`}>
          Exploration phase
          <p>How many iterations we do pure exploration before exploitation</p>
        </label>
        <input
          className="epsilon-input"
          disabled={!!disabled}
          id={`epsilon-first-input`}
          max={1000}
          min={0}
          onChange={onChange}
          step={100}
          type="range"
          value={value}
        />
        <span className="epsilon-input-value">{value}</span>
      </div>
    </div>
  )
}

export default EpsilonFirstInput
