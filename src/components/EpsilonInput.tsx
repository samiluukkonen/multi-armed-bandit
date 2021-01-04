import React, { ChangeEvent, FC } from 'react'

interface EpsilonInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const EpsilonInput: FC<EpsilonInputProps> = ({ onChange, value }) => {
  return (
    <div className="epsilon-input-container">
      <div className="epsilon-input-container">
        <label htmlFor={`epsilon-input`}>
          Epsilon value. The percentage we explore new arms.
        </label>
        <input
          className="epsilon-input"
          id={`epsilon-input`}
          max={1.0}
          min={0.0}
          onChange={onChange}
          step={0.1}
          type="range"
          value={value}
        />
        <span className="reward-input-value">{value * 100}%</span>
      </div>
    </div>
  )
}

export default EpsilonInput