import moment from 'moment'

export const DATE_FORMAT_DDMMYYYYHHMMSS = 'DD/MM/YYYY HH:mm:ss'
export const DATE_FORMAT_DDMMYYYY = 'DD/MM/YYYY'
export const DATE_FORMAT_YYYYMMDD = 'YYYY-MM-DD'
export const DATE_FORMAT_YYYYMMDDTHHMMSS = 'YYYY-MM-DDTHH:mm:ss'
export const DATE_FORMAT_DDMMYYYYTHHMMSS = 'DD-MM-YYYY HH:mm:ss'
export const DATE_FORMAT_HHMMSS = 'HH:mm:ss'

export const DATE_FORMAT_DDMMYYYY_THHMMSS = 'DD-MM-YYYY HH:mm:ss'

export const DATE_FORMAT_HHMMSS_DDMMYYYY = 'HH:mm:ss DD-MM-YYYY'

export const DATE_FORMAT_DDMMYYYYTHHMM = 'DD-MM-YYYY HH:mm'

export const formatDate = (date: Date | string, format: string): string => {
  return moment(date).format(format)
}

export function subtractDays(date: Date, days: number | string) {
  return moment(date).subtract(days, 'days')
}

export function subtractMonths(date: Date, months: number | string) {
  return moment(date).subtract(months, 'months')
}

export function addDays(date: Date, days: number | string) {
  return moment(date).add(days, 'days')
}

export const currentMonthFirstDate = (current: Date, format?: string) => {
  let instance = moment(current, format)
  return instance.isValid() ? instance.startOf('month') : null
}

export const currentMonthLastDate = (current: Date, format?: string) => {
  let instance = moment(current, format)
  return instance.isValid() ? instance.endOf('month').endOf('day') : null
}
