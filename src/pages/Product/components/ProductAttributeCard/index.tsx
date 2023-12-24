import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Svg from "react-inlinesvg";

import AddCircleIcon from "~/assets/svg/add.svg";
import DeleteIcon from "~/assets/svg/delete.svg";
import GridLayoutIcon from "~/assets/svg/grid-layout.svg";
import Box from "~/components/Box";
import CustomTable, { ColumnType } from "~/components/NextUI/CustomTable";
import { FormContextInput } from "~/components/NextUI/Form";
import { QUERY_KEY } from "~/constants/queryKey";
import { Attribute, AttributeValue } from "~/models/attribute";
import { ProductChildrenAttribute, ProductMain } from "~/models/product";
import { attributeService } from "~/services/attributeService";

interface ProductAttributeCardProps {
  isOpen?: boolean;
}

const ProductAttributeCard = ({ isOpen = true }: ProductAttributeCardProps) => {
  const { control } = useFormContext<ProductMain>();
  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([]);

  const columns: ColumnType<ProductChildrenAttribute>[] = [
    {
      key: "extendName",
      name: "Tên mở rộng",
      render: (record: ProductChildrenAttribute) => record?.extendedName,
    },
    {
      key: "attributeName",
      name: "Tên thuộc tính",
      render: (record: ProductChildrenAttribute, index?: number) => (
        <Box className="space-y-1">
          {record?.productAttributeItem?.map((attributeValue, fieldIndex) => (
            <FormContextInput
              name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.name`}
              value={attributeValue?.name}
              isReadOnly
            />
          ))}
        </Box>
      ),
    },
    {
      key: "productAttributeItem",
      name: "Giá bán cộng thêm",
      render: (record: ProductChildrenAttribute, index?: number) => (
        <Box className="space-y-1">
          {record?.productAttributeItem?.map((_, fieldIndex) => (
            <FormContextInput
              name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.priceAdjustmentValue`}
              endContent="đ"
              type="number"
            />
          ))}
        </Box>
      ),
    },
    {
      key: "actions",
      name: <span className="block text-center">Hành động</span>,
      render: (_record, index?: number) => (
        <div className="flex justify-center">
          <Tooltip
            color="danger"
            content="Xóa sản phẩm con này"
            showArrow
            delay={1500}
          >
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
    name: "productAttributeList",
  });

  const {
    data: attributes,
    isLoading: isLoadingAttribute,
    isFetching: isFetchingAttribute,
  } = useQuery(
    [QUERY_KEY.ATTRIBUTE],
    async () => {
      const attributeResponse = await attributeService.getAllAttributes();

      if (Array.isArray(attributeResponse) && attributeResponse.length > 0) {
        setAttributeSelected(attributeResponse);
      }
      return attributeResponse;
    },
    { enabled: isOpen, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    removeProductAttribute(undefined);
    generateCombinations(0, "", []);
  }, [attributeSelected]);

  const generateCombinations = (
    index: number,
    currentCombination: string,
    attributeValue: AttributeValue[],
  ) => {
    if (index === attributeSelected?.length && currentCombination) {
      appendProductAttribute(
        {
          extendedName: currentCombination,
          extendedValuePairs: "",
          productAttributeItem: attributeValue,
        },
        {
          shouldFocus: false,
        },
      );
    }

    if (attributeSelected?.[index]?.attributeList?.length === 0) {
      generateCombinations(index + 1, currentCombination, attributeValue);
    } else if (
      Array.isArray(attributeSelected?.[index]?.attributeList) &&
      attributeSelected[index].attributeList.length > 0
    ) {
      for (const attr of attributeSelected[index].attributeList) {
        generateCombinations(
          index + 1,
          `${currentCombination} - ${attr?.name}`,
          attr ? [...attributeValue, attr] : [...attributeValue],
        );
      }
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <Svg src={GridLayoutIcon} className="w-5 h-5 mr-2" />
        <span className="text-lg font-bold">Thuộc tính sản phẩm</span>
      </CardHeader>
      <Divider />
      <CardBody className="p-6 space-y-4">
        <Box className="grid gap-4 grid-cols-2">
          <CheckboxGroup className="space-y-2">
            {attributes?.map((attribute, index) => (
              <Box className="flex justify-between w-full">
                <Checkbox value={attribute?._id}>{attribute?.name}</Checkbox>
                <Button size="sm" color="primary" variant="bordered" isIconOnly>
                  <Svg src={AddCircleIcon} />
                </Button>
              </Box>
            ))}
            <Button
              color="primary"
              size="sm"
              variant="bordered"
              className="mt-2"
            >
              Thêm thuộc tính
            </Button>
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
        />
      </CardBody>
    </Card>
  );
};

export default ProductAttributeCard;
