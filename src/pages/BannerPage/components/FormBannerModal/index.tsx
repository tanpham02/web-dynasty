import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextUpload from '~/components/NextUI/Form/FormContextUpload';
import { QUERY_KEY } from '~/constants/queryKey';
import { Banner } from '~/models/banner';
import { bannerService } from '~/services/bannerService';
import { getFullImageUrl } from '~/utils/image';

interface FormBannerModalProps {
  isOpen: boolean;
  onClose(): void;
  bannerId?: string;
  refetchData(): Promise<any>;
}

const FormBannerModal = ({
  isOpen,
  onClose,
  bannerId,
  refetchData,
}: FormBannerModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const formMethods = useForm<Banner>({
    defaultValues: {
      priority: 1,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  useQuery({
    queryKey: [QUERY_KEY.BANNER_DETAIL, bannerId],
    queryFn: async () => {
      if (!bannerId) return null;

      const bannerResponse = await bannerService.getBannerById(bannerId);
      reset({
        ...bannerResponse,
        banner: bannerResponse?.url
          ? getFullImageUrl(bannerResponse.url)
          : undefined,
      });
    },
    enabled: Boolean(bannerId),
  });

  useEffect(() => {
    if (!isOpen)
      reset({ banner: '', name: '', redirect: '', priority: undefined });
  }, [isOpen]);

  const handleCreateOrUpdateBanner = async (data: Banner) => {
    try {
      const formData = new FormData();
      if (data?.banner && data.banner instanceof Blob) {
        formData.append('files', data.banner);
        delete data.banner;
      }
      formData.append('bannerInfo', JSON.stringify(data));

      if (bannerId) {
        await bannerService.updateBanner(bannerId, formData);
        enqueueSnackbar('Cập nhật banner thành công!');
      } else {
        await bannerService.createBanner(formData);
        enqueueSnackbar('Thêm banner mới thành công!');
      }

      await refetchData();
    } catch (err) {
      console.log('🚀 ~ handleCreateOrUpdateBanner ~ err:', err);
      enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
        variant: 'error',
      });
    } finally {
      onClose();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      okButtonText={bannerId ? 'Lưu thay đổi' : 'Thêm'}
      cancelButtonText="Hủy"
      title={
        bannerId ? 'Chỉnh sửa banner quảng cáo' : 'Thêm banner quảng cáo mới'
      }
      size="4xl"
      onOk={handleSubmit(handleCreateOrUpdateBanner)}
      isLoading={isSubmitting}
    >
      <FormProvider {...formMethods}>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <FormContextUpload
              name="banner"
              label="Banner"
              rules={{
                required: 'Vui lòng chọn một hình ảnh làm banner!',
              }}
            />
          </div>
          <div className="col-span-3 space-y-4">
            <FormContextInput
              name="name"
              label="Tên banner"
              rules={{
                required: 'Vui lòng nhập tên banner',
              }}
            />
            <FormContextInput
              name="priority"
              label="Thứ tự"
              type="number"
              rules={{
                min: {
                  value: 1,
                  message: 'Thứ tự bắt đầu từ 1!',
                },
              }}
            />
            <FormContextInput name="redirect" label="Liên kết" />
          </div>
        </div>
      </FormProvider>
    </CustomModal>
  );
};

export default FormBannerModal;
