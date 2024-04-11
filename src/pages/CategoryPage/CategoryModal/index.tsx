import { SelectItem } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import DeleteIcon from '~/assets/svg/delete.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { globalLoading } from '~/components/GlobalLoading';
import CustomModal from '~/components/NextUI/CustomModal';
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

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
    getFieldState,
    control,
  } = forms;

  const { fields: childrenCategory, remove: removeChildrenCategory } = useFieldArray({
    control,
    name: 'childrenCategory.category',
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (categoryId && isEdit && isOpen) getCategoryDetail();
    else resetFormValue({ name: '', childrenCategory: { category: [] } });
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
      globalLoading.show();
      const response = await categoryService.getCategoryById(categoryId);
      if (response && Object.keys(response).length > 0) {
        resetFormValue(response);
      }
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu danh mục!');
      onOpenChange?.();
      console.log('🚀 ~ file: index.tsx:125 ~ getCategoryDetail ~ err:', err);
    } finally {
      setTimeout(() => {
        globalLoading.hide();
      }, 1000);
    }
  };

  const categoriesData = useMemo(
    () => categories?.pages?.flatMap((page) => page?.data),
    [categories],
  );

  const onSubmit = async (data: Category) => {
    console.log(data);
    try {
      const formData = new FormData();

      let jsonData: Category = {};
      let parentCategoryId: string = '';
      let isCreateChildrenCategory: boolean = false;

      if (
        data?.childrenCategory &&
        Array.isArray(data.childrenCategory.parentId) &&
        data.childrenCategory.parentId.length > 0
      ) {
        parentCategoryId =
          Array.isArray(data.childrenCategory.parentId) && data.childrenCategory.parentId.length > 0
            ? data.childrenCategory.parentId[0]
            : data.childrenCategory.parentId;
        const parentCategory = categoriesData?.find((item) => item._id === parentCategoryId);
        isCreateChildrenCategory = true;

        if (!isEdit) {
          jsonData = {
            ...parentCategory,
            childrenCategory: {
              parentId: parentCategoryId,
              category: [
                ...(parentCategory?.childrenCategory?.category || []),
                {
                  name: data?.name,
                  priority: data?.priority,
                  isShowHomePage: data?.isShowHomePage,
                },
              ],
            },
          };
        } else {
          jsonData = {
            ...parentCategory,
            childrenCategory: {
              parentId: parentCategoryId,
              category: !data?.childrenCategory?.category?.length
                ? data?.childrenCategory?.parentId === parentCategoryId
                  ? []
                  : [
                      ...(parentCategory?.childrenCategory?.category || []),
                      {
                        name: data?.name,
                        priority: data?.priority,
                        isShowHomePage: data?.isShowHomePage,
                      },
                    ]
                : data?.childrenCategory?.category,
            },
          };
        }
        delete jsonData?._id;
      } else {
        jsonData = data;

        if (!jsonData?.childrenCategory?.parentId?.length) delete jsonData?.childrenCategory;
      }

      formData.append('categoryInfo', JSON.stringify(jsonData));

      if (isEdit || isCreateChildrenCategory) {
        await categoryService.updateCategory(
          !isCreateChildrenCategory ? categoryId : parentCategoryId,
          formData,
        );
      } else {
        await categoryService.createCategory(formData);
      }
      if (
        isEdit &&
        categoryId &&
        data?.childrenCategory?.parentId &&
        getFieldState(`childrenCategory.parentId`).isDirty
      )
        await categoryService.deleteCategoryByIds([categoryId]);

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
      className="w-full max-w-[1000px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        {Array.isArray(categoriesData) ? (
          <Box className="space-y-4">
            {Boolean(!childrenCategory?.length && categoriesData?.length) && (
              <FormContextSelect
                isLoading={isLoadingCategory || isFetchingCategory}
                name="childrenCategory.parentId"
                label="Danh mục cha (nếu có)"
              >
                {
                  categoriesData?.map((category) =>
                    category?._id && category._id !== categoryId ? (
                      <SelectItem key={category._id}>{category?.name}</SelectItem>
                    ) : null,
                  ) as any
                }
              </FormContextSelect>
            )}
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
            {Boolean(childrenCategory?.length) && (
              <Box>
                <span className="font-semibold mb-2 block text-base">Danh mục con</span>
                <Box className="border border-zinc-200 rounded-xl p-4 shadow">
                  <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
                    <Box className="font-bold flex-[3] text-center">Tên danh mục</Box>
                    <Box className="font-bold flex-[2] text-center">Thứ tự hiển thị</Box>
                    <Box className="font-bold flex-[2] text-center">Hiển thi trên trang chủ</Box>
                    <Box className="font-bold flex-1 text-center">Hành động</Box>
                  </Box>
                  <Box>
                    {childrenCategory?.map((category, index) => (
                      <Box key={category?.id} className="px-3 py-2 flex items-center gap-2">
                        <Box className="font-bold flex-[3] text-center">
                          <FormContextInput name={`childrenCategory.category.${index}.name`} />
                        </Box>
                        <Box className="font-bold flex-[2] text-center">
                          <FormContextInput
                            name={`childrenCategory.category.${index}.priority`}
                            type="number"
                          />
                        </Box>
                        <Box className="font-bold flex-[2] text-center">
                          <FormContextSwitch
                            name={`childrenCategory.category.${index}.isShowHomePage`}
                          />
                        </Box>
                        <Box className="font-bold flex-1 text-center">
                          <ButtonIcon
                            icon={DeleteIcon}
                            title="Xóa danh mục này"
                            status="danger"
                            placement="top"
                            onClick={() => removeChildrenCategory(index)}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <ModalCategorySkeleton />
        )}
      </FormProvider>
    </CustomModal>
  );
};

export default CategoryModal;
