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
import GridLayoutIcon from '~/assets/svg/grid-layout.svg';
import Box from '~/components/Box';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute, AttributeValue } from '~/models/attribute';
import { ProductChildrenAttribute, ProductMain } from '~/models/product';
import { attributeService } from '~/services/attributeService';

const ProductAttributeCard = () => {
  const { control } = useFormContext<ProductMain>();

  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([]);

  const columns: ColumnType<ProductChildrenAttribute>[] = [
    {
      name: 'Tên mở rộng',
      render: (record: ProductChildrenAttribute) => record?.extendedName,
    },
    {
      name: <Box className="text-center">Tên thuộc tính</Box>,
      render: (record: ProductChildrenAttribute, index?: number) => (
        <Box className="space-y-1">
          {record?.productAttributeItem?.map((attributeValue, fieldIndex) => (
            <FormContextInput
              name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.name`}
              value={attributeValue?.name}
              classNames={{
                input: 'text-center',
              }}
              isReadOnly
            />
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
              classNames={{
                input: 'text-right',
              }}
              rules={{
                required: 'Vui lòng nhập giá sản phẩm tăng thêm cho thuộc tính này!',
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
          <Tooltip color="danger" content="Xóa sản phẩm con này" showArrow>
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => removeProductAttribute(index)}
            >
              <Svg src={DeleteIcon} />
            </span>
          </Tooltip>
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
        <Box className="grid gap-4">
          <CheckboxGroup>
            <Box className="grid grid-cols-4 lg:grid-cols-6">
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
        </Box>
        <CustomTable
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
