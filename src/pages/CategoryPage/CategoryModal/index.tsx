import { Button, SelectItem } from '@nextui-org/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import DeleteIcon from '~/assets/svg/delete.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { globalLoading } from '~/components/GlobalLoading'
import CustomModal from '~/components/NextUI/CustomModal'
import { FormContextInput } from '~/components/NextUI/Form'
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect'
import FormContextSwitch from '~/components/NextUI/Form/FormContextSwitch'
import FormContextUpload from '~/components/NextUI/Form/FormContextUpload'
import ModalCategorySkeleton from '~/components/Skeleton/ModalCategorySkeleton'
import { QUERY_KEY } from '~/constants/queryKey'
import { Category } from '~/models/category'
import { categoryService } from '~/services/categoryService'
import { getFullImageUrl } from '~/utils/image'

interface CategoryModalProps {
  isOpen?: boolean
  onOpenChange?(): void
  onRefetch?(): Promise<any>
  isEdit?: boolean
  categoryId?: string
}
const CategoryModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  categoryId,
}: CategoryModalProps) => {
  const forms = useForm<Category>({
    defaultValues: { childrenCategory: {}, visible: true },
  })

  const [categoryAllData, setCategoryAllData] = useState<Category[]>()

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
    getFieldState,
    setValue,
    getValues,
    control,
  } = forms

  const {
    fields: childrenCategory,
    remove: removeChildrenCategory,
    append: appendChildrenCategory,
  } = useFieldArray({
    control,
    name: 'childrenCategory.category',
  })

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (categoryId && isEdit && isOpen) getCategoryDetail()
    else
      resetFormValue({
        name: '',
        childrenCategory: { category: [] },
        visible: true,
      })
    getAllCategory()
  }, [isEdit, categoryId, isOpen])

  const getAllCategory = async () => {
    const response = await categoryService.getAllCategory()
    if (response) {
      setCategoryAllData(response)
    }
  }

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.CATEGORY],
    async () => categoryService.getCategoryByCriteria({}),
    { enabled: isOpen },
  )

  useEffect(() => {
    if (categoryAllData && !isEdit) {
      setValue('priority', categoryAllData.length + 1)
    }
  }, [categoryAllData, isEdit])

  const getCategoryDetail = async () => {
    try {
      globalLoading.show()
      const response = await categoryService.getCategoryById(categoryId)

      if (response && Object.keys(response).length > 0) {
        resetFormValue({
          ...response,
          file: response?.avatar ? getFullImageUrl(response.avatar) : undefined,
        })
      }
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu danh mục!')
      onOpenChange?.()
      console.log('🚀 ~ file: index.tsx:125 ~ getCategoryDetail ~ err:', err)
    } finally {
      globalLoading.hide()
    }
  }

  const categoriesData = useMemo(
    () => categories?.pages?.flatMap((page) => page?.data),
    [categories],
  )

  const onSubmit = async (data: Category) => {
    try {
      const formData = new FormData()

      let jsonData: Category = {}
      let parentCategoryId: string = ''
      let isCreateChildrenCategory: boolean = false

      if (data?.file && data.file instanceof Blob) {
        formData.append('file', data.file)
        delete data.file
      }

      if (
        data?.childrenCategory &&
        Array.isArray(data.childrenCategory.parentId) &&
        data.childrenCategory.parentId.length > 0
      ) {
        parentCategoryId =
          Array.isArray(data.childrenCategory.parentId) &&
          data.childrenCategory.parentId.length > 0
            ? data.childrenCategory.parentId[0]
            : data.childrenCategory.parentId
        const parentCategory = categoriesData?.find(
          (item) => item._id === parentCategoryId,
        )
        isCreateChildrenCategory = true

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
                  visible: data?.visible ?? true,
                },
              ],
            },
          }
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
                        visible: data?.visible ?? true,
                      },
                    ]
                : data?.childrenCategory?.category,
            },
          }
        }
        delete jsonData?._id
      } else {
        jsonData = data

        if (!jsonData?.childrenCategory?.parentId?.length)
          delete jsonData?.childrenCategory
      }

      formData.append('categoryInfo', JSON.stringify(jsonData))

      if (isEdit || isCreateChildrenCategory) {
        await categoryService.updateCategory(
          !isCreateChildrenCategory ? categoryId : parentCategoryId,
          formData,
        )
      } else {
        await categoryService.createCategory(formData)
      }
      if (
        isEdit &&
        categoryId &&
        data?.childrenCategory?.parentId &&
        getFieldState(`childrenCategory.parentId`).isDirty
      )
        await categoryService.deleteCategoryByIds([categoryId])

      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} danh mục thành công!`)
    } catch (err) {
      enqueueSnackbar(
        `Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} danh mục!`,
        {
          variant: 'error',
        },
      )
      console.log('🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:', err)
    } finally {
      await onRefetch?.()
      onOpenChange?.()
    }
  }

  const childrenCategoryValue = getValues(`childrenCategory`)

  useEffect(() => {
    if (
      !childrenCategoryValue?.parentId &&
      !isEmpty(getValues(`childrenCategory`)?.category)
    ) {
      setValue('childrenCategory.parentId', getValues('_id'))
    } else {
      setValue('childrenCategory.parentId', childrenCategoryValue?.parentId)
    }
  }, [JSON.stringify(childrenCategoryValue)])

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
        <Box className="grid grid-cols-3 gap-4">
          <Box className="col-span-1">
            <FormContextUpload name="file" isCircle />
          </Box>
          {Array.isArray(categoriesData) ? (
            <>
              <Box className="space-y-4 col-span-2">
                {!isEdit &&
                  Boolean(
                    !childrenCategory?.length && categoriesData?.length,
                  ) && (
                    <FormContextSelect
                      isLoading={isLoadingCategory || isFetchingCategory}
                      name="childrenCategory.parentId"
                      label="Danh mục cha (nếu có)"
                    >
                      {
                        categoriesData?.map((category) =>
                          category?._id && category._id !== categoryId ? (
                            <SelectItem key={category._id}>
                              {category?.name}
                            </SelectItem>
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
                {isEdit && (
                  <FormContextInput
                    name="priority"
                    label="Thứ tự hiển thị"
                    type="number"
                    rules={{
                      min: {
                        value: 1,
                        message: 'Thứ tự hiển thị bắt đầu từ 1!',
                      },
                    }}
                  />
                )}
                <FormContextSwitch
                  name="visible"
                  label="Hiển thị trên trang chủ"
                />
              </Box>
              <Box className="col-span-3">
                <Box className="flex my-2 items-center">
                  <span className="font-semibold text-base">Danh mục con</span>
                  <Box className="ml-auto">
                    <Button
                      color="secondary"
                      size="sm"
                      variant="flat"
                      className="bg-sky-100 text-sky-500 font-bold"
                      onClick={() =>
                        appendChildrenCategory({
                          name: '',
                          visible: true,
                        })
                      }
                    >
                      Thêm danh mục con
                    </Button>
                  </Box>
                </Box>
                <Box className="border border-zinc-200 rounded-xl p-4 shadow">
                  <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
                    <Box className="font-bold flex-[3] text-center">
                      Tên danh mục
                      <span className="text-[#d50e15]"> *</span>
                    </Box>
                    <Box className="font-bold flex-[2] text-center">
                      Thứ tự hiển thị
                    </Box>
                    <Box className="font-bold flex-[2] text-center">
                      Hiển thi trên trang chủ
                    </Box>
                    <Box className="font-bold flex-1 text-center">
                      Hành động
                    </Box>
                  </Box>
                  <Box>
                    {childrenCategory?.map((category, index) => (
                      <Box
                        key={category?.id}
                        className="px-3 py-2 flex items-center gap-2"
                      >
                        <Box className="font-bold flex-[3] text-center">
                          <FormContextInput
                            isRequired
                            name={`childrenCategory.category.${index}.name`}
                            rules={{
                              required: 'Trường này là bắt buộc',
                            }}
                          />
                        </Box>
                        <Box className="font-bold flex-[2] text-center">
                          <FormContextInput
                            name={`childrenCategory.category.${index}.priority`}
                            value={(index + 1) as any}
                            type="number"
                            className={`${
                              !isEdit
                                ? 'pointer-events-none'
                                : 'pointer-events-auto'
                            }`}
                            disabled={!isEdit}
                          />
                        </Box>
                        <Box className="font-bold flex-[2] text-center">
                          <FormContextSwitch
                            name={`childrenCategory.category.${index}.visible`}
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
            </>
          ) : (
            <ModalCategorySkeleton />
          )}
        </Box>
      </FormProvider>
    </CustomModal>
  )
}

export default CategoryModal
