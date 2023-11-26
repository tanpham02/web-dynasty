import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { InfiniteData } from '@tanstack/react-query';
import { Avatar, Button, Empty, Modal, Popconfirm, Select, Table, TablePaginationConfig, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProductMain, ProductStatusOptions, ProductType } from '~/models/product';
import { productService } from '~/services/productService';
import { Breakpoint, ListDataResponse } from '~/types';
import ProductDetailModal from '../ProductDetailModal';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import './index.scss';
import ProductModal from './ProductModal';
import { ModalType } from '~/pages/User/UserModal';
import { formatCurrencyVND } from '~/utils/number';
import Loading from '~/components/Loading';

export const ProductTypeTagRenderMapping = {
  [`${ProductType.NORMAL}`]: 'black',
  [`${ProductType.NEW}`]: '#38cbcb',
  [`${ProductType.BEST_SELLER}`]: '#ff0000',
  [`${ProductType.DELICIOUS_MUST_TRY}`]: '#006a31',
  [`${ProductType.VEGETARIAN}`]: '#40d340',
  [`${ProductType.SPICY}`]: '#f64d4d',
  [`${ProductType.UNIQUE}`]: '#ffb938',
};

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={ProductTypeTagRenderMapping[`${value as ProductType}`]}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
interface Columns {
  title?: string;
  dataIndex?: keyof ProductMain;
  key?: keyof ProductMain;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: ProductMain) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface ProductStates {
  showModal?: boolean;
  modalType?: ModalType;
  product?: ProductMain;
}

interface ProductTableProps {
  data: InfiniteData<ListDataResponse<ProductMain>> | undefined;
  refreshData: () => void;
  handleTableChange: (paginationFromTable: TablePaginationConfig) => void;
  propsProduct: ProductStates;
  onClose: () => void;
  onSetPropsProduct: ({ modalType, product, showModal }: ProductStates) => void;
}

const PRODUCT_ID_WHEN_EMPTY = -100;

const ProductTable = ({
  data,
  refreshData,
  handleTableChange,
  onClose,
  propsProduct,
  onSetPropsProduct,
}: ProductTableProps) => {
  const [showConfirmDeleteMultiModal, setShowConfirmDeleteMultiModal] = useState<boolean>(false);
  const [isLoadingDeleteMulti, setIsLoadingDeleteMulti] = useState<boolean>(false);
  const [productSelectedKeys, setProductSelectedKeys] = useState<React.Key[]>([]);
  const [productTypeSelectedKeys, setProductTypeSelectedKeys] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showProductDetailModal, setShowProductDetailModal] = useState<{
    isShowProductDetailModal: boolean;
    productID: string;
  }>({
    isShowProductDetailModal: false,
    productID: `${PRODUCT_ID_WHEN_EMPTY}`,
  });

  const handleShowProductDetailModal = (productID: string | undefined) => {
    if (productID) {
      setShowProductDetailModal({
        isShowProductDetailModal: !showProductDetailModal.isShowProductDetailModal,
        productID: productID,
      });
    }
  };
  const handleCloseProductDetailModal = () => {
    setShowProductDetailModal({
      isShowProductDetailModal: false,
      productID: `${PRODUCT_ID_WHEN_EMPTY}`,
    });
  };

  const COLUMNS: Columns[] = [
    {
      key: 'image',
      dataIndex: 'image',
      title: 'Hình ảnh',
      render: (__id, record) =>
        record.image != '' ? (
          <Avatar
            src={record.image}
            shape='square'
            size={84}
          />
        ) : (
          <Avatar
            style={{ backgroundColor: '#de7300' }}
            shape='square'
            size={84}
          >
            {record.name && record.name.charAt(0)}
          </Avatar>
        ),
      align: 'center',
    },

    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên',
      align: 'center',
    },

    {
      key: 'price',
      dataIndex: 'price',
      title: 'Giá',
      render: (__index, record) => (
        <span className='tracking-[0.5px]'>{record?.price ? formatCurrencyVND(record.price) : ''}</span>
      ),
      align: 'center',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'types',
      key: 'types',
      align: 'center',
      render: (__index, record) => (
        <Select
          style={{ minWidth: 'calc(100% + 16px)' }}
          mode='multiple'
          tagRender={tagRender}
          className=' rounded-lg !max-w-[200px] border-2 border-gray bg-white dark:bg-boxdark'
          value={record?.types}
          onChange={(typeValue) => handleUpdateProductTypes(record._id, typeValue)}
          showSearch={false}
          options={ProductStatusOptions}
        />
      ),
      responsive: ['lg'],
    },
    {
      title: 'Hành động',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      render: (__id, record) => (
        <div className='flex justify-center gap-2 text-center'>
          <div>
            <Button
              type='primary'
              className={`!flex items-center justify-center !rounded-lg  text-center border border-solid !border-warning !bg-warning
              } `}
              onClick={() => record?._id && handleShowModalProduct(ModalType.UPDATE, record?._id)}
            >
              <EditOutlined />
            </Button>
          </div>
          {/* <Button
            type='primary'
            className='!flex items-center justify-center !rounded-lg !bg-primary border border-solid !border-primary !text-white'
            onClick={() => handleShowProductDetailModal(record._id)}
          >
            <InfoCircleOutlined />
          </Button> */}
          <Popconfirm
            title='Xác nhận xóa sản phẩm này?'
            className=' flex items-center'
            onConfirm={() => {
              handleDelete(record._id);
            }}
            okText='Có'
            cancelText='Không'
          >
            <Button
              type={'danger' as 'primary'}
              className='flex r items-center justify-center !rounded-lg'
            >
              <DeleteOutlined className='!flex' />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleShowModalProduct = async (type: ModalType, productId: string) => {
    const productItem = await productService.getProductDetail(productId);
    onSetPropsProduct({
      modalType: type,
      showModal: true,
      product: productItem,
    });
  };

  const onProductSelectedChange = (newSelectedRowKeys: React.Key[]) => {
    setProductSelectedKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    productSelectedKeys,
    onChange: onProductSelectedChange,
  };

  const pagination = useMemo(() => {
    const current = data?.pages?.[data?.pages?.length - 1].pageIndex;
    const total = data?.pages?.[data?.pages?.length - 1].totalElement;
    const pageSize = data?.pages[data?.pages.length - 1].pageSize;
    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total,
      pageSize: pageSize,
    };
  }, [data]);

  const handleDelete = async (ids: any) => {
    setIsLoading(true);
    if (ids) {
      try {
        await productService.deleteProduct(ids);
        toast.success('Xóa sản phẩm thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '🤪',
        });
        if (Array.isArray(ids)) {
          setIsLoadingDeleteMulti(false);
          setProductSelectedKeys([]);
          handleOpenOrCloseConfirmDeleteMultiModal();
        }
        refreshData();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.success('Lỗi khi xóa sản phẩm', {
          position: 'bottom-right',
          duration: 4000,
          icon: '😞',
        });
      }
    }
  };
  const handleUpdateProductTypes = async (id: any, types: ProductType[]) => {
    setIsLoading(true);

    if (id) {
      try {
        const formData = new FormData();
        formData.append('productInfo', JSON.stringify({ types: types?.length > 0 ? types : ProductType.NORMAL }));
        await productService.updateProduct(formData, id);
        toast.success('Cập nhật sản phẩm thành công', {
          position: 'bottom-right',
          duration: 4000,
          icon: '🤪',
        });

        if (Array.isArray(id)) {
          setProductSelectedKeys([]);
          setProductTypeSelectedKeys([]);
        }
        setIsLoading(false);
        refreshData();
      } catch (error) {
        console.log(error);
        toast.success('Lỗi khi cập nhật sản phẩm', {
          position: 'bottom-right',
          duration: 4000,
          icon: '😞',
        });
        setIsLoading(true);
      }
    }
  };

  const handleMultiUpdateProductType = () => {
    handleUpdateProductTypes(productSelectedKeys, productTypeSelectedKeys);
  };

  const handleConfirmDeleteMulti = () => {
    setIsLoadingDeleteMulti(true);
    handleDelete(productSelectedKeys);
  };

  const handleCancelDeleteMulti = () => {
    handleOpenOrCloseConfirmDeleteMultiModal();
    setIsLoadingDeleteMulti(false);
  };

  const handleOpenOrCloseConfirmDeleteMultiModal = () => {
    setShowConfirmDeleteMultiModal(!showConfirmDeleteMultiModal);
  };

  return (
    <>
      <div className='mb-2 flex justify-between flex-wrap w-full items-center gap-2'>
        {/* {productSelectedKeys.length > 0 && (
          <div className='flex gap-2 items-center w-full mb-2 mt-2'>
            <Select
              mode='multiple'
              className='flex items-center rounded-lg lg:w-[20%] md:w-[40%] sm:w-[40%] w-[40%] p-2  border-2 border-gray bg-white  dark:bg-boxdark '
              tagRender={tagRender}
              placeholder='Thay đổi loại sản phẩm'
              onChange={(value) => setProductTypeSelectedKeys(value)}
              showSearch={false}
              options={ProductStatusOptions}
            />
            <Button
              type={'primary'}
              className={`!flex items-center justify-center !rounded-lg  ${
                productSelectedKeys.length > 0 ? '' : 'opacity-0'
              }`}
              onClick={handleMultiUpdateProductType}
            >
              Cập nhật
            </Button>
          </div>
        )}{' '} */}
        <Button
          type={'danger' as 'primary'}
          className={`!flex items-center  justify-end !rounded-md !py-4.5  ${
            productSelectedKeys.length > 0 ? '' : 'opacity-0'
          }`}
          onClick={() => {
            handleOpenOrCloseConfirmDeleteMultiModal();
          }}
        >
          <DeleteOutlined className='!flex' />
          Xóa sản phẩm được chọn
        </Button>
      </div>
      <Table
        rowKey='_id'
        rowSelection={rowSelection}
        dataSource={data?.pages[data?.pages?.length - 1]?.data}
        columns={COLUMNS}
        className='rounded-sm border border-stroke bg-white pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
        rowClassName='text-black dark:text-white'
        pagination={{
          current: pagination.pageCurrent,
          pageSize: pagination.pageSize,
          total: pagination.totalElements,
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='Không có dữ liệu'
            />
          ),
        }}
      />
      <Modal
        title='Bạn có muốn ?'
        open={showConfirmDeleteMultiModal}
        confirmLoading={isLoadingDeleteMulti}
        onCancel={handleCancelDeleteMulti}
        footer={[
          <Button onClick={handleCancelDeleteMulti}>Hủy</Button>,
          <Button
            form='form-user'
            key='submit'
            htmlType='submit'
            className='!bg-primary !text-white border border-solid !border-primary'
            onClick={handleConfirmDeleteMulti}
          >
            Đồng ý
          </Button>,
        ]}
      >
        <p>{'Bạn có chắc chắn muốn xóa các sản phẩm vừa chọn không? '}</p>
      </Modal>
      <ProductDetailModal
        isShowProductDetailModal={showProductDetailModal.isShowProductDetailModal}
        productID={showProductDetailModal.productID}
        handleCancelModal={handleCloseProductDetailModal}
        handleConfirmModal={handleCloseProductDetailModal}
      />

      <ProductModal
        visible={propsProduct.showModal}
        modalType={propsProduct.modalType}
        onClose={onClose}
        refetchData={refreshData}
        product={propsProduct.product}
      />
      {isLoading && <Loading />}
    </>
  );
};

export default ProductTable;
