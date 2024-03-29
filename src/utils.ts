export const randomChoice = (n: number): number => Math.floor(Math.random() * n)
export const argMax = (arr: number[]): number => arr.indexOf(Math.max(...arr))
export const sum = (arr: number[]): number =>
  arr.reduce((a: number, b: number): number => a + b, 0)
export const initArray = (length: number): number[] =>
  Array.from({ length }, (): number => 0.0)
