import { useInfiniteQuery } from "@tanstack/react-query";
import { Segmented, Space, Typography } from "antd";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { QUERY_KEY } from "~/constants/queryKey";
import { StatisticGroupType, StatisticTime } from "~/constants/statisticKey";
import { StatisticGroup } from "~/models/statistic";
import { statisticService } from "~/services/statisticService";
import { DATE_FORMAT_YYYYMMDD, subtractDays } from "~/utils/date.utils";

const AffiliateStatisticPage = () => {
  const [queryParameter, setQueryParameter] = useState<{
    chartTimeGroupBy: string | number;
    fromDate: string | Date;
    toDate: string | Date;
  }>({
    chartTimeGroupBy: StatisticGroup.DAY,
    fromDate: `${subtractDays(new Date(), StatisticTime[0].value).format(
      DATE_FORMAT_YYYYMMDD,
    )}`,
    toDate: `${subtractDays(new Date(), 1).format(DATE_FORMAT_YYYYMMDD)}`,
  });

  const { data: revenueStatisticData } = useInfiniteQuery(
    [QUERY_KEY.REVENUE_STATISTIC, queryParameter],
    async () => {
      const params = {
        chartTimeGroupBy: queryParameter.chartTimeGroupBy,
        from: queryParameter.fromDate,
        to: queryParameter.toDate,
      };
      return await statisticService.getStatisticData(params);
    },
  );

  const handleChangeChartTimeGroupBy = (value: string | number) => {
    if (value) {
      setQueryParameter({ ...queryParameter, chartTimeGroupBy: value });
    }
  };

  const handleChangeTime = (value: string | number) => {
    if (value) {
      setQueryParameter({
        ...queryParameter,
        fromDate: `${subtractDays(new Date(), value).format(
          DATE_FORMAT_YYYYMMDD,
        )}`,
        toDate: `${subtractDays(new Date(), 1).format(DATE_FORMAT_YYYYMMDD)}`,
      });
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <>
      <div className="mb-5">
        <div>
          <span className="font-bold text-xl">
            {"Thống kê khách hàng mới trên Zalo Mini App"}
          </span>
        </div>
        <Space className="mt-5" size={"large"}>
          <div>
            <Typography>Thời gian:</Typography>
            <Segmented
              options={StatisticTime}
              defaultValue={StatisticTime[0].value}
              onChange={handleChangeTime}
            />
          </div>
          <div>
            <Typography>Thống kê theo:</Typography>
            <Segmented
              options={StatisticGroupType}
              defaultValue={StatisticGroupType[0].value}
              onChange={(value) => handleChangeChartTimeGroupBy(value)}
            />
          </div>
        </Space>
        <div className="mt-5">
          {revenueStatisticData && (
            <Line
              options={chartOptions}
              data={revenueStatisticData?.pages[0][0]}
            />
          )}
        </div>
      </div>
      {/* <NewCustomerTable /> */}
    </>
  );
};

export default AffiliateStatisticPage;
