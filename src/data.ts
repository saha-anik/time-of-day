export interface ITimeOfDay {
  min: number;
  max: number;
  q1: number;
  q3: number;
  median: number;
  mean: number;
  items: readonly number[];
  outliers: readonly number[];
  startTimes: number[];
  endTimes: number[];
  whiskerMax: number;
  whiskerMin: number;
}

export interface ITimeOfDayOptions {}
