export interface Statistic {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export enum StatisticGroup {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type StatisticOptionType = {
  label: string;
  value: number | string;
}[];
