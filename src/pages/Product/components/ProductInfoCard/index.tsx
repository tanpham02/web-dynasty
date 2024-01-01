import { Card, CardBody, CardHeader, Divider, SelectItem } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Svg from 'react-inlinesvg';

import InfoIcon from '~/assets/svg/info.svg';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import FormContextTextArea from '~/components/NextUI/Form/FormContextTextArea';
import { QUERY_KEY } from '~/constants/queryKey';
import { ProductStatusOptions } from '~/models/product';
import { categoryService } from '~/services/categoryService';

const ProductInfoCard = () => {
  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.CATEGORY],
    async () => await categoryService.getCategoryByCriteria({}),
  );

  return (
    <Card>
      <CardHeader>
        <Svg src={InfoIcon} className="w-5 h-5 mr-2" />
        <span className="text-lg font-bold">Thông tin sản phẩm</span>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4 px-6 my-2">
        <FormContextInput
          name="name"
          label="Tên sản phẩm"
          isRequired
          rules={{
            required: 'Vui lòng nhập tên sản phẩm!',
          }}
        />
        <FormContextSelect
          isRequired
          name="categoryId"
          label="Danh mục sản phẩm"
          isLoading={isLoadingCategory || isFetchingCategory}
          rules={{
            required: 'Vui lòng chọn danh mục sản phẩm!',
          }}
        >
          {
            categories?.pages?.map(
              (page) =>
                page?.data?.map(
                  (category) =>
                    category?._id && (
                      <SelectItem key={category._id} value={category._id}>
                        {category?.name}
                      </SelectItem>
                    ),
                ),
            ) as any
          }
        </FormContextSelect>
        <FormContextInput
          name="price"
          label="Giá bán"
          isRequired
          type="number"
          endContent="đ"
          rules={{
            required: 'Vui lòng nhập giá bán!',
          }}
        />
        <FormContextInput name="oldPrice" label="Giá cũ" type="number" endContent="đ" />
        <FormContextSelect name="types" label="Loại sản phẩm" selectionMode="multiple">
          {ProductStatusOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </FormContextSelect>
        <FormContextTextArea name="information" label="Ghi chú sản phẩm" />
      </CardBody>
    </Card>
  );
};

export default ProductInfoCard;
