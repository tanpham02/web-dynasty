import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Box from '~/components/Box';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import { PATH_NAME } from '~/constants/router';
import ProductForm from '../components/ProductForm';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { productService } from '~/services/productService';
import { globalLoading } from '~/components/GlobalLoading';
import { useSnackbar } from 'notistack';

const ProductFormPage = () => {
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const pageName = useMemo(() => {
    if (id) return 'Chỉnh sửa sản phẩm';
    return 'Thêm sản phẩm mới';
  }, [id]);

  const { data: currentProduct } = useQuery(
    [QUERY_KEY.PRODUCTS, id],
    async () => {
      try {
        globalLoading.show();

        if (id) return await productService.getProductDetail(id);

        return undefined;
      } catch (err) {
        enqueueSnackbar('Không tìm thấy sản phẩm!', {
          variant: 'error',
        });

        console.log('🚀 ~ file: index.tsx:27 ~ err:', err);
      } finally {
        globalLoading.hide();
      }
    },
    {
      enabled: Boolean(id),
      refetchOnWindowFocus: false,
    },
  );

  return (
    <Box>
      <CustomBreadcrumb
        pageName={pageName}
        routes={[
          {
            path: PATH_NAME.PRODUCT_LIST,
            label: 'Danh sách sản phẩm',
          },
          {
            label: pageName,
          },
        ]}
      />
      <ProductForm currentProduct={currentProduct} isEdit={!!id} />
    </Box>
  );
};

export default ProductFormPage;
