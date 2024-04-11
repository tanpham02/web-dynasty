import { Card, CardBody, CardHeader, Divider, SelectItem, SelectSection } from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Svg from 'react-inlinesvg';

import GridIcon from '~/assets/svg/grid.svg';
import InfoIcon from '~/assets/svg/info.svg';
import Box from '~/components/Box';
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
                page?.data?.map((category) =>
                  Array.isArray(category?.childrenCategory?.category) &&
                  category?.childrenCategory?.category.length > 0 ? (
                    <SelectSection
                      showDivider
                      title={
                        (
                          <Box className="flex items-center space-x-2 ml-2 font-bold text-base">
                            <Svg src={GridIcon} className="w-3.5 h-3.5" />
                            <span>{category?.name}</span>
                          </Box>
                        ) as any
                      }
                    >
                      {
                        category?.childrenCategory?.category.map(
                          (childrenCategory) =>
                            childrenCategory?._id && (
                              <SelectItem
                                key={childrenCategory._id}
                                textValue={`${category?.name} ${childrenCategory?.name}`}
                              >
                                {category?.name} {childrenCategory?.name}
                              </SelectItem>
                            ),
                        ) as any
                      }
                    </SelectSection>
                  ) : (
                    category?._id && (
                      <SelectItem key={category._id} textValue={category?.name}>
                        {category?.name}
                      </SelectItem>
                    )
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
