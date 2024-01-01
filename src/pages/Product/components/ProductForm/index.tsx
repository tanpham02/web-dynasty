import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FormProvider, useForm } from 'react-hook-form';
import Svg from 'react-inlinesvg';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import DescriptionIcon from '~/assets/svg/description.svg';
import Box from '~/components/Box';
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor';
import { PATH_NAME } from '~/constants/router';
import { ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import ProductAttributeCard from '../ProductAttributeCard';
import ProductInfoCard from '../ProductInfoCard';
import { categoryService } from '~/services/categoryService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';

interface ProductFormProps {
  currentProduct?: ProductMain;
  isEdit?: boolean;
}

const ProductForm = ({ currentProduct, isEdit }: ProductFormProps) => {
  const forms = useForm<ProductMain>();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = forms;

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.CATEGORY],
    async () => await categoryService.getCategoryByCriteria({}),
  );

  useEffect(() => {
    if (isEdit && currentProduct && Object.keys(currentProduct).length > 0 && !isFetchingCategory) {
      reset({
        ...currentProduct,
        categoryId: Array.isArray(currentProduct?.categoryId)
          ? [...currentProduct?.categoryId]
          : [currentProduct?.categoryId],
      });
    }
  }, [isEdit, currentProduct, isFetchingCategory]);

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
                attributeId: attributeValue?._id,
                priceAdjustmentValue: attributeValue?.priceAdjustmentValue,
              };
            }),
          };
        }),
      });

      formData.append('productInfo', jsonData);

      if (isEdit) await productService.updateProduct(formData, currentProduct?._id);
      else await productService.createProduct(formData);
      enqueueSnackbar('Tạo sản phẩm thành công!');
      navigate(PATH_NAME.PRODUCT_LIST);
    } catch (err) {
      enqueueSnackbar('Tạo sản phẩm thành công!', {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:47 ~ onSubmit ~ err:', err);
    }
  };

  return (
    <FormProvider {...forms}>
      <Box className="space-y-4">
        <Box className="grid xl:grid-cols-2 gap-4">
          <ProductInfoCard
            categories={categories}
            isLoading={isLoadingCategory || isFetchingCategory}
          />
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
        <ProductAttributeCard />
      </Box>
      <Button
        color="primary"
        variant="shadow"
        className="mt-2"
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        Thêm sản phẩm
      </Button>
    </FormProvider>
  );
};

export default ProductForm;
