import ProductCategoryTable from "./ProductCategoryTable";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "~/constants/queryKey";
import productCategoryService from "~/services/productCategoryService";
import { Skeleton } from "antd";
import { useState } from "react";
import ProductCategoryFromThirdPartyModal from "./ProductCategoryModal";

const ProductCategoryListPage = () => {
  const [
    showProductCategoryFromThirdPartyModal,
    setShowProductCategoryFromThirdPartyModal,
  ] = useState<boolean>(false);

  const {
    data: productCategoryInZaloMiniApp,
    refetch,
    isLoading: isLoadingProductCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_CATEGORY_IN_ZALO_MINI_APP],
    async () => {
      return await productCategoryService.getAllProductCategoryInZaloMiniApp(0);
    },
  );

  const handleOpenProductCategoryFromThirdPartyModal = () => {
    refetch();
    setShowProductCategoryFromThirdPartyModal(
      !showProductCategoryFromThirdPartyModal,
    );
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 w-full mb-2">
        <span className="font-bold text-xl">{"Danh mục sản phẩm"}</span>
        <button
          className="rounded-lg bg-primary px-4 py-2 font-normal text-white"
          onClick={handleOpenProductCategoryFromThirdPartyModal}
        >
          Thêm danh mục sản phẩm vào Zalo Mini App
        </button>
      </div>
      {isLoadingProductCategory ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        productCategoryInZaloMiniApp && (
          <ProductCategoryTable
            data={productCategoryInZaloMiniApp}
            refreshData={refetch}
          />
        )
      )}
      {showProductCategoryFromThirdPartyModal && (
        <ProductCategoryFromThirdPartyModal
          handleOpenProductCategoryFromThirdPartyModal={
            handleOpenProductCategoryFromThirdPartyModal
          }
        />
      )}
    </>
  );
};

export default ProductCategoryListPage;
