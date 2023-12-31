import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { FormProvider, useForm } from 'react-hook-form';
import Svg from 'react-inlinesvg';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import DescriptionIcon from '~/assets/svg/description.svg';
import Box from '~/components/Box';
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor';
import { PATH_NAME } from '~/constants/router';
import { ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import ProductAttributeCard from '../ProductAttributeCard';
import ProductInfoCard from '../ProductInfoCard';

const ProductForm = () => {
  const forms = useForm<ProductMain>();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = forms;

  const onSubmit = async (data: ProductMain) => {
    console.log('🚀 ~ file: index.tsx:51 ~ onSubmit ~ data:', data);
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

      await productService.createProduct(formData);
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
