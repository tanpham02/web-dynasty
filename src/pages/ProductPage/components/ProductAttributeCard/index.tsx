import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { unionBy } from 'lodash'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import Svg from 'react-inlinesvg'

import DeleteIcon from '~/assets/svg/delete.svg'
import GridLayoutIcon from '~/assets/svg/grid-layout.svg'
import WarningIcon from '~/assets/svg/warning.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { FormContextInput } from '~/components/NextUI/Form'
import { QUERY_KEY } from '~/constants/queryKey'
import { Attribute, AttributeValue } from '~/models/attribute'
import { ProductMain } from '~/models/product'
import { attributeService } from '~/services/attributeService'

interface ProductAttributeCardProps {
  isEdit?: boolean
}

const ProductAttributeCard = ({ isEdit }: ProductAttributeCardProps) => {
  const { control, setValue } = useFormContext<ProductMain>()

  const [attributeSelected, setAttributeSelected] = useState<Attribute[]>([])
  const [attributeIds, setAttributeIds] = useState<string[]>([])
  const [isTriggerRemoveProductAttribute, setIsTriggerRemoveProductAttribute] =
    useState<boolean>(false)

  const isFirstTime = useRef<boolean>(true)

  const {
    fields: productAttributes,
    append: appendProductAttribute,
    remove: removeProductAttribute,
  } = useFieldArray({
    control,
    name: 'productAttributeList',
  })

  const { data: attributes, isLoading } = useQuery(
    [QUERY_KEY.ATTRIBUTE],
    async () => await attributeService.getAllAttributes(),
    {
      refetchOnWindowFocus: false,
    },
  )

  // Handle check at the first
  useEffect(() => {
    if (
      isEdit &&
      isFirstTime.current &&
      Array.isArray(productAttributes) &&
      productAttributes?.length > 0 &&
      !isLoading
    ) {
      const ids: string[] = []
      let attributeOld: any[] = []
      attributes?.forEach((attr) => {
        attr?.attributeList?.forEach((attributeItem) => {
          const isChecked = productAttributes?.some(
            (proAttr) => proAttr?.extendedIds?.includes(attributeItem?._id!),
          )
          if (isChecked) {
            ids.push(attr._id!)
            const filteredAttributes = attr?.attributeList?.map(
              (item) =>
                productAttributes?.some(
                  (proAttr) => proAttr?.extendedIds?.includes(item?._id!),
                ) && item,
            )

            attributeOld.push({ ...attr, attributeList: filteredAttributes })
            attributeOld = unionBy(attributeOld, '_id')
          }
        })
      })
      setAttributeIds(ids)
      // setAttributeSelected(attributeOld)
      isFirstTime.current = false
    }
  }, [
    JSON.stringify([
      isEdit,
      isFirstTime,
      productAttributes,
      isLoading,
      attributes,
    ]),
  ])

  // Trigger uncheck
  // useEffect(() => {
  //   if (isTriggerRemoveProductAttribute) {
  //     const ids = productAttributes?.map((item) => item.extendedIds)?.flat()
  //     const filteredAttributes = attributes
  //       ?.map((attribute) => {
  //         const attributeList = attribute?.attributeList?.filter(
  //           (item) => ids?.includes(item._id!),
  //         )
  //         return {
  //           ...attribute,
  //           attributeList,
  //         }
  //       })
  //       ?.filter((item) => !!item?.attributeList?.length)

  //     setAttributeIds(filteredAttributes?.map((item) => item?._id) as string[])
  //     setAttributeSelected(filteredAttributes as Attribute[])
  //     setIsTriggerRemoveProductAttribute(false)
  //   }
  // }, [
  //   JSON.stringify([
  //     productAttributes,
  //     attributes,
  //     isTriggerRemoveProductAttribute,
  //   ]),
  // ])

  useLayoutEffect(() => {
    removeProductAttribute(undefined)
    setValue('productAttributeList', [])
    if (attributeSelected.length > 0) {
      generateCombinations(0, [], [])
      setValue(
        'attributeIds',
        attributeSelected?.map((attribute) => attribute?._id) as string[],
      )
    }
  }, [JSON.stringify(attributeSelected)])

  const generateCombinations = useCallback(
    (
      index: number,
      currentCombination: string[],
      attributeValue: AttributeValue[],
    ) => {
      if (index === attributeSelected?.length && currentCombination) {
        appendProductAttribute(
          {
            label: currentCombination.join(' - '),
            productAttributeItem: attributeValue,
          },
          {
            shouldFocus: false,
          },
        )
      }

      if (attributeSelected?.[index]?.attributeList?.length === 0) {
        generateCombinations(index + 1, currentCombination, attributeValue)
      } else if (
        attributeSelected?.[index]?.attributeList &&
        Array.isArray(attributeSelected?.[index]?.attributeList) &&
        attributeSelected[index].attributeList.length > 0
      ) {
        for (const attr of attributeSelected[index].attributeList || []) {
          generateCombinations(
            index + 1,
            attr?.label
              ? [...currentCombination, attr?.label]
              : [...currentCombination],
            attr ? [...attributeValue, attr] : [...attributeValue],
          )
        }
      }
    },
    [attributeSelected],
  )

  const handleChangeAttributeSelected = (checked: boolean, id: string) => {
    const attribute = attributes?.find((item) => item._id === id)
    if (checked) {
      setAttributeSelected((prev) => [...prev, attribute!])
    } else {
      setAttributeSelected(
        attributeSelected?.filter((item) => item?._id !== id),
      )
    }
  }

  const handleRemoveProductAttribute = (index: number) => {
    removeProductAttribute(index)
    // setIsTriggerRemoveProductAttribute(true)
  }

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
            <Svg
              src={WarningIcon}
              className="bg-orange-500 text-white w-5 h-5 rounded-full mr-2"
            />
            <span>
              Vui lòng cập nhật lại giá bán cộng thêm cho từng thuộc tính nếu
              thay đổi lựa chọn!
            </span>
          </Box>
        )}
        <CheckboxGroup value={attributeIds} onValueChange={setAttributeIds}>
          <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-5 2xl:grid-cols-7">
            {attributes?.map((attribute, index) => (
              <Checkbox
                key={index}
                value={attribute?._id}
                onValueChange={(checked) =>
                  handleChangeAttributeSelected(checked, attribute?._id!)
                }
              >
                {attribute?.name}
              </Checkbox>
            ))}
          </Box>
        </CheckboxGroup>
        <Box className="border border-zinc-200 rounded-xl p-4 shadow">
          <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
            <Box className="font-bold flex-[2] text-start">Tên hiển thị</Box>
            <Box className="font-bold flex-[2] text-start">Tên thuộc tính</Box>
            <Box className="font-bold flex-[3] text-center">
              Giá bán cộng thêm
            </Box>
            <Box className="font-bold flex-1 text-center">Hành động</Box>
          </Box>
          <Box>
            {Array.isArray(productAttributes) &&
            productAttributes.length > 0 ? (
              productAttributes.map((attribute, index) => (
                <Box
                  key={attribute?.id}
                  className={`px-3 py-2 flex items-center gap-2 ${
                    index % 2 == 1 && 'bg-zinc-100 rounded-md'
                  }`}
                >
                  <Box className="flex-[2] text-start">{attribute?.label}</Box>
                  <Box className="flex justify-around flex-col gap-8 flex-[2] text-start">
                    {attribute?.productAttributeItem?.map((attributeValue) => (
                      <span className="block my-auto">
                        - {attributeValue?.label}
                      </span>
                    ))}
                  </Box>
                  <Box className="font-bold flex-[3] text-center">
                    <Box className="space-y-1">
                      {attribute?.productAttributeItem?.map(
                        (attributeItem, fieldIndex) => (
                          <FormContextInput
                            defaultValue="0"
                            key={attributeItem?._id}
                            type="number"
                            name={`productAttributeList.${index}.productAttributeItem.${fieldIndex}.priceAdjustmentValue`}
                            endContent={<span className="font-bold">đ</span>}
                          />
                        ),
                      )}
                    </Box>
                  </Box>
                  <Box className="font-bold flex-1 text-center">
                    <ButtonIcon
                      icon={DeleteIcon}
                      title="Xóa sản phẩm con này"
                      onClick={() => handleRemoveProductAttribute(index)}
                      status="danger"
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Box className="py-8 text-center font-medium text-zinc-400">
                Không có biển thể sản phẩm nào
              </Box>
            )}
          </Box>
        </Box>
      </CardBody>
    </Card>
  )
}

export default ProductAttributeCard
