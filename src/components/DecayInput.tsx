import React, { ChangeEvent, FC } from 'react'

interface DecayInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const DecyaInput: FC<DecayInputProps> = ({ onChange, value }) => {
  return (
    <div className="decay-input-container">
      <div className="decay-input-container">
        <label htmlFor={`decay-input`}>
          Decay value. The rate we reduce epsilon value over time.
        </label>
        <input
          className="decay-input"
          id={`decay-input`}
          max={1.0}
          min={0.0}
          onChange={onChange}
          step={0.01}
          type="range"
          value={value}
        />
        <span className="reward-input-value">{value}</span>
      </div>
    </div>
  )
}

export default DecyaInput
