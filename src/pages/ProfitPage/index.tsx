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
import { isEmpty } from 'lodash'

const ProfitPage = () => {
  const currentTimezone = getTimezone(moment.tz.guess())
  const [filterOtherDate, setFilterOtherDate] = useState<Moment[]>([])

  const form = useForm({
    defaultValues: {
      quickDateFilter: [OverviewFilters.LAST_MONTH],
    },
  })
  const { watch } = form

  const quickDateFilter = watch('quickDateFilter')

  const quickFilters = useMemo(() => {
    switch (quickDateFilter[0]) {
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
        // LAST_MONTH
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
    }
  }, [quickDateFilter, filterOtherDate])

  const { data: charts, isFetching } = useQuery(
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

  // Helper function to calculate the number of days between two dates
  function getDaysDifference(date1: any, date2: any) {
    const d1: any = new Date(date1)
    const d2: any = new Date(date2)
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) // Convert to days
  }

  // Group data by the type (LAST_MONTH or OTHER)
  function groupData(data: any, type: any) {
    const monthlyStats: any = {}
    const currentDate = new Date()

    // Process orders
    data?.ordersResult?.forEach((order: any) => {
      const orderDate = new Date(order._id)
      const yearMonth = orderDate.toISOString().substring(0, 7) // 'YYYY-MM'

      // Determine the group key based on the type and the date difference
      let key
      const daysDiff = getDaysDifference(order._id, currentDate)

      if (
        type === 'LAST_MONTH' &&
        orderDate.getMonth() === currentDate.getMonth() - 1
      ) {
        key = yearMonth // Group by month if in the last month
      } else if (type === 'OTHER') {
        if (daysDiff < 30) {
          key = yearMonth // Group by month if less than 30 days
        } else if (daysDiff >= 30 && daysDiff <= 90) {
          key = yearMonth // Group by month if between 1-3 months
        } else if (daysDiff > 90 && daysDiff <= 365) {
          key = yearMonth // Group by month if more than 3 months but less than 1 year
        } else if (daysDiff > 365) {
          key = yearMonth // Group by year if more than 1 year
        }
      }

      if (!monthlyStats[key!]) {
        monthlyStats[key!] = {
          totalRevenue: 0,
          totalIngredientsCost: 0,
          profit: 0,
        }
      }
      monthlyStats[key!].totalRevenue += order.totalRevenue
    })

    // Process ingredients
    data?.ingredientsResult?.forEach((ingredient: any) => {
      const ingredientDate = new Date(ingredient._id)
      const yearMonth = ingredientDate.toISOString().substring(0, 7) // 'YYYY-MM'

      let key: any
      const daysDiff = getDaysDifference(ingredient._id, currentDate)

      if (
        type === 'LAST_MONTH' &&
        ingredientDate.getMonth() === currentDate.getMonth() - 1
      ) {
        key = yearMonth // Group by month if in the last month
      } else if (type === 'OTHER') {
        if (daysDiff < 30) {
          key = yearMonth // Group by month if less than 30 days
        } else if (daysDiff >= 30 && daysDiff <= 90) {
          key = yearMonth // Group by month if between 1-3 months
        } else if (daysDiff > 90 && daysDiff <= 365) {
          key = yearMonth // Group by month if more than 3 months but less than 1 year
        } else if (daysDiff > 365) {
          key = yearMonth // Group by year if more than 1 year
        }
      }

      if (!monthlyStats[key]) {
        monthlyStats[key] = {
          totalRevenue: 0,
          totalIngredientsCost: 0,
          profit: 0,
        }
      }
      monthlyStats[key].totalIngredientsCost += ingredient.totalIngredientsCost
    })

    // Add staff salaries and calculate profit
    for (const key in monthlyStats) {
      const stats = monthlyStats[key]
      stats.totalIngredientsCost += data?.staffSalaries
      stats.profit = stats.totalRevenue - stats.totalIngredientsCost
    }

    return monthlyStats
  }

  function transformData(inputData: any) {
    const result: any = { data: [], date: [] }
    if (isEmpty(inputData)) return result

    for (const key in inputData) {
      result.data.push(inputData[key].profit)
      result.date.push(key)
    }

    return result
  }

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

  if (isFetching) {
    return (
      <div className="fixed bg-[#000]/[.25] top-0 right-0 bottom-0 left-0 z-999999 flex justify-center items-center">
        <span className="loader"></span>
      </div>
    )
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
                categories:
                  transformData(groupData(charts, quickDateFilter[0]))?.date ??
                  [], // The x-axis categories are the dates
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
                data:
                  transformData(groupData(charts, quickDateFilter[0]))?.data ??
                  [],
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
