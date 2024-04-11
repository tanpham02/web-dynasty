import CountUp from 'react-countup';
import Chart from 'react-apexcharts';

import DeliveryIcon from '~/assets/svg/icon-delivery.svg';
import OrderCancelIcon from '~/assets/svg/icon-order-cancel.svg';
import OrderIcon from '~/assets/svg/icon-order.svg';
import TotalRevenueIcon from '~/assets/svg/total-revenue.svg';
import Box from '~/components/Box';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import ReportBox from './components/ReportBox';
const OverviewPage = () => {
  const REPORT_VALUES = [
    {
      label: 'Tổng đơn hàng',
      icon: OrderIcon,
      value: <CountUp end={75} />,
    },
    {
      label: 'Đơn mang đi',
      icon: DeliveryIcon,
      value: <CountUp end={357} />,
    },
    {
      label: 'Đơn bị hủy',
      icon: OrderCancelIcon,
      value: <CountUp end={65} />,
    },
    {
      label: 'Tổng doanh thu',
      icon: TotalRevenueIcon,
      value: <CountUp end={22635563} suffix="đ" />,
    },
  ];

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Báo cáo thống kê"
        routes={[
          {
            label: 'Báo cáo thống kê',
          },
        ]}
      />
      <Box className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {REPORT_VALUES.map((value) => (
          <ReportBox {...value} />
        ))}
      </Box>
      <Box className="grid grid-cols-2 gap-4 mt-4">
        <Box className="bg-white rounded-lg p-4">
          <Chart
            type="area"
            options={{
              chart: {
                id: 'basic-bar',
              },
              xaxis: {
                categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
              },
            }}
            series={[
              {
                name: 'Doanh thu',
                data: [450000, 400000, 420000, 700000, 890000, 600000, 1200000],
              },
            ]}
          />
        </Box>
        <Box className="bg-white rounded-lg p-4">
          <Chart
            className="w-full"
            options={{
              chart: {
                id: 'basic-bar',
              },
              xaxis: {
                categories: [
                  'Thành công',
                  'Hoàn trả đơn hàng',
                  'Đang giao hàng',
                  'Thất bại',
                  'Chờ xác nhận',
                  'Chờ giao hàng',
                ],
              },
            }}
            series={[
              {
                name: 'Số đơn hàng',
                data: [100, 12, 22, 2, 10, 40],
              },
            ]}
            type="bar"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OverviewPage;
