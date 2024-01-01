import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Tooltip,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import DeleteIcon from '~/assets/svg/delete.svg';
import WarningIcon from '~/assets/svg/warning.svg';
import GridLayoutIcon from '~/assets/svg/grid-layout.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute, AttributeValue } from '~/models/attribute';
import { ProductChildrenAttribute, ProductMain } from '~/models/product';
import { attributeService } from '~/services/attributeService';

const ProductAttributeCard = () => {
  const { control, setValue } = useFormContext<ProductMain>();

  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([]);

  const columns: ColumnType<ProductChildrenAttribute>[] = [
    {
      name: 'Tên mở rộng',
      render: (record: ProductChildrenAttribute) => record?.extendedName,
    },
    {
      name: <Box className="text-center">Tên thuộc tính</Box>,
      render: (record: ProductChildrenAttribute, index?: number) => (
        <Box className="flex justify-around flex-col gap-8">
          {record?.productAttributeItem?.map((attributeValue, fieldIndex) => (
            // <FormContextInput
            //   name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.name`}
            //   value={attributeValue?.name}
            //   isReadOnly
            // />
            <span className="block my-auto">- {attributeValue?.name}</span>
          ))}
        </Box>
      ),
    },
    {
      name: <Box className="text-center">Giá bán cộng thêm</Box>,
      render: (record: ProductChildrenAttribute, index?: number) => (
        <Box className="space-y-1">
          {record?.productAttributeItem?.map((_, fieldIndex) => (
            <FormContextInput
              name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.priceAdjustmentValue`}
              endContent={<span className="font-bold">đ</span>}
              type="number"
              rules={{
                required: 'Vui lòng nhập giá cho thuộc tính này!',
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      name: <span className="block text-center">Hành động</span>,
      render: (_record, index?: number) => (
        <div className="flex justify-center">
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa sản phẩm con này"
            onClick={() => removeProductAttribute(index)}
            status="danger"
          />
        </div>
      ),
    },
  ];

  const {
    fields: productAttributes,
    append: appendProductAttribute,
    remove: removeProductAttribute,
  } = useFieldArray({
    control,
    name: 'productAttributeList',
  });

  const {
    data: attributes,
    isLoading: isLoadingAttribute,
    isFetching: isFetchingAttribute,
  } = useQuery([QUERY_KEY.ATTRIBUTE], async () => await attributeService.getAllAttributes(), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    removeProductAttribute(undefined);
    setValue('productAttributeList', []);
    if (attributeSelected.length > 0) generateCombinations(0, [], [], []);
  }, [JSON.stringify(attributeSelected)]);

  const generateCombinations = useCallback(
    (
      index: number,
      currentCombination: string[],
      currentCombinationValue: string[],
      attributeValue: AttributeValue[],
    ) => {
      if (index === attributeSelected?.length && currentCombination) {
        appendProductAttribute(
          {
            extendedName: currentCombination.join(' - '),
            extendedValue: currentCombinationValue.join('_'),
            productAttributeItem: attributeValue,
          },
          {
            shouldFocus: false,
          },
        );
      }

      if (attributeSelected?.[index]?.attributeList?.length === 0) {
        generateCombinations(
          index + 1,
          currentCombination,
          currentCombinationValue,
          attributeValue,
        );
      } else if (
        attributeSelected?.[index]?.attributeList &&
        Array.isArray(attributeSelected?.[index]?.attributeList) &&
        attributeSelected[index].attributeList.length > 0
      ) {
        for (const attr of attributeSelected[index].attributeList || []) {
          generateCombinations(
            index + 1,
            attr?.name ? [...currentCombination, attr.name] : [...currentCombination],
            attr?.value ? [...currentCombinationValue, attr.value] : [...currentCombinationValue],
            attr ? [...attributeValue, attr] : [...attributeValue],
          );
        }
      }
    },
    [attributeSelected],
  );

  const handleChangeAttributeSelected = (checked: boolean, attribute: Attribute) => {
    if (checked) {
      setAttributeSelected((prev) => [...prev, attribute]);
    } else {
      setAttributeSelected(attributeSelected?.filter((item) => item?._id != attribute?._id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <Svg src={GridLayoutIcon} className="w-5 h-5 mr-2" />
        <span className="text-lg font-bold">Thuộc tính sản phẩm</span>
      </CardHeader>
      <Divider />
      <CardBody className="p-6 space-y-4">
        <CheckboxGroup value={attributeSelected}>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5 2xl:grid-cols-7">
            {attributes?.map((attribute, index) => (
              <Checkbox
                key={index}
                value={attribute?._id}
                onValueChange={(checked) => handleChangeAttributeSelected(checked, attribute)}
              >
                {attribute?.name}
              </Checkbox>
            ))}
          </Box>
        </CheckboxGroup>
        <Box className="my-2 flex items-center bg-orange-100 p-2 rounded-lg">
          <Svg src={WarningIcon} className="bg-orange-500 text-white w-5 h-5 rounded-full mr-2" />
          <span>
            Vui lòng cập nhật lại giá bán cộng thêm cho từng thuộc tính nếu thay đổi lựa chọn!
          </span>
        </Box>
        <CustomTable
          rowKey="id"
          tableName="product attribute"
          columns={columns}
          isLoading={false}
          selectionMode="none"
          removeWrapper
          isStriped
          data={productAttributes}
          emptyContent="Không có sản phẩm con nào"
        />
      </CardBody>
    </Card>
  );
};

export default ProductAttributeCard;
