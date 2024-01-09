import { Card, CardBody, CardHeader, Checkbox, CheckboxGroup, Divider } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import DeleteIcon from '~/assets/svg/delete.svg';
import GridLayoutIcon from '~/assets/svg/grid-layout.svg';
import WarningIcon from '~/assets/svg/warning.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute, AttributeValue } from '~/models/attribute';
import { ProductChildrenAttribute, ProductMain } from '~/models/product';
import { attributeService } from '~/services/attributeService';

interface ProductAttributeCardProps {
  isEdit?: boolean;
}

const ProductAttributeCard = ({ isEdit }: ProductAttributeCardProps) => {
  const { control, setValue, getValues } = useFormContext<ProductMain>();

  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([]);
  const [attributeIds, setAttributeIds] = useState<string[]>([]);

  const columns: ColumnType<ProductChildrenAttribute>[] = [
    {
      name: 'Tên mở rộng',
      render: (record: ProductChildrenAttribute) => record?.extendedName,
    },
    {
      name: <Box className="text-center">Tên thuộc tính</Box>,
      render: (record: ProductChildrenAttribute) => (
        <Box className="flex justify-around flex-col gap-8">
          {record?.productAttributeItem?.map((attributeValue) => (
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

  const { data: attributes } = useQuery(
    [QUERY_KEY.ATTRIBUTE],
    async () => await attributeService.getAllAttributes(),
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    removeProductAttribute(undefined);
    setValue('productAttributeList', []);
    if (attributeSelected.length > 0) {
      generateCombinations(0, [], [], []);
      setValue('attributeIds', attributeSelected?.map((attribute) => attribute?._id) as string[]);
    }
  }, [JSON.stringify(attributeSelected)]);

  useEffect(() => {
    const oldProductAttribute = getValues('attributeMapping');
    if (isEdit && Array.isArray(oldProductAttribute) && oldProductAttribute.length > 0) {
      setAttributeSelected(oldProductAttribute as Attribute[]);
      setAttributeIds((oldProductAttribute?.map((attribute) => attribute?._id) as string[]) || []);
      // isCheckedAttributeBefore.current = true;
    }
  }, [isEdit, getValues('attributeMapping')]);

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
      setAttributeSelected(attributeSelected?.filter((item) => item?._id != attribute?._id) || []);
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
        {isEdit && (
          <Box className="mb-1 flex items-center bg-orange-100 p-2 rounded-lg">
            <Svg src={WarningIcon} className="bg-orange-500 text-white w-5 h-5 rounded-full mr-2" />
            <span>
              Vui lòng cập nhật lại giá bán cộng thêm cho từng thuộc tính nếu thay đổi lựa chọn!
            </span>
          </Box>
        )}
        <CheckboxGroup value={attributeIds} onValueChange={setAttributeIds}>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5 2xl:grid-cols-7">
            {attributes?.map((attribute, index) => (
              <Checkbox
                key={index}
                value={attribute?._id}
                // checked={attributeIds?.includes(attribute?._id)}
                onValueChange={(checked) => handleChangeAttributeSelected(checked, attribute)}
              >
                {attribute?.name}
              </Checkbox>
            ))}
          </Box>
        </CheckboxGroup>

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
