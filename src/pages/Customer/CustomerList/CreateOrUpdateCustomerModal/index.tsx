import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TablePaginationConfig,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { QUERY_KEY } from "~/constants/querryKey";
import { Customer, CustomerHistory } from "~/models/customers";
import customerService from "~/services/customerService";
import {
  DATE_FORMAT_DDMMYYYY,
  DATE_FORMAT_YYYYMMDD,
  formatDate,
} from "~/utils/date.utils";
import { formatCurrencyVND } from "~/utils/number";
import IcoStar from "~/components/customs/IconStar";
import { PATTERN } from "~/utils/regex";
import { toast } from "react-hot-toast";
import useShippingLocation from "~/hooks/useShippingLocation";
import { LocationEnum, SearchParams } from "~/types";
import Loading from "~/components/Loading";

export interface CreateOrUpdateCustomerModalProps {
  type: "UPDATE" | "CREATE" | "DETAIL";
  customerID: number;
  isShowCustomerModal: boolean;
  handleConfirmModal: () => void;
  handleCancelModal: () => void;
  refreshData: () => void;
}

interface TableColumn {
  title: string;
  dataIndex?: keyof CustomerHistory;
  key?: keyof CustomerHistory;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (
    value: any,
    record: CustomerHistory,
    index: number,
  ) => React.ReactNode;
}

const COLUMNS: TableColumn[] = [
  {
    title: "Nội dung",
    dataIndex: "reason",
    key: "reason",
    align: "left",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdDate",
    key: "createdDate",
    align: "center",
    render: (_, record) => (
      <span>
        {record.createdDate
          ? formatDate(record.createdDate, DATE_FORMAT_DDMMYYYY)
          : ""}
      </span>
    ),
  },
  {
    title: "Số điểm",
    dataIndex: "point",
    key: "point",
    align: "center",
  },
  {
    title: "Số tiền",
    dataIndex: "money",
    key: "money",
    align: "center",
  },
];

export default function CreateOrUpdateCustomerModal({
  type,
  customerID,
  isShowCustomerModal,
  handleConfirmModal,
  handleCancelModal,
  refreshData,
}: CreateOrUpdateCustomerModalProps) {
  const [location, setLocation] = useState<{
    cityID: string | number;
    districtID: string | number;
    wardID: string | number;
  }>({
    cityID: 0,
    districtID: 0,
    wardID: 0,
  });
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>();

  const { cities, districts, wards } = useShippingLocation(
    location.cityID,
    location.districtID,
  );
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });

  const typeModal = useMemo(() => {
    return type;
  }, [type]);

  const { data: customerDetail, refetch: refetchCustomerDetail } = useQuery(
    [QUERY_KEY.CUSTOMERS_DETAIL, customerID], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      return await customerService.getCustomerByCustomerID(customerID);
    },
    { enabled: type === "DETAIL" || type === "UPDATE" ? true : false },
  );

  const { data: customerHistoryData } = useInfiniteQuery(
    [QUERY_KEY.CUSTOMERS_HISTORY, pageParameter, customerID], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.pageIndex,
        pageSize: pageParameter.pageSize,
        customerIds: customerID,
      };
      return await customerService.searchCustomerHistoryByCriteria(params);
    },
  );

  const pagination = useMemo(() => {
    const current =
      customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.pageable
        .pageNumber;
    const total =
      customerHistoryData?.pages[customerHistoryData.pages.length - 1]
        ?.totalElements;
    const pageSize =
      customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.pageable
        .pageSize;

    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      pageSize,
      totalElements: total || 0,
    };
  }, [customerHistoryData]);

  const handleGetPagination = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && pagination.pageSize)
      setPageParameter({
        pageIndex: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  useEffect(() => {
    if (typeModal === "UPDATE") {
      reset(customerDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeModal, customerDetail]);

  useEffect(() => {
    if (
      typeModal === "UPDATE" &&
      customerDetail &&
      customerDetail?.cityId &&
      customerDetail?.districtId &&
      customerDetail?.wardId
    ) {
      setLocation({
        cityID: customerDetail?.cityId,
        districtID: customerDetail?.districtId,
        wardID: customerDetail?.wardId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDetail]);

  const handleUpdateCustomerInformation = async (data: Customer) => {
    if (data)
      try {
        await customerService.updateCustomer(data);
        toast.success("Cập nhật thông tin thành công", {
          position: "bottom-right",
          duration: 3500,
          icon: "👏",
        });
        refetchCustomerDetail();
        refreshData();
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi cập nhật thông tin ");
      }
  };

  const handleUpdateLocation = (
    typeLocation: LocationEnum,
    locationID: number | string,
  ) => {
    if (locationID)
      switch (typeLocation) {
        case LocationEnum.CITY:
          // eslint-disable-next-line no-case-declarations
          const citySelected = cities?.find(
            (city) => city.value === locationID,
          );
          setValue("cityId", locationID);
          setValue("city", citySelected?.label);
          setValue("districtId", "");
          setValue("wardId", "");
          setLocation({ ...location, cityID: locationID });
          break;
        case LocationEnum.DISTRICT:
          // eslint-disable-next-line no-case-declarations
          const districtSelected = districts?.find(
            (district) => district.value === locationID,
          );
          setValue("districtId", locationID);
          setValue("district", districtSelected?.label);
          setValue("wardId", "");
          setLocation({ ...location, districtID: locationID });
          break;
        case LocationEnum.WARD:
          // eslint-disable-next-line no-case-declarations
          const wardSelected = wards?.find((ward) => ward.value === locationID);
          setValue("wardId", locationID);
          setValue("ward", wardSelected?.label);
          setLocation({ ...location, wardID: locationID });
          break;
      }
  };

  return (
    <>
      <Modal
        className="min-w-[60%] min-h-[40%] z-[9999]"
        open={isShowCustomerModal}
        title={
          typeModal === "UPDATE"
            ? "Cập nhật thông tin khách hàng"
            : "Thông tin chi tiết của khách hàng"
        }
        onOk={handleConfirmModal}
        onCancel={handleCancelModal}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            Hủy
          </Button>,

          <Button
            htmlType="submit"
            form="customer-form"
            className="!bg-primary !text-white border border-solid !border-primary"
          >
            Cập nhật
          </Button>,
        ]}
      >
        <form
          id="customer-form"
          className="flex lg:flex-row md:flex-col xsm:flex-col 2xsm:flex-col gap-2"
          onSubmit={handleSubmit(handleUpdateCustomerInformation)}
        >
          <Col className="mt-5 lg:w-[40%] md:w-[100%] flex justify-center ">
            {customerDetail?.avatar && (
              <img
                src={customerDetail?.avatar}
                className="rounded-[100%] max-w-[200px]  max-h-[200px]"
              />
            )}
          </Col>
          <Col className="mt-5 lg:w-[40%] md:w-[100%] xsm:w-[100%] 2xsm:w-[100%]">
            {typeModal !== "CREATE" && (
              <Row className="mt-1">
                <Col span={12}>
                  <Typography>
                    Mã ID Khách hàng:{" "}
                    <span className="font-bold">{customerDetail?.id}</span>
                  </Typography>
                </Col>
              </Row>
            )}

            <Row className="mt-4" gutter={20}>
              <Col span={12}>
                <Typography>
                  Tên khách hàng:
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">
                      {" "}
                      {customerDetail?.fullName}
                    </span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="fullName"
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className={` border-solid  border-[1px] ${
                              errors.fullName ? "!border-danger" : ""
                            }`}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                      {errors.fullName?.type === "required" ? (
                        <small className="text-danger">
                          Tên khách hàng không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>
            {typeModal !== "CREATE" && (
              <Row className="mt-4" gutter={20}>
                <Col span={12}>
                  <Typography className="flex flex-wrap">
                    Hạng thành viên:
                    <div className="flex flex-wrap">
                      <span
                        className="font-bold "
                        style={{
                          color: customerDetail?.membershipDTO?.color,
                          marginLeft: "5px",
                        }}
                      >
                        {customerDetail?.membershipDTO?.name}
                      </span>
                      <IcoStar
                        className="ml-1"
                        width={"15px"}
                        fill={customerDetail?.membershipDTO?.color || "white"}
                      />
                    </div>
                  </Typography>
                </Col>
                <Col span={12}>
                  <Typography>
                    Tổng chi tiêu:{" "}
                    <span className="font-bold">
                      {customerDetail?.totalAmountPurchased &&
                        formatCurrencyVND(customerDetail?.totalAmountPurchased)}
                    </span>
                  </Typography>
                </Col>
              </Row>
            )}
            <Row className="mt-4" gutter={20}>
              <Col span={12}>
                <Typography>
                  Số điện thoại :{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">
                      {customerDetail?.phoneNumber}
                    </span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="phoneNumber"
                        rules={{ required: false, pattern: PATTERN.PHONE }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className={` border-solid  border-[1px] ${
                              errors.phoneNumber ? "!border-danger" : ""
                            }`}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                      {errors.phoneNumber?.type === "required" && (
                        <small className="text-danger">
                          Số điện thoại không được rỗng
                        </small>
                      )}
                      {errors.phoneNumber?.type === "pattern" && (
                        <small className="text-danger">
                          Số điện thoại không đúng định dạng
                        </small>
                      )}
                    </>
                  )}
                </Typography>
              </Col>
              <Col span={12}>
                <Typography>
                  Ngày sinh :{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">
                      {customerDetail?.birthday &&
                        moment(customerDetail?.birthday).format(
                          DATE_FORMAT_DDMMYYYY,
                        )}
                    </span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="birthday"
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => {
                          if (value) {
                            return (
                              <DatePicker
                                allowClear={false}
                                value={moment(value)}
                                onChange={(value) =>
                                  onChange(
                                    moment(value).format(DATE_FORMAT_YYYYMMDD),
                                  )
                                }
                                format={DATE_FORMAT_DDMMYYYY}
                              />
                            );
                          } else {
                            return (
                              <DatePicker
                                allowClear={false}
                                // value={moment(value)}
                                onChange={(value) =>
                                  onChange(
                                    moment(value).format(DATE_FORMAT_YYYYMMDD),
                                  )
                                }
                                format={DATE_FORMAT_DDMMYYYY}
                              />
                            );
                          }
                        }}
                      />
                      {errors.birthday?.type === "required" ? (
                        <small className="text-danger">
                          Ngày sinh không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col span={12}>
                <Typography>
                  Tỉnh/Thành phố:{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">{customerDetail?.city}</span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="cityId"
                        rules={{ required: false }}
                        render={({ field: { value } }) => (
                          <Select
                            value={value}
                            defaultValue={0}
                            style={{ width: "100%" }}
                            onChange={(value) =>
                              handleUpdateLocation(LocationEnum.CITY, value)
                            }
                            options={cities}
                          />
                        )}
                      />
                      {errors.cityId?.type === "required" ? (
                        <small className="text-danger">
                          Tỉnh/Thành phố không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={12}>
                <Typography>
                  Quận/Huyện:{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">
                      {customerDetail?.district}
                    </span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="districtId"
                        rules={{ required: false }}
                        render={({ field: { value } }) => (
                          <Select
                            defaultValue={0}
                            value={value}
                            style={{ width: "100%" }}
                            onChange={(value) =>
                              handleUpdateLocation(LocationEnum.DISTRICT, value)
                            }
                            options={districts}
                          />
                        )}
                      />
                      {errors.districtId?.type === "required" ? (
                        <small className="text-danger">
                          Quận/Huyện không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={12}>
                <Typography>
                  Xã/Phường:{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">{customerDetail?.ward}</span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="wardId"
                        rules={{ required: false }}
                        render={({ field: { value } }) => (
                          <Select
                            defaultValue={0}
                            value={value}
                            style={{ width: "100%" }}
                            onChange={(value) =>
                              handleUpdateLocation(LocationEnum.WARD, value)
                            }
                            options={wards}
                          />
                        )}
                      />
                      {errors.wardId?.type === "required" ? (
                        <small className="text-danger">
                          Xã/Phường không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col style={{ width: "100%" }}>
                <Typography>
                  Số nhà cụ thể: :{" "}
                  {typeModal === "DETAIL" && (
                    <span className="font-bold">{customerDetail?.address}</span>
                  )}
                  {typeModal !== "DETAIL" && (
                    <>
                      {" "}
                      <Controller
                        control={control}
                        name="address"
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            className={` border-solid  border-[1px] ${
                              errors.address ? "!border-danger" : ""
                            }`}
                            value={value}
                            style={{ width: "100%" }}
                            onChange={onChange}
                            placeholder="Vd: số 9, đường 36..."
                          />
                        )}
                      />
                      {errors.address?.type === "required" ? (
                        <small className="text-danger">
                          Số nhà cụ thể không được rỗng
                        </small>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </Typography>
              </Col>
            </Row>
          </Col>
        </form>
        {customerHistoryData?.pages &&
          customerHistoryData?.pages?.length > 0 &&
          typeModal === "DETAIL" && (
            <Table
              rowKey="id"
              dataSource={
                customerHistoryData?.pages[customerHistoryData.pages.length - 1]
                  ?.content
              }
              columns={COLUMNS}
              className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
              rowClassName="text-black dark:text-white"
              scroll={{ y: "25vh" }}
              pagination={{
                current: pagination.pageCurrent,
                pageSize: pagination.pageSize,
                total: pagination.totalElements,
              }}
              onChange={handleGetPagination}
            />
          )}
      </Modal>
    </>
  );
}
