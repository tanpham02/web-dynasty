import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Svg from 'react-inlinesvg';
import { useNavigate } from 'react-router-dom';

import DescriptionIcon from '~/assets/svg/description.svg';
import Box from '~/components/Box';
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor';
import Upload, { onChangeProps } from '~/components/Upload';
import { PATH_NAME } from '~/constants/router';
import { ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import ProductAttributeCard from '../ProductAttributeCard';
import ProductInfoCard from '../ProductInfoCard';

interface ProductFormProps {
  currentProduct?: ProductMain;
  isEdit?: boolean;
}

const ProductForm = ({ currentProduct, isEdit }: ProductFormProps) => {
  const forms = useForm<ProductMain>();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [productImage, setProductImage] = useState<onChangeProps>({});

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = forms;

  useEffect(() => {
    if (isEdit && currentProduct && Object.keys(currentProduct).length > 0) {
      reset({
        ...currentProduct,
        categoryId: Array.isArray(currentProduct?.categoryId)
          ? [...currentProduct?.categoryId]
          : [currentProduct?.categoryId],
      });
    }
  }, [isEdit, currentProduct]);

  const onSubmit = async (data: ProductMain) => {
    console.log('🚀 ~ file: index.tsx:29 ~ onSubmit ~ data:', data);
    try {
      const formData = new FormData();

      const jsonData = JSON.stringify({
        ...data,
        categoryId: [...(data?.categoryId || [])]?.[0],
        types: [...(data?.types || [])],
        productAttributeList: data?.productAttributeList?.map((attribute) => {
          return {
            ...attribute,
            productAttributeItem: attribute?.productAttributeItem?.map((attributeValue) => {
              return {
                attributeId: attributeValue?._id ? JSON.parse(attributeValue?._id)?.id : '',
                priceAdjustmentValue: attributeValue?.priceAdjustmentValue,
              };
            }),
          };
        }),
      });

      formData.append('productInfo', jsonData);

      if (productImage?.srcRequest) {
        formData.append('file', productImage.srcRequest);
      }

      if (isEdit) await productService.updateProduct(formData, currentProduct?._id);
      else await productService.createProduct(formData);
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thành công!`);
      navigate(PATH_NAME.PRODUCT_LIST);
    } catch (err) {
      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Tạo'} sản phẩm thất bại!`, {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:47 ~ onSubmit ~ err:', err);
    }
  };

  return (
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
          <CardBody className="p-4 grid grid-cols-2 lg:grid-cols-4">
            <Upload
              onChange={({ srcPreview, srcRequest }: onChangeProps) => {
                setProductImage({
                  srcPreview,
                  srcRequest,
                });
              }}
              src={productImage?.srcPreview}
              loading="lazy"
              radius="full"
              isPreview
            />
          </CardBody>
        </Card>
        <ProductAttributeCard />
      </Box>
      <Button
        color="primary"
        variant="shadow"
        className="mt-2"
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        {isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
      </Button>
    </FormProvider>
  );
};

export default ProductForm;
