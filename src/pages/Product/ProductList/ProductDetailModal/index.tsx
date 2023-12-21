import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Button,
  Carousel,
  Col,
  Empty,
  Image,
  Modal,
  Row,
  Skeleton,
  Table,
  Typography,
} from "antd";
import * as React from "react";
import { QUERY_KEY } from "~/constants/querryKey";
import { Product } from "~/models/product";
import { productService } from "~/services/productService";
import { formatCurrencyVND } from "~/utils/number";

interface ProductDetailModalProps {
  productID: string;
  isShowProductDetailModal: boolean;
  handleConfirmModal: () => void;
  handleCancelModal: () => void;
}

interface Columns {
  title?: string;
  dataIndex?: keyof Product;
  key?: keyof Product;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, record: Product) => React.ReactNode;
}

const COLUMNS: Columns[] = [
  {
    key: "nhanhVnId",
    dataIndex: "id",
    title: "NhanhVn ID",
    align: "center",
    render: (__index, record: Product) => <span>{record.nhanhVnId}</span>,
  },

  {
    key: "name",
    dataIndex: "name",
    title: "Tên",
  },

  {
    key: "price",
    dataIndex: "price",
    title: "Giá",
  },
];

const ProductDetailModal = ({
  productID,
  handleConfirmModal,
  handleCancelModal,
  isShowProductDetailModal,
}: ProductDetailModalProps) => {
  const { data: productDetail, isLoading: isLoadingProductDetail } =
    useInfiniteQuery(
      [QUERY_KEY.PRODUCT_DETAIL, productID],
      async () => {
        if (productID != "-100") {
          return await productService.getProductDetail(productID);
        }
      },
      { enabled: productID != "-100" },
    );

  return (
    <Modal
      className="min-w-[60%] min-h-[40%] z-[9999]"
      open={isShowProductDetailModal}
      title="Thông tin chi tiết của sản phẩm"
      onOk={handleConfirmModal}
      onCancel={handleCancelModal}
      footer={[
        <Button key="back" onClick={handleCancelModal}>
          Tắt
        </Button>,
      ]}
    >
      {isLoadingProductDetail ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <>
          <Row gutter={5}>
            <Col span={10}>
              <Carousel autoplay>
                {productDetail?.pages[0]?.images &&
                productDetail?.pages[0]?.images.length > 0 &&
                Array.isArray(productDetail?.pages[0]?.images) ? (
                  productDetail?.pages[0]?.images?.map((image) => (
                    <Image
                      className="object-cover"
                      src={image}
                      width={350}
                      height={350}
                      preview={false}
                    />
                  ))
                ) : productDetail?.pages[0]?.image == "" ? (
                  <Empty description="Không có hình ảnh" />
                ) : (
                  <Image
                    preview={false}
                    className="object-cover"
                    src={productDetail?.pages[0]?.image}
                    width={350}
                    height={350}
                  />
                )}
              </Carousel>
            </Col>
            <Col span={14}>
              {" "}
              <Row className="mt-1">
                <Col span={12}>
                  <Typography>
                    Mã NhanhVN ID:{" "}
                    <span className="font-bold">
                      {productDetail?.pages[0]?.nhanhVnId}
                    </span>
                  </Typography>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col span={12}>
                  <Typography>
                    Tên sản phẩm:{" "}
                    <span className="font-bold">
                      {productDetail?.pages[0]?.name}
                    </span>
                  </Typography>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col span={12}>
                  <Typography>
                    Giá cũ :{" "}
                    <span className="font-bold">
                      {formatCurrencyVND(
                        productDetail?.pages[0]?.oldPrice || 0,
                      )}
                    </span>{" "}
                  </Typography>
                </Col>
                <Col span={12}>
                  <Typography>
                    Giá mới :{" "}
                    <span className="font-bold">
                      {formatCurrencyVND(productDetail?.pages[0]?.price || 0)}
                    </span>{" "}
                  </Typography>
                </Col>
              </Row>
              {/* <Row className='mt-4'>
                <Col span={24}>
                  <Typography>
                    Mô tả : <span className='font-bold'>{productDetail?.pages[0]?.description}</span>
                  </Typography>
                </Col>
                <Col span={12}></Col>
              </Row> */}
            </Col>
          </Row>

          <Typography>
            Sản phẩm con ( biến thể sản phẩm ):{" "}
            <span className="font-bold">{`${
              productDetail?.pages[0]?.childProductDTOs?.length || 0
            } sản phẩm`}</span>
          </Typography>

          {productDetail?.pages[0]?.childProductDTOs &&
            productDetail?.pages[0]?.childProductDTOs.length > 0 && (
              <Table
                rowKey="id"
                dataSource={productDetail?.pages[0]?.childProductDTOs}
                columns={COLUMNS}
                className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
                rowClassName="text-black dark:text-white"
                scroll={{ y: "20vh" }}
                pagination={false}
              />
            )}
        </>
      )}
    </Modal>
  );
};

export default ProductDetailModal;
