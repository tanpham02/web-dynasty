import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Button, Col, Modal, Row, Table, TablePaginationConfig, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { QUERY_KEY } from '~/constants/queryKey';
import { CalculatorPoint, Customer, CustomerHistory } from '~/models/customers';
import customerService from '~/services/customerService';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { toast } from 'react-hot-toast';
import { SearchParams } from '~/types';
import ModalUpdateCustomerPoint from './ModalUpdateCustomerPoint';
import { EditOutlined } from '@ant-design/icons';
import IcoStar from '~/components/customs/IconStar';
import { formatCurrencyVND } from '~/utils/number';

export interface UpdateCustomerPointModalProps {
  customerID: number;
  isShowUpdateCustomerPointModal: boolean;
  handleConfirmModal: () => void;
  handleCancelModal: () => void;
  refreshData: () => void;
}

interface TableColumn {
  title: string;
  dataIndex?: keyof CustomerHistory;
  key?: keyof CustomerHistory;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: CustomerHistory, index: number) => React.ReactNode;
  responsive?: ['xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'];
}

export default function UpdateCustomerPointModal({
  customerID,
  isShowUpdateCustomerPointModal,
  handleConfirmModal,
  handleCancelModal,
  refreshData,
}: UpdateCustomerPointModalProps) {
  const { handleSubmit } = useForm<Customer>();

  const [visibleModalUpdateCustomerPoint, setVisibleModalUpdateCustomerPoint] =
    useState<boolean>(false);

  const [pageParameter, setPageParameter] = useState<SearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: customerHistoryData, refetch: refreshCustomerHistoryData } = useInfiniteQuery(
    [QUERY_KEY.CUSTOMERS_HISTORY, pageParameter, customerID], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.pageIndex,
        pageSize: pageParameter.pageSize,
        customerIds: customerID,
        sortBy: 'createdDate',
      };
      return await customerService.searchCustomerHistoryByCriteria(params);
    },
  );

  const { data: customerDetail, refetch: refetchCustomerDetail } = useQuery(
    [QUERY_KEY.CUSTOMERS_DETAIL, customerID], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      return await customerService.getCustomerByCustomerID(customerID);
    },
  );

  const COLUMNS: TableColumn[] = [
    {
      title: 'Nội dung',
      dataIndex: 'reason',
      key: 'reason',
      align: 'left',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      align: 'center',
      render: (_, record) => (
        <span>
          {record.createdDate ? formatDate(record.createdDate, DATE_FORMAT_DDMMYYYY) : ''}
        </span>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Số điểm',
      dataIndex: 'point',
      key: 'point',
      align: 'center',
      render: (_, record) => (
        <span>{`${record.type === CalculatorPoint.ADDITION ? '+' : '-'} ${record.point}`}</span>
      ),
    },
  ];

  const pagination = useMemo(() => {
    const current =
      customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.pageable.pageNumber;
    const total = customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.totalElements;
    const pageSize =
      customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.pageable.pageSize;

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

  const handleUpdateCustomerInformation = async (data: Customer) => {
    if (data)
      try {
        await customerService.updateCustomer(data);
        toast.success('Cập nhật thông tin thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '👏',
        });
        refreshData();
      } catch (error) {
        console.log(error);
        toast.error('Lỗi khi cập nhật thông tin ');
      }
  };

  return (
    <>
      <Modal
        className="min-w-[60%] min-h-[40%] z-[9999]"
        open={isShowUpdateCustomerPointModal}
        title={'Cập nhật điểm tích lũy của khách hàng'}
        onOk={handleConfirmModal}
        onCancel={handleCancelModal}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            Tắt
          </Button>,

          <Button htmlType="submit" form="customer-form">
            Cập nhật
          </Button>,
        ]}
      >
        <Row>
          <Col span={12}>
            <div className="flex items-center">
              <Typography>Họ và tên Khách hàng:</Typography>
              <Typography className="font-medium">
                &nbsp;{customerDetail?.fullName || ''}
              </Typography>
            </div>
          </Col>
          <Col span={12}>
            <div className="flex items-center">
              <Typography className="mr-3">
                Điểm của Khách hàng:{' '}
                <span
                  className="font-bold"
                  style={{
                    color: customerDetail?.membershipDTO?.color || '#219653',
                  }}
                >
                  {customerDetail?.point || 0}
                </span>
              </Typography>
              <button
                className="btn-show-modal-update-point outline-none"
                onClick={(e: any) => {
                  e.preventDefault();
                  setVisibleModalUpdateCustomerPoint(!visibleModalUpdateCustomerPoint);
                }}
              >
                <EditOutlined
                  className="bg-warning p-1 rounded-[50%] cursor-pointer"
                  style={{ color: '#fff' }}
                />
              </button>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col span={12}>
            <Typography className="flex flex-wrap">
              Hạng thành viên:
              <div className="flex flex-wrap">
                <span
                  className="font-bold "
                  style={{
                    color: customerDetail?.membershipDTO?.color,
                    marginLeft: '5px',
                  }}
                >
                  {customerDetail?.membershipDTO?.name}
                </span>
                <IcoStar
                  className="ml-1"
                  width={'15px'}
                  fill={customerDetail?.membershipDTO?.color || 'white'}
                />
              </div>
            </Typography>
          </Col>
          <Col span={12}>
            <Typography>
              Tổng chi tiêu:{' '}
              <span className="font-bold">
                {customerDetail?.totalAmountPurchased &&
                  formatCurrencyVND(customerDetail?.totalAmountPurchased)}
              </span>
            </Typography>
          </Col>
        </Row>
        <form
          id="customer-form"
          className="flex lg:flex-row md:flex-col xsm:flex-col 2xsm:flex-col gap-2"
          onSubmit={handleSubmit(handleUpdateCustomerInformation)}
        >
          <Col className="mt-5 lg:w-[40%] md:w-[100%] xsm:w-[100%] 2xsm:w-[100%]"></Col>
        </form>
        {customerHistoryData?.pages && customerHistoryData?.pages?.length > 0 && (
          <Table
            rowKey="id"
            dataSource={customerHistoryData?.pages[customerHistoryData.pages.length - 1]?.content}
            columns={COLUMNS}
            className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
            rowClassName="text-black dark:text-white"
            scroll={{ y: '25vh' }}
            pagination={{
              current: pagination.pageCurrent,
              pageSize: pagination.pageSize,
              total: pagination.totalElements,
            }}
            onChange={handleGetPagination}
          />
        )}

        <ModalUpdateCustomerPoint
          onClose={() => setVisibleModalUpdateCustomerPoint(false)}
          customerId={customerDetail?.id}
          customerPoint={customerDetail?.point}
          visible={visibleModalUpdateCustomerPoint}
          refreshCustomerHistoryData={refreshCustomerHistoryData}
          refetchCustomerDetail={refetchCustomerDetail}
        />
      </Modal>
    </>
  );
}
