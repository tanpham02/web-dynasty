import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Svg from 'react-inlinesvg'
import { useNavigate } from 'react-router-dom'

import DescriptionIcon from '~/assets/svg/description.svg'
import Box from '~/components/Box'
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor'
import FormContextUpload from '~/components/NextUI/Form/FormContextUpload'
import { PATH_NAME } from '~/constants/router'
import { ProductMain } from '~/models/product'
import { productService } from '~/services/productService'
import { getFullImageUrl } from '~/utils/image'
import ProductAttributeCard from '../ProductAttributeCard'
import ProductInfoCard from '../ProductInfoCard'
import { ModalConfirmDelete } from '~/components'

interface ProductFormProps {
  currentProduct?: ProductMain
  isEdit?: boolean
}

const ProductForm = ({ currentProduct, isEdit }: ProductFormProps) => {
  const forms = useForm<ProductMain>({ defaultValues: {} })
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = forms

  useEffect(() => {
    if (isEdit && currentProduct && Object.keys(currentProduct).length > 0) {
      reset({
        ...currentProduct,
        files: currentProduct?.image
          ? getFullImageUrl(currentProduct.image)
          : '',
        categoryId:
          currentProduct?.categoryId instanceof Array ||
          typeof currentProduct?.categoryId === 'string'
            ? []
            : [
                currentProduct?.categoryId?._id,
                ...(currentProduct?.categoryId?.childrenCategory?.category
                  ?.filter(
                    (item) =>
                      currentProduct?.categoryIdSelected ===
                      item._id?.toString(),
                  )
                  ?.map((item) => item._id) ?? []),
              ],
        productAttributeList: currentProduct?.productAttributeList?.map(
          (attribute) => {
            return {
              ...attribute,
              _id: attribute?._id,
              label: attribute?.extendedNames?.join(' - '),
              productAttributeItem: attribute?.extendedIds?.map(
                (_id, index) => ({
                  _id,
                  label: attribute?.extendedNames?.[index],
                  priceAdjustmentValue:
                    attribute?.priceAdjustmentValues?.[index] || 0,
                }),
              ),
            }
          },
        ),
      })
    }
  }, [isEdit, currentProduct])

  const onSubmit = async (data: ProductMain) => {
    try {
      const formData = new FormData()

      if (data?.files && data.files instanceof Blob) {
        formData.append('file', data.files)
        delete data.files
      }

      const json = {
        ...data,
        price: Number(data?.price || 0),
        oldPrice: Number(data?.oldPrice || 0),
        categoryId:
          Array.isArray(data?.categoryId) && data?.categoryId.length > 0
            ? data.categoryId[0]
            : [],
        types: [...(data?.types || [])],
        productAttributeList: data?.productAttributeList?.map((attribute) => ({
          extendedIds: attribute?.productAttributeItem?.map(
            (attributeItem) => attributeItem?._id,
          ),
          priceAdjustmentValues: attribute?.productAttributeItem?.map(
            (attributeItem) => Number(attributeItem?.priceAdjustmentValue || 0),
          ),
        })),
        attributeMapping: data?.attributeIds || [],
        productsVariant: [],
      }
      const jsonData = JSON.stringify(json)

      formData.append('productInfo', jsonData)

      if (isEdit)
        await productService.updateProduct(formData, currentProduct?._id)
      else await productService.createProduct(formData)
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thành công!`)
      navigate(PATH_NAME.PRODUCT_LIST)
    } catch (err) {
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thất bại!`, {
        variant: 'error',
      })
      console.log('🚀 ~ file: index.tsx:47 ~ onSubmit ~ err:', err)
    }
  }

  const handleToggleWarningModal = () =>
    setIsShowConfirmModal(!isShowConfirmModal)

  const handleAgree = () => {
    reset()
    navigate(PATH_NAME.PRODUCT_LIST)
  }

  const handleCancel = () => {
    if (isDirty) {
      setIsShowConfirmModal(true)
    } else {
      handleAgree()
    }
  }

  return (
    <>
      <FormProvider {...forms}>
        <Box className="space-y-4">
          <Box className="grid xl:grid-cols-2 gap-4">
            <ProductInfoCard />
            <Card>
              <CardHeader>
                <Svg src={DescriptionIcon} className="w-5 h-5 mr-2" />
                <span className="text-lg font-bold">Mô tả sản phẩm</span>
              </CardHeader>
              <Divider />
              <CardBody className="py-0">
                <FormContextCKEditor name="description" />
              </CardBody>
            </Card>
          </Box>
          <Card>
            <CardHeader>
              <Svg src={DescriptionIcon} className="w-5 h-5 mr-2" />
              <span className="text-lg font-bold">Hình ảnh sản phẩm</span>
            </CardHeader>
            <Divider />
            <CardBody>
              <Box className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-8">
                <Box className="w-[20vw]">
                  <FormContextUpload name="files" />
                </Box>
              </Box>
            </CardBody>
          </Card>
          <ProductAttributeCard isEdit={isEdit} />
        </Box>
        <Box className="mt-3 flex justify-end items-center gap-3">
          <Button color="default" variant="bordered" onClick={handleCancel}>
            Huỷ bỏ
          </Button>
          <Button
            color="primary"
            variant="shadow"
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          </Button>
        </Box>
      </FormProvider>

      <ModalConfirmDelete
        isOpen={isShowConfirmModal}
        onAgree={handleAgree}
        onOpenChange={handleToggleWarningModal}
        desc="Bạn có những thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này không? Bất kỳ dữ liệu nào chưa lưu sẽ bị mất."
      />
    </>
  )
}

export default ProductForm
