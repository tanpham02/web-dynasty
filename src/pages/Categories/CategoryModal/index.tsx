import { Chip, SelectItem, Skeleton } from '@nextui-org/react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import CustomModal from '~/components/NextUI/CustomModal';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import FormContextSwitch from '~/components/NextUI/Form/FormContextSwitch';
import ModalCategorySkeleton from '~/components/Skeleton/ModalCategorySkeleton';
import { QUERY_KEY } from '~/constants/queryKey';
import { Category } from '~/models/category';
import { categoryService } from '~/services/categoryService';
import DeleteIcon from '~/assets/svg/delete.svg';
import { globalLoading } from '~/components/GlobalLoading';

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
    control,
  } = forms;

  const { fields: childrenCategory, remove: removeChildrenCategory } = useFieldArray({
    control,
    name: 'childrenCategory.category',
  });

  const columns: ColumnType<Category>[] = [
    {
      name: 'Tên danh mục',
      render: (_record: Category, index?: number) => (
        <FormContextInput name={`childrenCategory.category.${index}.name`} />
      ),
    },
    {
      name: 'Thứ tự hiển thị',
      render: (_record: Category, index?: number) => (
        <FormContextInput name={`childrenCategory.category.${index}.priority`} type="number" />
      ),
    },
    {
      name: 'Hiển trị trên trang chủ',
      render: (record: Category, index?: number) => (
        <FormContextSwitch name={`childrenCategory.category.${index}.isShowHomePage`} />
      ),
    },
    {
      name: <Box className="flex justify-center">Hành động</Box>,
      render: (record: Category, index?: number) => (
        <Box className="flex justify-center">
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa danh mục này"
            status="danger"
            placement="top"
            onClick={() => removeChildrenCategory(index)}
          />
        </Box>
      ),
    },
  ];

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
    try {
      const formData = new FormData();

      let jsonData: Category = {};
      let parentCategoryId: string = '';
      let isCreateChildrenCategory: boolean = false;

      if (data?.childrenCategory?.parentId) {
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
      }

      formData.append('categoryInfo', JSON.stringify(jsonData));

      if (isEdit || isCreateChildrenCategory) {
        await categoryService.updateCategory(
          !isCreateChildrenCategory ? categoryId : parentCategoryId,
          formData,
        );
        // if (
        //   isCreateChildrenCategory &&
        //   categoryId &&
        //   data?.childrenCategory?.parentId === parentCategoryId
        // )
        //   await categoryService.deleteCategoryByIds([categoryId]);
      } else {
        await categoryService.createCategory(formData);
      }

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
                <CustomTable
                  columns={columns}
                  data={childrenCategory as any}
                  isLoading={isLoadingCategory || isFetchingCategory}
                  selectionMode="none"
                  rowPerPage={5}
                />
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
