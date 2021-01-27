import React, { ChangeEvent, FC } from 'react'

interface IterationsInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const IterationsInput: FC<IterationsInputProps> = ({ onChange, value }) => {
  return (
    <div className="iterations-input-container">
      <div className="iterations-input-container">
        <label htmlFor={`iterations-input`}>
          Iterations
          <p>How many times we want to try to learn things.</p>
        </label>
        <input
          className="iterations-input"
          id={`iterations-input`}
          max={1000}
          min={0}
          onChange={onChange}
          step={100}
          type="range"
          value={value}
        />
        <span className="iterations-value">{value}</span>
      </div>
    </div>
  )
}

export default IterationsInput
