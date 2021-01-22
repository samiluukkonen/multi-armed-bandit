import React, { ChangeEvent, FC } from 'react'

interface DecayIntervalInputProps {
  disabled?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: number
}

const DecyaIntervalInput: FC<DecayIntervalInputProps> = ({
  disabled,
  onChange,
  value,
}) => {
  return (
    <div className="decay-interval-input-container">
      <div className="decay-interval-input-container">
        <label htmlFor={`decay-interval-input`}>
          Decay interval
          <p># of iterations after we apply decay to epsilon.</p>
        </label>
        <input
          className="decay-interval-input"
          disabled={!!disabled}
          id={`decay-interval-input`}
          max={1000}
          min={0}
          onChange={onChange}
          step={10}
          type="range"
          value={value}
        />
        <span className="decay-interval-input-value">{value}</span>
      </div>
    </div>
  )
}

export default DecyaIntervalInput
