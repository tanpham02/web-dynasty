export enum OverviewFilters {
  TODAY = 'TODAY',
  LAST_WEEK = 'LAST_WEEK',
  THIS_WEEK = 'THIS_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  THIS_MONTH = 'THIS_MONTH',
  OTHER = 'OTHER',
}

export const overviewFilterOptions = [
  {
    label: 'Hôm nay',
    value: OverviewFilters.TODAY,
  },
  {
    label: 'Tuần trước',
    value: OverviewFilters.LAST_WEEK,
  },
  {
    label: 'Tuần này',
    value: OverviewFilters.THIS_WEEK,
  },
  {
    label: 'Tháng trước',
    value: OverviewFilters.LAST_MONTH,
  },
  {
    label: 'Tháng này',
    value: OverviewFilters.THIS_MONTH,
  },
  {
    label: 'Khác',
    value: OverviewFilters.OTHER,
  },
]
