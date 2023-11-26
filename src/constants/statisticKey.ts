import { StatisticGroup, StatisticOptionType } from '~/models/statistic';

export const StatisticGroupType: StatisticOptionType = [
  {
    label: 'Ngày',
    value: StatisticGroup.DAY,
  },
  {
    label: 'Tháng',
    value: StatisticGroup.MONTH,
  },
  {
    label: 'Năm',
    value: StatisticGroup.YEAR,
  },
];

export const StatisticTime: StatisticOptionType = [
  {
    label: '30 Ngày gần nhất',
    value: 30,
  },
  {
    label: '60 Ngày gần nhất',
    value: 60,
  },
  {
    label: '90 Ngày gần nhất',
    value: 90,
  },
  {
    label: '120 Ngày gần nhất',
    value: 120,
  },
];
