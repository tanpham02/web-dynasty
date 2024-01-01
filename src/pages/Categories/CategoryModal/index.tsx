import { SelectItem, Skeleton } from '@nextui-org/react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Box from '~/components/Box';

import CustomModal from '~/components/NextUI/CustomModal';
import CustomTable from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import FormContextSwitch from '~/components/NextUI/Form/FormContextSwitch';
import ModalCategorySkeleton from '~/components/Skeleton/ModalCategorySkeleton';
import { QUERY_KEY } from '~/constants/queryKey';
import { Category } from '~/models/category';
import { categoryService } from '~/services/categoryService';

interface CategoryModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  categoryId?: string;
}
const CategoryModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  categoryId,
}: CategoryModalProps) => {
  const forms = useForm<Category>({
    defaultValues: { priority: 0, childrenCategory: {} },
  });

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
  } = forms;

  useEffect(() => {
    if (categoryId && isEdit && isOpen) getCategoryDetail();
    else resetFormValue({ name: '' });
  }, [isEdit, categoryId, isOpen]);

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.CATEGORY],
    async () => categoryService.getCategoryByCriteria({}),
    { enabled: isOpen },
  );

  const getCategoryDetail = async () => {
    try {
      const response = await categoryService.getCategoryById(categoryId);
      if (response && Object.keys(response).length > 0) {
        resetFormValue(response);
      }
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu danh mục!');
      onOpenChange?.();
      console.log('🚀 ~ file: index.tsx:125 ~ getCategoryDetail ~ err:', err);
    }
  };

  const categoriesData = useMemo(
    () => categories?.pages?.flatMap((page) => page?.data),
    [categories],
  );

  const onSubmit = async (data: Category) => {
    try {
      const formData = new FormData();

      let jsonData: Category = {};
      let parentCategoryId: string = '';
      let isCreateChildrenCategory: boolean = false;

      if (data?.childrenCategory?.parentId) {
        parentCategoryId = [...data.childrenCategory.parentId]?.[0];
        isCreateChildrenCategory = true;
        const parentCategory = categoriesData?.find((item) => item._id === parentCategoryId);

        jsonData = {
          ...parentCategory,
          childrenCategory: {
            parentId: parentCategoryId,
            category: [
              {
                name: data?.name,
                priority: data?.priority,
                isShowHomePage: data?.isShowHomePage,
              },
            ],
          },
        };
        delete jsonData?._id;
      } else {
        jsonData = data;
      }

      formData.append('categoryInfo', JSON.stringify(jsonData));

      if (isEdit || isCreateChildrenCategory)
        await categoryService.updateCategory(categoryId || parentCategoryId, formData);
      else await categoryService.createCategory(formData);

      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} danh mục thành công!`);
    } catch (err) {
      enqueueSnackbar(`Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} danh mục!`, {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:', err);
    } finally {
      await onRefetch?.();
      onOpenChange?.();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[600px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        {Array.isArray(categoriesData) && categoriesData.length > 0 ? (
          <Box className="space-y-4">
            <FormContextSelect
              isLoading={isLoadingCategory || isFetchingCategory}
              name="childrenCategory.parentId"
              label="Danh mục cha (nếu có)"
            >
              {categoriesData?.map((category) => (
                <SelectItem key={category?._id}>{category?.name}</SelectItem>
              ))}
            </FormContextSelect>
            <FormContextInput
              isRequired
              name="name"
              label="Tên danh mục"
              rules={{
                required: 'Vui lòng nhập tên danh mục',
              }}
            />
            <FormContextInput name="priority" label="Thứ tự hiển thị" type="number" />
            <FormContextSwitch name="isShowHomePage" label="Hiển thị trên trang chủ" />
          </Box>
        ) : (
          <ModalCategorySkeleton />
        )}
      </FormProvider>
    </CustomModal>
  );
};

export default CategoryModal;
