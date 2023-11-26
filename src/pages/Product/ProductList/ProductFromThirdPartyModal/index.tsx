import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import { Table, Avatar, Skeleton, TablePaginationConfig, Tooltip, Button, TreeSelect, Modal } from 'antd';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService } from '~/services/productService';
import { Product } from '~/models/product';
import { CheckCircleOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { QUERY_KEY } from '~/constants/querryKey';
// import useDebounce from '~/hooks/useDebounce';
import { Breakpoint, SearchParams } from '~/types';
import { toast } from 'react-hot-toast';
import ProductDetailModal from '../ProductDetailModal';
import useDebounce from '~/hooks/useDebounce';
import productCategoryService from '~/services/productCategoryService';

interface TreeSelectChildren {
  title?: string;
  value?: string;
}
interface TreeSelectParent {
  title?: string;
  value?: string;
  children?: TreeSelectChildren[];
}
interface Columns {
  title?: string;
  dataIndex?: keyof Product;
  key?: keyof Product;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Product) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface ProductFromThirdPartyModalProps {
  handleOpenProductModal: () => void;
  refreshProductInZaloMiniAppData: () => void;
  showModal: boolean;
}

const PRODUCT_ID_WHEN_EMPTY = -100;

const ProductFromThirdPartyModal = ({
  handleOpenProductModal,
  refreshProductInZaloMiniAppData,
  showModal,
}: ProductFromThirdPartyModalProps) => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [productSelectedKeys, setProductSelectedKeys] = useState<React.Key[]>([]);
  console.log('🚀 ~ file: index.tsx:54 ~ productSelectedKeys:', productSelectedKeys);
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valueCategoryFilter, setValueCategoryFilter] = useState<string>();
  const queryText = useDebounce(valueSearch, 700);

  const [showProductDetailModal, setShowProductDetailModal] = useState<{
    isShowProductDetailModal: boolean;
    productID: string;
  }>({
    isShowProductDetailModal: false,
    productID: `${PRODUCT_ID_WHEN_EMPTY}`,
  });

  const onProductSelectedChange = (newSelectedRowKeys: React.Key[]) => {
    setProductSelectedKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    productSelectedKeys,
    onChange: onProductSelectedChange,
    getCheckboxProps: (record: Product) => ({
      disabled: record.existInDatabase,
      key: record.id,
    }),
    renderCell(__checked: boolean, record: Product, __index: number, node: any) {
      if (record.existInDatabase) {
        return (
          <Tooltip title='Đã hiển thị'>
            <CheckCircleOutlined style={{ color: '#219653' }} />
          </Tooltip>
        );
      }
      return node;
    },
  };

  const COLUMNS: Columns[] = [
    {
      key: 'nhanhVnId',
      dataIndex: 'id',
      title: 'NhanhVn ID',
      align: 'center',
      render: (__index, record: Product) => <span>{record.nhanhVnId}</span>,
      responsive: ['xl'],
    },
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
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên',
    },

    {
      key: 'price',
      dataIndex: 'price',
      title: 'Giá',
      sorter: true,
      align: 'center',
    },

    {
      title: 'Trạng thái ở Nhanh VN',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__index, record) => (
        <div
          className={
            record.status === 'ACTIVE'
              ? 'inline-flex items-center rounded-lg bg-success px-3 py-1 text-center font-semibold  text-white'
              : 'inline-flex items-center rounded-lg bg-danger px-3 py-1 text-center font-semibold  text-white'
          }
        >
          {record.status == 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
        </div>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Hiển thị trên Zalo Mini App',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__index, record) => (
        <div
          className={
            record.existInDatabase
              ? 'inline-flex items-center rounded-lg bg-success  px-3 py-1 text-center font-semibold  text-white'
              : 'inline-flex items-center rounded-lg bg-danger  px-3 py-1 text-center font-semibold  text-white'
          }
        >
          {record.existInDatabase ? 'Đã hiển thị' : 'Chưa hiển thị'}
        </div>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Hành động',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__id, record) => (
        <div className='flex justify-center gap-2 text-center'>
          <Button
            type='primary'
            className='!flex items-center justify-center !rounded-lg'
            onClick={() => handleShowProductDetailModal(record.nhanhVnId)}
          >
            <InfoCircleOutlined />
          </Button>
        </div>
      ),
    },
  ];

  const { data: productCategory } = useQuery([QUERY_KEY.PRODUCT_CATEGORY_FROM_THIRD_PARTY], async () => {
    return await productCategoryService.getAllProductCategoryFromThirdParty();
  });

  const {
    data: productFromThirdPartyResponse,
    isLoading: isLoadingProduct,
    refetch: refreshProductFromThirdPartyData,
  } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_FROM_THIRD_PARTY, pageParameter, queryText, valueCategoryFilter], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        categoryId: valueCategoryFilter,
        page: pageParameter.page,
        pageSize: pageParameter.pageSize,
        name: queryText,
      };
      return await productService.getProductFromThirdParty(params);
    },
    { enabled: showModal },
  );

  const generateOptionTreeSelect = useMemo(() => {
    const result: TreeSelectParent[] = [{ title: 'Tất cả', value: '' }];
    productCategory?.map((parent) => {
      if (parent.childCategoryDTOs) {
        const childCategory = parent?.childCategoryDTOs?.map((child) => ({
          title: child.name,
          value: child.nhanhVnId,
        }));

        result.push({
          title: parent.name,
          value: parent.nhanhVnId,
          children: childCategory,
        });
      } else {
        result.push({
          title: parent.name,
          value: parent.nhanhVnId,
        });
      }
    });

    return result;
  }, [productCategory]);

  const pagination = useMemo(() => {
    const current =
      productFromThirdPartyResponse?.pages[productFromThirdPartyResponse?.pages.length - 1].pageable.pageNumber;
    const total = productFromThirdPartyResponse?.pages[productFromThirdPartyResponse?.pages.length - 1].totalElements;
    const pageSize =
      productFromThirdPartyResponse?.pages[productFromThirdPartyResponse?.pages.length - 1].pageable.pageSize;
    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total || 0,
      pageSize: pageSize,
    };
  }, [productFromThirdPartyResponse]);

  const handleTableChange = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && paginationFromTable.pageSize)
      setPageParameter({
        page: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  const handleAddProductCategoryFromThirdPartyToZaloMiniApp = async () => {
    if (productSelectedKeys.length !== 0 && productFromThirdPartyResponse) {
      const listProductSelected: Product[] = [];
      productFromThirdPartyResponse.pages.map((productFromThirdPartyResponsePerPage) => {
        productFromThirdPartyResponsePerPage.content.filter(
          (product) =>
            product.nhanhVnId && productSelectedKeys.includes(product.nhanhVnId) && listProductSelected.push(product),
        );
      });

      if (listProductSelected) {
        try {
          await productService.addProductFromThirdPartyToZaloMiniApp(listProductSelected);
          toast.success('Thêm sản phẩm vào Zalo Mini App thành công', {
            position: 'bottom-right',
            duration: 3500,
            icon: '👏',
          });
          setProductSelectedKeys([]);
          refreshProductFromThirdPartyData();
          refreshProductInZaloMiniAppData();
          handleOpenProductModal();
        } catch (error) {
          console.log(error);
          toast.error('Lỗi khi thêm danh mục sản phẩm vào Mini App');
        }
      }
    }
  };

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

  return (
    // <div
    //   className='fixed z-[999] top-0 bottom-0 right-0 left-0 3xl:px-60 lg:px-60 md:px-10 xsm:px-5 rounded-2xl flex justify-center items-end bg-[#00000066] '
    //   onClick={() => handleOpenProductModal()}
    // >
    //   <div
    //     onClick={() => handleOpenProductModal()}
    //     className=' bg-white w-full my-auto p-8 rounded-2xl relative'
    //   >
    //     <CloseOutlined
    //       style={{
    //         fontSize: '16px',
    //         color: '#000',
    //         fontWeight: 600,
    //         position: 'absolute',
    //         top: 17,
    //         right: 26,
    //         cursor: 'pointer',
    //         padding: 8,
    //       }}
    //     />
    //     <div
    //       onClick={(e) => e.stopPropagation()}
    //       className=''
    //     >
    //       <div className='flex items-center gap-2 lg:w-[75%] md:w-[75%] py-4 '>
    //         <span className='font-bold text-xl'>{'Danh sách sản phẩm được lấy từ NhanhVN'}</span>
    //       </div>
    //       <div className='flex items-center flex-row lg:w-1/2 sm:w-3/4 xs:w-full flex-wrap  gap-2'>
    //         <div className='my-2 flex flex-1 items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark '>
    //           <SVG src={SEARCH_ICON} />
    //           <input
    //             type='text'
    //             placeholder='Tìm kiếm...'
    //             className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
    //             onChange={(e) => setValueSearch(e.target.value)}
    //           />
    //         </div>

    //         <TreeSelect
    //           className={`flex items-center flex-1 rounded-lg w-full px-2 lg:h-[80%] h-[80%] border-2 border-gray bg-white p-2 dark:bg-boxdark `}
    //           value={valueCategoryFilter}
    //           dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    //           treeData={generateOptionTreeSelect}
    //           placeholder='Chọn danh mục sản phẩm'
    //           treeDefaultExpandAll
    //           onChange={(value) => setValueCategoryFilter(value)}
    //         />

    //         <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white'>Tìm</button>
    //       </div>
    //       {isLoadingProduct ? (
    //         <>
    //           <Skeleton />
    //           <Skeleton />
    //           <Skeleton />
    //           <Skeleton />
    //         </>
    //       ) : (
    //         <Table
    //           rowSelection={rowSelection}
    //           rowKey='nhanhVnId'
    //           columns={COLUMNS}
    //           dataSource={
    //             productFromThirdPartyResponse?.pages[productFromThirdPartyResponse?.pages.length - 1]?.content
    //           }
    //           className='product-list rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 '
    //           scroll={{ y: '45vh' }}
    //           pagination={{
    //             current: pagination.pageCurrent,
    //             pageSize: pagination.pageSize,
    //             total: pagination.totalElements,
    //           }}
    //           onChange={handleTableChange}
    //         />
    //       )}

    //       {/* <div className={`flex ${productSelectedKeys.length > 0 ? 'justify-between' : 'justify-end'} mt-5 `}>
    //         {productSelectedKeys.length > 0 && (
    //           <div className='flex items-center'>
    //             <span className='font-bold text-sm'>{`Bạn đã chọn ${productSelectedKeys.length} sản phẩm`}</span>
    //           </div>
    //         )}

    //         <div>
    //           <button
    //             className='w-auto px-8 py-2 rounded-lg border-2 border-gray border-solid font-medium hover:bg-stroke'
    //             onClick={() => handleOpenProductModal()}
    //           >
    //             Hủy bỏ
    //           </button>
    //           <button
    //             className={`w-auto px-8 py-2 ml-3 rounded-lg font-medium ${
    //               productSelectedKeys.length == 0 ? 'bg-stroke ' : 'bg-menu-color hover:bg-primary'
    //             }  text-white`}
    //             disabled={productSelectedKeys.length == 0}
    //             onClick={handleAddProductCategoryFromThirdPartyToZaloMiniApp}
    //           >
    //             Thêm vào Mini App
    //           </button>
    //         </div>
    //       </div> */}

    //       <ProductDetailModal
    //         isShowProductDetailModal={showProductDetailModal.isShowProductDetailModal}
    //         productID={showProductDetailModal.productID}
    //         handleCancelModal={handleCloseProductDetailModal}
    //         handleConfirmModal={handleCloseProductDetailModal}
    //       />
    //     </div>
    //   </div>
    // </div>
    <Modal
      open={showModal}
      title='Danh sách sản phẩm được lấy từ NhanhVN'
      width={'80%'}
      onCancel={() => handleOpenProductModal()}
      footer={[
        <div className={`flex ${productSelectedKeys.length > 0 ? 'justify-between' : 'justify-end'} mt-5 `}>
          {productSelectedKeys.length > 0 && (
            <div className='flex items-center'>
              <span className='font-bold text-sm'>{`Bạn đã chọn ${productSelectedKeys.length} sản phẩm`}</span>
            </div>
          )}
          <div>
            <button
              className='w-auto px-8 py-2 rounded-lg border-2 border-gray border-solid font-medium hover:bg-stroke'
              onClick={() => handleOpenProductModal()}
            >
              Hủy bỏ
            </button>
            <button
              className={`w-auto px-8 py-2 ml-3 rounded-lg font-medium ${
                productSelectedKeys.length == 0 ? 'bg-stroke ' : 'bg-menu-color hover:bg-primary'
              }  text-white`}
              disabled={productSelectedKeys.length == 0}
              onClick={handleAddProductCategoryFromThirdPartyToZaloMiniApp}
            >
              Thêm vào Mini App
            </button>
          </div>
        </div>,
      ]}
    >
      <div className='flex items-center flex-row xl:w-1/2 lg:w-3/4 sm:w-3/4 xs:w-full flex-wrap  gap-2'>
        <div className='my-2 flex flex-1 items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark '>
          <SVG src={SEARCH_ICON} />
          <input
            type='text'
            placeholder='Tìm kiếm...'
            className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
            onChange={(e) => setValueSearch(e.target.value)}
          />
        </div>

        <TreeSelect
          className={`flex items-center flex-1 rounded-lg w-full px-2 lg:h-[80%] h-[80%] border-2 border-gray bg-white p-2 dark:bg-boxdark `}
          value={valueCategoryFilter}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={generateOptionTreeSelect}
          placeholder='Chọn danh mục sản phẩm'
          treeDefaultExpandAll
          onChange={(value) => setValueCategoryFilter(value)}
        />

        <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white'>Tìm</button>
      </div>
      {isLoadingProduct ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <Table
          rowSelection={rowSelection}
          rowKey='nhanhVnId'
          columns={COLUMNS}
          dataSource={productFromThirdPartyResponse?.pages[productFromThirdPartyResponse?.pages.length - 1]?.content}
          className='product-list rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 '
          scroll={{ y: '45vh' }}
          pagination={{
            current: pagination.pageCurrent,
            pageSize: pagination.pageSize,
            total: pagination.totalElements,
          }}
          onChange={handleTableChange}
        />
      )}
      <ProductDetailModal
        isShowProductDetailModal={showProductDetailModal.isShowProductDetailModal}
        productID={showProductDetailModal.productID}
        handleCancelModal={handleCloseProductDetailModal}
        handleConfirmModal={handleCloseProductDetailModal}
      />
    </Modal>
  );
};

export default ProductFromThirdPartyModal;
