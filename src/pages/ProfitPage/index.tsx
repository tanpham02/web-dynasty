import { SelectItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import { getTimezone } from 'countries-and-timezones'
import moment, { Moment } from 'moment'
import { useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import { FormProvider, useForm } from 'react-hook-form'

import { FormContextSelect } from '~/components'
import Box from '~/components/Box'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import { QUERY_KEY } from '~/constants/queryKey'
import overviewService from '~/services/overviewService'
import { SearchParams } from '~/types'
import { currentMonthFirstDate } from '~/utils/date.utils'
import { OverviewFilters } from './helpers'
import { formatCurrencyWithUnits } from '~/utils/number'

const ProfitPage = () => {
  const currentTimezone = getTimezone(moment.tz.guess())
  const [filterOtherDate, setFilterOtherDate] = useState<Moment[]>([])

  const form = useForm({
    defaultValues: {
      quickDateFilter: [OverviewFilters.LAST_WEEK],
    },
  })
  const { watch } = form

  const quickDateFilter = watch('quickDateFilter')

  const quickFilters = useMemo(() => {
    switch (quickDateFilter[0]) {
      case OverviewFilters.LAST_WEEK:
        return {
          from: moment()
            .day(1 - 7)
            .startOf('date')
            .toISOString(),
          to: moment().day(0).endOf('date').toISOString(),
        }

      case OverviewFilters.LAST_MONTH:
        return {
          from: moment()
            .subtract(1, 'months')
            .startOf('month')
            .startOf('date')
            .toISOString(),
          to: moment()
            .subtract(1, 'months')
            .endOf('month')
            .endOf('date')
            .toISOString(),
        }

      case OverviewFilters.OTHER:
        return {
          from: filterOtherDate[0]
            ? filterOtherDate[0]?.startOf('day').toISOString()
            : undefined,
          to: filterOtherDate[1]
            ? filterOtherDate[1]?.endOf('day').toISOString()
            : undefined,
        }

      default:
        // TODAY
        return {
          from: moment(new Date()).startOf('date').toISOString(),
          to: moment(new Date()).endOf('date').toISOString(),
        }
    }
  }, [quickDateFilter, filterOtherDate])

  const { data: charts } = useQuery(
    [
      QUERY_KEY.OVERVIEWS_PROFIT_CHART,
      quickDateFilter,
      quickFilters,
      currentTimezone,
    ],
    async () => {
      let params: SearchParams = {
        ...quickFilters,
        rawOffset: Number(currentTimezone?.utcOffsetStr?.split(':')[0]),
        groupType: quickDateFilter[0],
      }

      return await overviewService.getProfitChart(params)
    },
    {
      enabled: !!quickFilters?.from && !!quickFilters?.to,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (quickDateFilter[0] !== OverviewFilters.OTHER && filterOtherDate[0]) {
      setFilterOtherDate([])
    }
  }, [quickDateFilter, filterOtherDate])

  const handleChangeFilterOtherDate = (range: [Moment, Moment]) => {
    if (Array.isArray(range) && range.length === 2) {
      const [start, end] = range
      setFilterOtherDate([start, end])
    } else {
      setFilterOtherDate([])
    }
  }

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Lợi nhuận"
        routes={[
          {
            label: 'Lợi nhuận',
          },
        ]}
      />

      <FormProvider {...form}>
        <Box className="flex flex-row justify-start items-center gap-3 mb-4">
          <Box className="min-w-[300px]">
            <FormContextSelect
              label="Lọc nhanh"
              className="max-w-xs bg-white rounded-xl"
              name="quickDateFilter"
              size="md"
            >
              {[
                {
                  label: 'Tuần trước',
                  value: OverviewFilters.LAST_WEEK,
                },
                {
                  label: 'Tháng trước',
                  value: OverviewFilters.LAST_MONTH,
                },
                {
                  label: 'Khác',
                  value: OverviewFilters.OTHER,
                },
              ].map((item) => (
                <SelectItem key={item.value} value={item.label}>
                  {item.label}
                </SelectItem>
              ))}
            </FormContextSelect>
          </Box>
          {quickDateFilter?.includes(OverviewFilters.OTHER) && (
            <Box className="">
              <DatePicker.RangePicker
                size="middle"
                className="!w-[450px] !h-[56px]"
                value={
                  Array.isArray(filterOtherDate) && filterOtherDate.length === 2
                    ? [filterOtherDate[0], filterOtherDate[1]]
                    : undefined
                }
                onChange={(range) =>
                  handleChangeFilterOtherDate(range as [Moment, Moment])
                }
                disabledDate={(date) =>
                  moment(date).isAfter(currentMonthFirstDate(new Date()))
                }
              />
            </Box>
          )}
        </Box>
      </FormProvider>

      <Box className="grid grid-cols-1 gap-4 mt-4">
        <Box className="bg-white rounded-lg p-4">
          <Chart
            type="bar"
            options={{
              title: {
                text: 'Lợi nhuận',
              },

              xaxis: {
                categories: charts?.date ?? [], // The x-axis categories are the dates
              },
              yaxis: {
                title: {
                  text: 'Lợi nhuận',
                },
              },
              dataLabels: {
                enabled: false, // Disable data labels
              },
              plotOptions: {
                bar: {
                  columnWidth: '40%',
                },
              },
              tooltip: {
                y: {
                  formatter: (value: number) => {
                    return `${formatCurrencyWithUnits(value || 0)} đ` // Format value with currency and commas
                  },
                },
              },
            }}
            series={[
              {
                name: 'Lợi nhuận',
                data: charts?.data ?? [],
              },
            ]}
            height={630}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProfitPage
