import SVG from "react-inlinesvg";
import SelectCustom from "~/components/customs/Select";
import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "~/constants/queryKey";
import { Button, Modal, Skeleton, TablePaginationConfig } from "antd";
import useDebounce from "~/hooks/useDebounce";
import trash from "~/assets/svg/trash.svg";
import { toast } from "react-hot-toast";
import { SearchParams } from "~/types";
import { Banner, BannerType } from "~/models/banner";
import BannerTable from "./BannerTable";
import BannerModal, { ModalType } from "./BannerModal";
import { bannerService } from "~/services/bannerService";

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  banner?: Banner;
}

const BannerPage = () => {
  const [showDeleteBannerModal, setShowDeleteBannerModal] =
    useState<boolean>(false);
  const [bannerModal, setBannerModal] = useState<ModalKey>({
    visible: false,
  });
  const [filterStatus, setFilterStatus] = useState<BannerType | string>("");
  const [listIdsUserForDelete, setListIdsUserForDelete] = useState<React.Key[]>(
    [],
  );
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [pagination, setPagination] = useState<SearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });

  const optionStatus = [
    {
      value: "",
      label: "Tất cả",
    },
    {
      value: BannerType.CATEGORY,
      label: "Danh mục",
    },
    {
      value: BannerType.PRODUCT,
      label: "Sản phẩm",
    },
    {
      value: BannerType.NEWS,
      label: "Tin tức",
    },
  ];

  const filterByType = useDebounce(filterStatus, 500);

  const {
    data: banners,
    refetch,
    isLoading: isLoadingBanner,
  } = useInfiniteQuery(
    [QUERY_KEY.BANNER, filterByType, pagination],
    async () => {
      const params = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        bannerType: filterByType,
      };
      return await bannerService.getBanner(params);
    },
  );

  const handleShowModalDeleteUser = () => {
    setShowDeleteBannerModal(true);
  };

  const handleGetPagination = (paginationFromTable: TablePaginationConfig) => {
    console.log(paginationFromTable);
    if (paginationFromTable.current && pagination.pageSize)
      setPagination({
        pageIndex: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  const handleOk = () => {
    handleDeleteBanner(listIdsUserForDelete);
  };

  const handleCancel = () => {
    setShowDeleteBannerModal(false);
  };

  useEffect(() => {
    if (banners) {
      if (banners?.pages?.[0].content.length <= 0) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev?.pageIndex && prev?.pageIndex - 1,
        }));
      }
    }
  }, [banners]);

  const handleShowModalBanner = (type?: ModalType, bannerId?: number) => {
    if (bannerId) {
      const bannerAfterFindById = banners?.pages[
        banners?.pages.length - 1
      ].content.find((banner) => banner.id === bannerId);
      setBannerModal({
        type,
        banner: bannerAfterFindById,
        visible: true,
      });
    } else {
      setBannerModal({
        type,
        visible: true,
      });
    }
  };

  const handleDeleteBanner = async (ids: any) => {
    setIsLoadingDelete(true);
    try {
      await bannerService.deleteBanner(ids);
      toast.success("Xóa thành công", {
        position: "bottom-right",
        duration: 3000,
        icon: "👏",
        style: { width: "70%" },
      });

      setIsLoadingDelete(false);
      if (Array.isArray(ids)) {
        setListIdsUserForDelete([]);
        if (!isLoadingDelete) {
          setShowDeleteBannerModal(false);
        }
      }
      refetch();
    } catch (err) {
      console.log(err);
      toast.success("Xóa thất bại", {
        position: "bottom-right",
        duration: 3500,
        icon: "😔",
      });
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <span className="font-bold text-xl">Danh sách Banner</span>
        <button
          className="rounded-lg bg-primary px-4 py-2 font-normal text-white"
          onClick={() => handleShowModalBanner(ModalType.CREATE)}
        >
          Thêm banner
        </button>
      </div>

      <div className="mb-2 flex flex-row justify-between flex-wrap  items-center gap-2">
        <div className="flex items-center gap-2 xl:w-[25%] lg:w-[40%] sm:w-[40%] w-[75%]">
          <SelectCustom
            options={optionStatus}
            defaultValue={optionStatus[0]}
            className="flex w-full items-center rounded-lg "
            placeholder="Trạng thái"
            onChange={(e: any) => setFilterStatus(e.value)}
          />

          <button className="rounded-lg bg-primary px-4 py-2 font-normal text-white  ">
            Tìm
          </button>
        </div>
        {listIdsUserForDelete.length !== 0 ? (
          <div
            className="rounded-lg cursor-pointer transition duration-1000 linear bg-danger mt-2 mb-1 px-4 py-2 font-normal text-white flex items-center justify-between float-right"
            onClick={handleShowModalDeleteUser}
          >
            <SVG src={trash} className="mr-1" />
            Xóa danh sách đã chọn
          </div>
        ) : (
          ""
        )}
      </div>

      {showDeleteBannerModal && (
        <Modal
          title={`Xác nhận xóa danh sách banner này`}
          open={showDeleteBannerModal}
          onCancel={handleCancel}
          footer={[
            <Button title="cancel" onClick={handleCancel}>
              Hủy bỏ
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              loading={isLoadingDelete}
            >
              Xác nhận xóa
            </Button>,
          ]}
        />
      )}
      {isLoadingBanner ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <BannerTable
          data={banners?.pages[banners?.pages?.length - 1]}
          refreshData={refetch}
          onGetPagination={handleGetPagination}
          handleDeleteOneBanner={handleDeleteBanner}
          handleChangeListIdsBannerForDelete={setListIdsUserForDelete}
          handleShowModalBanner={handleShowModalBanner}
        />
      )}
      {bannerModal.visible && (
        <BannerModal
          refetchData={refetch}
          onClose={() => setBannerModal({ visible: false })}
          visible={bannerModal.visible}
          modalType={bannerModal.type}
          banner={bannerModal.banner}
        />
      )}
    </>
  );
};

export default BannerPage;
