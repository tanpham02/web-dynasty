/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Button, Modal, Select, TreeSelect } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import bannerIcon from '~/assets/images/icon/banner-icon.png';
import { Banner, BannerType } from '~/models/banner';
import { bannerService } from '~/services/bannerService';
import { PATTERN } from '~/utils/regex';
import { QUERY_KEY } from '~/constants/querryKey';
import { productService } from '~/services/productService';
import productCategoryService from '~/services/productCategoryService';
import { toast } from 'react-hot-toast';

interface TreeSelectChildren {
  title?: string;
  value?: number | string;
}

interface TreeSelectParent {
  title?: string;
  value?: number | string;
  children?: TreeSelectChildren[];
}

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  banner?: Banner;
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
}

const defaultBannerValues: Banner = {
  bannerType: BannerType.CATEGORY,
};

const BannerModal = ({ visible, banner, modalType, onClose, refetchData }: UserModalProps) => {
  const bannerTypeSelection = [
    {
      value: BannerType.CATEGORY,
      label: 'Danh mục',
    },
    {
      value: BannerType.PRODUCT,
      label: 'Sản phẩm',
    },
    // {
    //   value: BannerType.NEWS,
    //   label: 'Tin tức',
    // },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bannerToSubmit, setBannerToSubmit] = useState<File | string>('');
  const [bannerBlob, setBannerBlob] = useState<any>('');
  const [showConfigFollowBannerType, setShowConfigFollowBannerType] = useState<{
    isShowProductDropdown: boolean;
    isShowProductCategoryDropdown: boolean;
    isShowLinkInput: boolean;
  }>({
    isShowProductDropdown: false,
    isShowProductCategoryDropdown: true,
    isShowLinkInput: false,
  });

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
  } = useForm({
    defaultValues: defaultBannerValues,
  });

  const { data: productCategory } = useQuery(
    [QUERY_KEY.PRODUCT_CATEGORY_IN_ZALO_MINI_APP],
    async () => {
      return await productCategoryService.getAllProductCategoryInZaloMiniApp(0);
    },
    { enabled: Boolean(showConfigFollowBannerType.isShowProductCategoryDropdown) },
  );

  const { data: product, fetchNextPage: fetchNextPageProduct } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_IN_ZALO_MINI_APP],
    async ({ pageParam = 0 }) => {
      const params = { pageIndex: pageParam, pageSize: 10 };
      return await productService.getProductInZaloMiniApp(params);
    },
    {
      getNextPageParam: ({ last, pageable }) => {
        if (!last) {
          return pageable.pageNumber + 1;
        }
        return undefined;
      },
      enabled: Boolean(showConfigFollowBannerType.isShowProductCategoryDropdown),
    },
  );

  useEffect(() => {
    if (banner) {
      reset(banner);
      switch (banner.bannerType) {
        case BannerType.PRODUCT:
          setShowConfigFollowBannerType({
            isShowProductDropdown: true,
            isShowLinkInput: false,
            isShowProductCategoryDropdown: false,
          });
          break;
        case BannerType.CATEGORY:
          setShowConfigFollowBannerType({
            isShowProductDropdown: false,
            isShowLinkInput: false,
            isShowProductCategoryDropdown: true,
          });
          break;
        case BannerType.NEWS:
          setShowConfigFollowBannerType({
            isShowProductDropdown: false,
            isShowLinkInput: true,
            isShowProductCategoryDropdown: false,
          });
          break;

        default:
          setShowConfigFollowBannerType({
            isShowProductDropdown: false,
            isShowLinkInput: false,
            isShowProductCategoryDropdown: false,
          });
          break;
      }
    }
  }, [banner]);

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm mới banner',
          titleButton: 'Thêm banner',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin banner',
          titleButton: 'Cập nhật',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin banner',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  const generateOptionTreeSelect = useMemo(() => {
    const result: TreeSelectParent[] = [];
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
  }, [productCategory, showConfigFollowBannerType]);

  const generateOptionSelect = useMemo(
    () =>
      product?.pages.flatMap((page) =>
        page.content.map((item) => ({
          label: item.name,
          value: item.nhanhVnId,
        })),
      ),
    [product, showConfigFollowBannerType],
  );

  const onSubmit = async (data: Banner) => {
    const checkError = watch('path');
    if (checkError === '' || !checkError) {
      setError('path', {
        type: 'required',
        message: 'Banner không được rỗng',
      });
    } else {
      setIsLoading(true);
      const imageFile = new FormData();
      if (bannerToSubmit) {
        imageFile.append('imageFile ', bannerToSubmit);
      }
      const { path, ...newData } = data;

      try {
        modalType === ModalType.CREATE
          ? await bannerService.createBanner(newData, imageFile)
          : modalType === ModalType.UPDATE && (await bannerService.updateBanner(newData, imageFile));
        toast.success(
          `${
            modalType === ModalType.CREATE
              ? 'Thêm banner thành công'
              : modalType === ModalType.UPDATE
              ? 'Cập nhật banner thành công'
              : ''
          }`,
          {
            position: 'bottom-right',
            duration: 4000,
            icon: '👏',
          },
        );
        reset(defaultBannerValues);
        setIsLoading(false);
        refetchData();
        onClose();
      } catch (err) {
        console.log(err);
        toast.success('Thêm banner thất bại', {
          position: 'bottom-right',
          duration: 4000,
          icon: '😞',
        });
        setIsLoading(false);
      }
    }
  };

  const handleScrollDropdownProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchNextPageProduct();
    }
  };

  const handleChangeFileBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const reader = new FileReader();
    reader.onloadend = function () {
      setBannerBlob(reader.result);
      setValue('path', reader.result as unknown as string);
    };

    if (files) {
      reader.readAsDataURL(files?.[0]);
      setBannerToSubmit(files[0]);
    }
  };

  const handleChangeBannerTypeSelect = (type: string) => {
    reset((prev) => ({ ...prev, redirectId: null, bannerType: type }));
    switch (type) {
      case BannerType.PRODUCT:
        setShowConfigFollowBannerType({
          isShowProductDropdown: true,
          isShowLinkInput: false,
          isShowProductCategoryDropdown: false,
        });
        break;
      case BannerType.CATEGORY:
        setShowConfigFollowBannerType({
          isShowProductDropdown: false,
          isShowLinkInput: false,
          isShowProductCategoryDropdown: true,
        });
        break;
      case BannerType.NEWS:
        setShowConfigFollowBannerType({
          isShowProductDropdown: false,
          isShowLinkInput: true,
          isShowProductCategoryDropdown: false,
        });
        break;

      default:
        setShowConfigFollowBannerType({
          isShowProductDropdown: false,
          isShowLinkInput: false,
          isShowProductCategoryDropdown: false,
        });
        break;
    }
  };

  return (
    <Modal
      open={visible}
      title={getTitleModalAndButton.titleModal}
      okText='Lưu thay đổi'
      cancelText='Hủy bỏ'
      onCancel={onClose}
      style={{ minWidth: '70%' }}
      footer={[
        modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
        <Button
          form='form-banner'
          key='submit'
          htmlType='submit'
          loading={isLoading}
          style={{ background: '#1890ff', color: '#fff' }}
        >
          {getTitleModalAndButton.titleButton}
        </Button>,
      ]}
    >
      <div className='mx-auto max-w-270'>
        <div className='grid grid-cols-5 gap-8'>
          <div className='col-span-5 xl:col-span-3'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
              <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-white'>Thông tin banner</h3>
              </div>
              <div className='p-10'>
                <form
                  id='form-banner'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='mb-5.5'>
                    <label
                      className='mb-3 block text-sm font-medium text-black dark:text-white'
                      htmlFor='Username'
                    >
                      Thể loại banner <strong className='text-xl text-danger'>*</strong>
                    </label>
                    <Controller
                      name='bannerType'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value } }) => (
                        <Select
                          options={bannerTypeSelection}
                          defaultValue={value}
                          value={value}
                          className='w-full rounded border border-stroke  py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary'
                          onChange={handleChangeBannerTypeSelect}
                        />
                      )}
                    />
                  </div>
                  {showConfigFollowBannerType.isShowLinkInput && (
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Đường dẫn đến trang <strong className='text-xl text-danger'>*</strong>
                      </label>

                      <Controller
                        name='link'
                        control={control}
                        rules={{ pattern: PATTERN.URL, required: true }}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`w-full rounded border border-stroke  py-2.5 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                              errors.link ? '!border-danger' : ''
                            }`}
                            type='text'
                            value={value ? value : ''}
                            defaultValue={''}
                            onChange={onChange}
                            placeholder='Nhập đường dẫn'
                          />
                        )}
                      />
                      {errors?.link?.type === 'pattern' && (
                        <small className='text-danger block'>Đường dẫn không hợp lệ</small>
                      )}
                      {errors?.link?.type === 'required' && (
                        <small className='text-danger text-[13px] block'>Đường dẫn không được rỗng</small>
                      )}
                    </div>
                  )}{' '}
                  {showConfigFollowBannerType.isShowProductCategoryDropdown && (
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Danh mục sản phẩm <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='redirectId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <TreeSelect
                            key={value}
                            className={`w-full rounded border ${
                              errors.redirectId ? 'border-danger' : 'border-stroke'
                            }  py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                            value={value}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={generateOptionTreeSelect}
                            placeholder='Vui lòng chọn mục sản phẩm'
                            treeDefaultExpandAll
                            onChange={onChange}
                          />
                        )}
                      />
                      {errors?.redirectId?.type === 'required' && (
                        <small className='text-danger text-[13px]'>Danh mục sản phẩm không hợp lệ</small>
                      )}
                    </div>
                  )}
                  {showConfigFollowBannerType.isShowProductDropdown && (
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Sản phẩm</label>
                      <Controller
                        name='redirectId'
                        control={control}
                        rules={{ required: banner?.bannerType === BannerType.PRODUCT ? true : false }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            key={value}
                            className={`w-full rounded border ${
                              errors.redirectId ? 'border-danger' : 'border-stroke'
                            }  py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                            value={value}
                            options={generateOptionSelect}
                            placeholder='Vui lòng chọn sản phẩm'
                            onChange={onChange}
                            onPopupScroll={handleScrollDropdownProduct as any}
                          />
                        )}
                      />
                      {errors?.redirectId?.type === 'required' && (
                        <small className='text-danger block'>Danh mục sản phẩm không hợp lệ</small>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className='col-span-5 xl:col-span-2'>
            <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
              <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
                <h3 className='font-medium text-black dark:text-white'>
                  Ảnh <strong className='text-xl text-danger'>*</strong>
                </h3>
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
                    {banner || bannerBlob ? (
                      <Controller
                        control={control}
                        name='path'
                        rules={{ required: true }}
                        render={({ field: { value } }) => (
                          <img
                            src={value || bannerBlob}
                            className='lg:w-[100%] mx-auto  border-solid border-[1px] border-[#ddd] rounded-lg'
                            onError={(e: any) => {
                              e.target.src = bannerIcon;
                              e.target.onerror = null;
                            }}
                          />
                        )}
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
                          <span className='text-primary'>Click to upload</span> or drag and drop
                        </p>
                        <p className='mt-1.5'>SVG, PNG, JPG or GIF</p>
                        <p>(max, 800 X 800px)</p>
                      </div>
                    )}
                  </div>
                </div>
                {errors?.path?.type === 'required' && !getValues('path') && (
                  <small className='text-danger block text-[13px]'>{errors.path.message}</small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BannerModal;
