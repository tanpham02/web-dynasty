import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SelectItem,
} from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import Svg from "react-inlinesvg";

import InfoIcon from "~/assets/svg/info.svg";
import DescriptionIcon from "~/assets/svg/description.svg";
import Box from "~/components/Box";
import { FormContextInput } from "~/components/NextUI/Form";
import FormContextCKEditor from "~/components/NextUI/Form/FormContextCKEditor";
import FormContextSelect from "~/components/NextUI/Form/FormContextSelect";
import FormContextTextArea from "~/components/NextUI/Form/FormContextTextArea";
import { QUERY_KEY } from "~/constants/queryKey";
import { ProductMain, ProductStatusOptions } from "~/models/product";
import { categoryService } from "~/services/categoryService";
import ProductAttributeCard from "../ProductAttributeCard";

const ProductForm = () => {
  const forms = useForm<ProductMain>();

  const { handleSubmit } = forms;

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchingCategory,
  } = useInfiniteQuery(
    [QUERY_KEY.CATEGORY],
    async () => await categoryService.getCategoryByCriteria({}),
  );

  const onSubmit = (data: ProductMain) => {
    console.log("🚀 ~ file: index.tsx:40 ~ onSubmit ~ data:", data);
  };

  return (
    <FormProvider {...forms}>
      <Box className="grid xl:grid-cols-2 gap-4">
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
                required: "Vui lòng nhập tên sản phẩm!",
              }}
            />
            <FormContextSelect
              isRequired
              name="categoryId"
              label="Danh mục sản phẩm"
              isLoading={isLoadingCategory || isFetchingCategory}
              rules={{
                required: "Vui lòng chọn danh mục sản phẩm!",
              }}
            >
              {
                categories?.pages?.map(
                  (page, pageIndex) =>
                    page?.data?.map((category, index) => (
                      <SelectItem
                        key={`${pageIndex} - ${index}`}
                        value={category?._id}
                      >
                        {category?.name}
                      </SelectItem>
                    )),
                ) as any
              }
            </FormContextSelect>
            <FormContextInput
              name="price"
              label="Gía bán"
              isRequired
              type="number"
              endContent="đ"
              rules={{
                required: "Vui lòng nhập giá bán!",
              }}
            />
            <FormContextInput
              name="oldPrice"
              label="Giá cũ"
              type="number"
              endContent="đ"
            />
            <FormContextSelect
              name="types"
              label="Loại sản phẩm"
              selectionMode="multiple"
            >
              {ProductStatusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextTextArea name="information" label="Ghi chú sản phẩm" />
          </CardBody>
        </Card>
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
        <ProductAttributeCard />
        <Button
          color="primary"
          variant="shadow"
          className="col-span-2"
          size="lg"
          onClick={handleSubmit(onSubmit)}
        >
          Thêm sản phẩm
        </Button>
      </Box>
    </FormProvider>
  );
};

export default ProductForm;
