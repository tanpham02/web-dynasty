import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import bannerIcon from '~/assets/images/icon/banner-icon.png';
import { QUERY_KEY } from '~/constants/querryKey';
import productCategoryService from '~/services/productCategoryService';
import { toast } from 'react-hot-toast';

export interface ProductCategoryUpdateModalProps {
  productCategoryID: number;
  visible?: boolean;
  onClose: () => void;
  refetchData: () => void;
}

const ProductCategoryUpdateModal = ({
  visible,
  productCategoryID,
  onClose,
  refetchData,
}: ProductCategoryUpdateModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerToSubmit, setBannerToSubmit] = useState<File | string>('');
  const [bannerBlob, setBannerBlob] = useState<any>('');

  const { data: productCategoryData } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_CATEGORY_BY_ID, productCategoryID],
    async () => {
      return await productCategoryService.getProductCategoryById(productCategoryID);
    },
    { enabled: productCategoryID != -100 },
  );

  useEffect(() => {
    setBannerBlob(productCategoryData?.pages[0].image);
  }, [productCategoryData]);

  const handleChangeFileBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.onloadend = function () {
      setBannerBlob(reader.result);
    };

    if (files) {
      reader.readAsDataURL(files?.[0]);
      setBannerToSubmit(files[0]);
    }
  };

  const handleUpdateProductCategoryBanner = async () => {
    setIsLoading(true);

    const convertDataToFormData = new FormData();

    if (bannerToSubmit) {
      convertDataToFormData.append('image', bannerToSubmit);
    }

    try {
      await productCategoryService.updateBannerProductCategory(productCategoryID, convertDataToFormData);
      toast.success('Cập nhật banner thành công!', {
        position: 'bottom-right',
        duration: 4000,
        icon: '👏',
      });
      setBannerBlob('');
      setIsLoading(false);
      refetchData();
      onClose();
    } catch (err) {
      console.log(err);
      toast.success('Cập nhật banner  thất bại', {
        position: 'bottom-right',
        duration: 4000,
        icon: '😞',
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title={`Cập nhật Banner cho danh mục ${productCategoryData?.pages[0].name}`}
      okText='Lưu thay đổi'
      cancelText='Hủy bỏ'
      onCancel={onClose}
      style={{ minWidth: '50%', height: '100%' }}
      footer={[
        <Button onClick={onClose}>Hủy</Button>,
        <Button
          form='form-banner'
          key='submit'
          htmlType='submit'
          loading={isLoading}
          style={{ background: '#1890ff', color: '#fff' }}
          onClick={handleUpdateProductCategoryBanner}
        >
          Cập nhật
        </Button>,
      ]}
    >
      <div className='mx-auto max-w-270 max-h-270'>
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
          <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
            <h3 className='font-medium text-black dark:text-white'>Ảnh</h3>
          </div>
          <div className='p-7'>
            <div
              id='FileUpload'
              className='relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5'
            >
              <input
                type='file'
                accept='image/*'
                className='absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none'
                onChange={handleChangeFileBanner}
              />

              <div className='flex flex-col items-center justify-center space-y-3'>
                {bannerBlob ? (
                  <img
                    src={bannerBlob}
                    className='m-w-[50%] max-h-[350px] mx-auto  border-solid border-[1px] border-[#ddd] rounded-lg'
                    onError={(e: any) => {
                      e.target.src = bannerIcon;
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center space-y-3'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z'
                          fill='#3C50E0'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z'
                          fill='#3C50E0'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z'
                          fill='#3C50E0'
                        />
                      </svg>
                    </span>
                    <p>
                      <span className='text-primary'>Click để upload ảnh </span> hoặc kéo thả vào ô
                    </p>
                    <p className='mt-1.5'>SVG, PNG, JPG hoặc GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductCategoryUpdateModal;
