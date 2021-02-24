import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

const resolveCountBarData = (
  arm: Arm
): {
  arm: string
  count: number
  reward: number
}[] =>
  arm.counts.map((count: number, index: number) => ({
    arm: `Arm ${index}`,
    count,
    reward: arm.rewards[index],
  }))

export const countBar = (arm: Arm): JSX.Element => (
  <ResponsiveBar
    colors={{ scheme: 'category10' }}
    // @ts-expect-error no such prop
    colorBy="index"
    data={resolveCountBarData(arm)}
    defs={[
      {
        id: 'lines',
        type: 'patternLines',
        background: 'inherit',
        color: '#eed312',
        rotation: -45,
        lineWidth: 1,
        spacing: 7,
      },
      {
        id: 'gradient',
        type: 'linearGradient',
        colors: [
          { offset: 0, color: '#faf047' },
          { offset: 100, color: '#e4b400' },
        ],
      },
    ]}
    fill={[
      {
        match: {
          id: 'reward',
        },
        id: 'gradient',
      },
    ]}
    groupMode="grouped"
    indexBy="arm"
    keys={['count', 'reward']}
    labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: 'left-to-right',
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: 'hover',
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
  />
)
