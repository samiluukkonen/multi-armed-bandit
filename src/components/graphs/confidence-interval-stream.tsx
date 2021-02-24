import React from 'react'
import { ResponsiveStream } from '@nivo/stream'

const resolveConfidenceIntervalData = (
  condifenceIntervals: ConfidenceInterval[][]
): Record<string, unknown>[] =>
  condifenceIntervals.map((intervals: ConfidenceInterval[]) =>
    intervals.reduce(
      (prev, curr, index) => ({
        ...prev,
        // [`Arm ${index}`]: curr.max > 2 ? 2 : curr.max.toFixed(3),
        [`Arm ${index}`]: curr.max > 4 ? 4 : (curr.max - curr.min).toFixed(3),
      }),
      {}
    )
  )

export const confidenceIntervalStream = (
  condifenceIntervals: ConfidenceInterval[][]
): JSX.Element => (
  <ResponsiveStream
    data={resolveConfidenceIntervalData(condifenceIntervals)}
    keys={['Arm 0', 'Arm 1', 'Arm 2', 'Arm 3', 'Arm 4']}
    margin={{ top: 20, right: 160, bottom: 50, left: 60 }}
    offsetType="silhouette"
    colors={{ scheme: 'category10' }}
    fillOpacity={0.85}
    borderColor={{ theme: 'background' }}
    enableGridX={false}
    enableGridY={false}
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    axisLeft={null}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        translateX: 100,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: '#999999',
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000000',
            },
          },
        ],
      },
    ]}
  />
)
