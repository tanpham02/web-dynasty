import { Button, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';

import { globalLoading } from '~/components/GlobalLoading';
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import { MUTATE_KEY } from '~/constants/mutateKey';
import { QUERY_KEY } from '~/constants/queryKey';
import { bannerService } from '~/services/bannerService';
import { BannerItem, FormBannerModal } from './components';

const BannerPage = () => {
  const { isOpen, onClose, onOpenChange } = useDisclosure();

  const { isOpen: isOpenModalDelete, onOpenChange: onOpenChangeModalDelete } =
    useDisclosure();

  const { enqueueSnackbar } = useSnackbar();

  const [bannerUpdateId, setBannerUpdateId] = useState<string>('');

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>({});

  const { data: banners, refetch: refetchBanner } = useQuery({
    queryKey: [QUERY_KEY.BANNER],
    queryFn: async () => {
      const bannerResponse = await bannerService.getBanner();
      if (Array.isArray(bannerResponse) && bannerResponse.length > 0) {
        return bannerResponse
          .sort((a, b) => Number(a?.priority) - Number(b?.priority))
          .map((banner, index) => ({ ...banner, priority: index + 1 }));
      }
      return [];
    },
  });

  const handleUpdateBannerById = (bannerId?: string) => {
    if (!bannerId) return;

    setBannerUpdateId(bannerId);
    onOpenChange();
  };

  const handleDeleteBannerById = async (bannerId?: string) => {
    if (!bannerId) return;

    try {
      await bannerService.deleteBanner([bannerId]);
      await refetchBanner();
      enqueueSnackbar('Xóa banner thành công!');
    } catch (err) {
      console.log('🚀 ~ handleDeleteBannerById ~ err:', err);
      enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
        variant: 'error',
      });
    } finally {
      onOpenChangeModalDelete();
    }
  };

  const { isLoading: isDeletingBanner, mutate: executeDeleteBanner } =
    useMutation({
      mutationKey: [MUTATE_KEY.BANNER, modalDelete?.id],
      mutationFn: handleDeleteBannerById,
    });

  const handleSwapBannerPosition = async (result: DropResult) => {
    // dropped outside the list
    if (!result.destination || !Array.isArray(banners)) return;

    const sourceItem = banners[result.source.index];
    const destinationItem = banners[result.destination.index];

    if (!sourceItem?._id || !destinationItem?._id) return;

    if (
      sourceItem?.priority === result.destination.index + 1 ||
      destinationItem?.priority === result.source.index + 1
    )
      return;

    try {
      globalLoading.show();
      const formDataSourceItem = new FormData();
      const formDataDestinationItem = new FormData();

      formDataSourceItem.append(
        'bannerInfo',
        JSON.stringify({
          priority: destinationItem?.priority || 1,
        }),
      );
      formDataDestinationItem.append(
        'bannerInfo',
        JSON.stringify({
          priority: sourceItem?.priority || 1,
        }),
      );
      await Promise.all([
        bannerService.updateBanner(sourceItem?._id, formDataSourceItem),
        bannerService.updateBanner(
          destinationItem?._id,
          formDataDestinationItem,
        ),
      ]);
      await refetchBanner();
      enqueueSnackbar('Cập nhật thứ tự banner thành công!');
    } catch (err) {
      console.log('🚀 ~ handleSwapBannerPosition ~ err:', err);
      enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
        variant: 'error',
      });
    } finally {
      globalLoading.hide();
    }
  };

  return (
    <>
      <CustomBreadcrumb
        pageName="Banner quảng cáo"
        routes={[
          {
            label: 'Danh sách banner quảng cáo',
          },
        ]}
      />
      <div className="space-y-4">
        <div className="mb-2 mt-4 flex justify-end">
          <Button color="primary" variant="shadow" onClick={onOpenChange}>
            Thêm banner mới
          </Button>
        </div>
        <DragDropContext onDragEnd={handleSwapBannerPosition}>
          <Droppable droppableId="droppable">
            {(
              provided: DroppableProvided,
              snapshot: DroppableStateSnapshot,
            ) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {banners?.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id as string}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <BannerItem
                          {...item}
                          key={item?._id}
                          isDragging={snapshot.isDraggingOver}
                          onUpdate={() => handleUpdateBannerById(item?._id)}
                          onDelete={() => {
                            setModalDelete({
                              id: item?._id,
                              desc: `Bạn có chắc muốn xóa banner ${item?.name} này không?`,
                            });
                            onOpenChangeModalDelete();
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <FormBannerModal
        isOpen={isOpen}
        onClose={() => {
          setBannerUpdateId('');
          onClose();
        }}
        bannerId={bannerUpdateId}
        refetchData={refetchBanner}
        lengthBanners={banners?.length}
      />
      <ModalConfirmDelete
        {...modalDelete}
        isOpen={isOpenModalDelete}
        isLoading={isDeletingBanner}
        onOpenChange={onOpenChangeModalDelete}
        onAgree={() => executeDeleteBanner(modalDelete?.id)}
      />
    </>
  );
};

export default BannerPage;
