import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Box from '~/components/Box';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import { PATH_NAME } from '~/constants/router';
import ProductForm from '../components/ProductForm';

const ProductFormPage = () => {
  const { id } = useParams();

  const pageName = useMemo(() => {
    if (id) return 'Chỉnh sửa sản phẩm';
    return 'Thêm sản phẩm mới';
  }, [id]);

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
      <ProductForm />
    </Box>
  );
};

export default ProductFormPage;
