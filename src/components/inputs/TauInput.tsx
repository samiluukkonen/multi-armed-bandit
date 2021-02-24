import React, { ChangeEvent, FC } from 'react'

interface TauInputProps {
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const TauInput: FC<TauInputProps> = ({ disabled, onChange, value }) => {
  return (
    <div className="tau-input-container">
      <div className="tau-input-container">
        <label htmlFor={`tau-input`}>
          Tau (&tau;)
          <p>Fixed temperature, higher leads to more exploration.</p>
        </label>
        <input
          className="tau-input"
          disabled={!!disabled}
          id={`tau-input`}
          max={1.0}
          min={0.01}
          onChange={onChange}
          step={0.01}
          type="range"
          value={value}
        />
        <span className="tau-input-value">{value}</span>
      </div>
    </div>
  )
}

export default TauInput
