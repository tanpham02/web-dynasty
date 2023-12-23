import { Button, Tooltip } from "@nextui-org/react";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import SVG from "react-inlinesvg";

import DeleteIcon from "~/assets/svg/delete.svg";
import CustomModal from "~/components/NextUI/CustomModal";
import CustomTable, { ColumnType } from "~/components/NextUI/CustomTable";
import { FormContextInput } from "~/components/NextUI/Form";
import { Attribute, AttributeValue } from "~/models/attribute";
import { attributeService } from "~/services/attributeService";

interface AttributeModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  attributeId?: string;
}
const AttributeModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  attributeId,
}: AttributeModalProps) => {
  const forms = useForm<Attribute>();

  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
  } = forms;

  const {
    fields: attributeValue,
    append: appendAttributeValue,
    remove: removeAttributeValue,
  } = useFieldArray({ control, name: "attributeList" });

  const columns: ColumnType<AttributeValue>[] = [
    {
      key: "_id",
      align: "center",
      name: "STT",
      render: (_attribute: AttributeValue, index?: number) => (index || 0) + 1,
    },
    {
      key: "name",
      align: "center",
      name: "Tên giá trị",
      render: (_attribute: AttributeValue, index?: number) => (
        <FormContextInput
          name={`attributeList.${index}.name`}
          rules={{
            required: "Vui lòng nhập tên giá trị thuộc tính!",
          }}
        />
      ),
    },
    {
      key: "value",
      align: "center",
      name: "Giá trị",
      render: (_attribute: AttributeValue, index?: number) => (
        <FormContextInput
          name={`attributeList.${index}.value`}
          rules={{
            required: "Vui lòng nhập giá trị thuộc tính!",
          }}
        />
      ),
    },
    {
      key: "value",
      align: "center",
      name: "Hành động",
      render: (_attribute: AttributeValue, index?: number) => (
        <Tooltip content="Xóa giá trị thuộc tính này" showArrow delay={1500}>
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50"
            onClick={() => removeAttributeValue(index)}
          >
            <SVG src={DeleteIcon} />
          </span>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    if (attributeId && isEdit && isOpen) getAttributeDetail();
    else resetFormValue({ name: "", attributeList: [] });
  }, [isEdit, attributeId, isOpen]);

  const getAttributeDetail = async () => {
    try {
      const response = await attributeService.getAttributeById(attributeId);
      if (response && Object.keys(response).length > 0) {
        resetFormValue(response);
      }
    } catch (err) {
      enqueueSnackbar("Có lỗi xảy ra khi lấy dữ liệu thuộc tính!");
      onOpenChange?.();
      console.log("🚀 ~ file: index.tsx:125 ~ getAttributeDetail ~ err:", err);
    }
  };

  const onSubmit = async (data: Attribute) => {
    try {
      const formData = new FormData();
      formData.append("productAttributeInfo", JSON.stringify(data));
      if (isEdit)
        await attributeService.updateAttributeById(attributeId, formData);
      else await attributeService.createAttribute(formData);
      enqueueSnackbar(
        `${isEdit ? "Chỉnh sửa" : "Thêm"} thuộc tính thành công!`,
      );
    } catch (err) {
      enqueueSnackbar(
        `Có lỗi xảy ra khi ${isEdit ? "chỉnh sửa" : "thêm"} thuộc tính!`,
        {
          variant: "error",
        },
      );
      console.log("🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:", err);
    } finally {
      await onRefetch?.();
      onOpenChange?.();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? "Cập nhật thuộc tính" : "Thêm thuộc tính mới"}
      okButtonText={isEdit ? "Lưu thay đổi" : "Thêm"}
      className="w-full max-w-[800px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <div className="space-y-4">
          <FormContextInput
            name="name"
            label="Tên thuộc tính"
            rules={{
              required: "Vui lòng nhập tên thuộc tính",
            }}
          />
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Giá trị thuộc tính</span>
              <div className="space-x-2">
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  isDisabled={!attributeValue?.length}
                  className="font-bold"
                  onClick={() => removeAttributeValue(undefined)}
                >
                  Xóa tất cả
                </Button>
                <Button
                  color="secondary"
                  size="sm"
                  variant="flat"
                  className="bg-sky-200 text-sky-500 font-bold"
                  onClick={() =>
                    appendAttributeValue({
                      name: "",
                      value: "",
                    })
                  }
                >
                  Thêm giá trị
                </Button>
              </div>
            </div>
            <CustomTable
              columns={columns}
              data={attributeValue}
              isLoading={false}
              selectionMode="none"
              tableName="Attribute values"
            />
          </div>
        </div>
      </FormProvider>
    </CustomModal>
  );
};

export default AttributeModal;
