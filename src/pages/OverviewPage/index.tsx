import { SelectItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import { getTimezone } from 'countries-and-timezones'
import moment, { Moment } from 'moment'
import { useEffect, useMemo, useState } from 'react'
import ApexCharts from 'react-apexcharts'
import { FormProvider, useForm } from 'react-hook-form'

import { isNumber } from 'lodash'
import { useNavigate } from 'react-router-dom'
import OrderCancelIcon from '~/assets/svg/icon-order-cancel.svg'
import OrderIcon from '~/assets/svg/icon-order.svg'
import TotalRevenueIcon from '~/assets/svg/total-revenue.svg'
import { CustomImage, FormContextSelect, Text } from '~/components'
import Box from '~/components/Box'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { FALLBACK_SRC, PATH_NAME } from '~/constants'
import { QUERY_KEY } from '~/constants/queryKey'
import { ProductMain } from '~/models/product'
import overviewService from '~/services/overviewService'
import { SearchParams } from '~/types'
import { getFullImageUrl } from '~/utils/image'
import { formatCurrencyWithUnits } from '~/utils/number'
import ReportBox from './components/ReportBox'
import { overviewFilterOptions, OverviewFilters } from './helpers'

const OverviewPage = () => {
  const currentTimezone = getTimezone(moment.tz.guess())
  const [filterOtherDate, setFilterOtherDate] = useState<Moment[]>([])

  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      quickDateFilter: [OverviewFilters.TODAY],
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

      case OverviewFilters.THIS_WEEK:
        return {
          from: moment().day(1).startOf('date').startOf('date').toISOString(),
          to: moment().day(7).startOf('date').endOf('date').toISOString(),
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

      case OverviewFilters.THIS_MONTH:
        return {
          from: moment()
            .subtract(0, 'months')
            .startOf('month')
            .startOf('date')
            .toISOString(),
          to: moment()
            .subtract(0, 'months')
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

  useEffect(() => {
    if (quickDateFilter[0] !== OverviewFilters.OTHER && filterOtherDate[0]) {
      setFilterOtherDate([])
    }
  }, [quickDateFilter, filterOtherDate])

  const { data: overviews } = useQuery(
    [QUERY_KEY.OVERVIEWS, quickDateFilter, quickFilters, currentTimezone],
    async () => {
      let params: SearchParams = {
        ...quickFilters,
        rawOffset: Number(currentTimezone?.utcOffsetStr?.split(':')[0]),
      }

      return await overviewService.getOverview(params)
    },
    {
      enabled: !!quickFilters?.from && !!quickFilters?.to,
      refetchOnWindowFocus: false,
    },
  )

  const { data: charts, isFetching } = useQuery(
    [
      QUERY_KEY.OVERVIEWS_REVENUE_CHART,
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

      return await overviewService.getRevenueChart(params)
    },
    {
      enabled: !!quickFilters?.from && !!quickFilters?.to,
      refetchOnWindowFocus: false,
    },
  )

  const { data: topBestSeller } = useQuery(
    [QUERY_KEY.OVERVIEWS_TOP_BEST_SELLER],
    async () => await overviewService.getFiveProductsBestSelling(),
    {
      enabled: !!quickFilters?.from && !!quickFilters?.to,
      refetchOnWindowFocus: false,
    },
  )

  const REPORT_VALUES = useMemo(
    () => [
      {
        label: 'Tổng đơn hàng',
        icon: OrderIcon,
        value: overviews?.totalOrders || 0,
      },
      {
        label: 'Doanh thu',
        icon: TotalRevenueIcon,
        value: `${formatCurrencyWithUnits(overviews?.totalRevenues || 0)} đ`,
      },
      {
        label: 'Tỷ lệ hủy đơn hàng',
        icon: OrderCancelIcon,
        value: `${
          isNumber(overviews?.percentCancelOrder)
            ? Number(overviews.percentCancelOrder)?.toFixed(2)
            : 0
        }%`,
      },
    ],
    [overviews],
  )

  const handleChangeFilterOtherDate = (range: [Moment, Moment]) => {
    if (Array.isArray(range) && range.length === 2) {
      const [start, end] = range
      setFilterOtherDate([start, end])
    } else {
      setFilterOtherDate([])
    }
  }

  const goToProductBestSelling = (id: string) =>
    navigate(`${PATH_NAME.PRODUCT}/${id}`)

  const columns: ColumnType<ProductMain>[] = [
    {
      align: 'center',
      name: <Box className="flex justify-center">Hình ảnh</Box>,
      render: (product: ProductMain) => (
        <CustomImage
          isPreview
          src={getFullImageUrl(product?.image)}
          fallbackSrc={FALLBACK_SRC}
        />
      ),
    },
    {
      align: 'center',
      name: 'Tên sản phẩm',
      render: (product: ProductMain) => (
        <Text
          className="hover:underline hover:text-meta-5 hover:cursor-pointer"
          onClick={() => goToProductBestSelling(product?._id!)}
        >
          {product?.name}
        </Text>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Tổng số lượng đặt hàng</Box>,
      render: (product: ProductMain) => (
        <Box className="flex justify-center">{product?.totalOrder || 0}</Box>
      ),
      hide: false,
    },
  ]

  // The date array

  const options = useMemo(
    () => ({
      chart: {
        type: 'bar',
        height: 350,
      },
      title: {
        text: 'Doanh Thu',
        align: 'center',
      },
      xaxis: {
        categories: charts?.date ?? [], // The x-axis categories are the dates
      },
      yaxis: {
        title: {
          text: 'Doanh thu',
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
    }),
    [charts?.date],
  )

  const series = useMemo(
    () => [
      {
        name: 'Doanh thu',
        data: charts?.data ?? [], // The series data
      },
    ],
    [charts?.data],
  )

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Tổng quan"
        routes={[
          {
            label: 'Tổng quan',
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
              {overviewFilterOptions.map((item) => (
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
              />
            </Box>
          )}
        </Box>
      </FormProvider>

      <Box className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {REPORT_VALUES.map((value) => (
          <ReportBox {...value} />
        ))}
      </Box>
      <Box className="grid grid-cols-1 gap-4 mt-4">
        <Box className="bg-white rounded-lg p-4">
          <ApexCharts
            options={options as any}
            series={series}
            type="bar"
            height={350}
          />
        </Box>
      </Box>

      <Box className="grid grid-cols-1 gap-4 mt-8">
        <Text className="text-base font-bold">
          Top 5 sản phẩm bán chạy nhất
        </Text>
        <CustomTable
          rowKey="_id"
          columns={columns}
          data={topBestSeller}
          tableName="Top 5 sản phẩm bán chạy nhất"
          emptyContent="Chưa có sản phẩm nào"
          isLoading={isFetching}
        />
      </Box>
    </Box>
  )
}

export default OverviewPage
