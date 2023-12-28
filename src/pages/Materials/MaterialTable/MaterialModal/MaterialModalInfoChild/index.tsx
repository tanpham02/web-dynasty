/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Input, InputNumber, Typography } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ModalType } from "~/pages/User/UserModal";

function MaterialModalInfoChild({
  field,
  control,
  index,
  errors,
  modalType,
}: any) {
  const { reset } = useFormContext();

  return (
    <div>
      {modalType !== ModalType.INFORMATION ? (
        <Col className="!w-full !px-0 mt-1">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Tên sản phẩm <strong className="text-xl text-danger">*</strong>
          </Typography.Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name={`materialInfo.${index}.name`}
            render={({ field: { value, onChange } }) => (
              <Input
                className={`h-[38px] border-solid border-[1px]
               ${errors?.materialInfo?.[index]?.name ? "!border-danger" : ""}`}
                value={value}
                onChange={onChange}
                placeholder="VD: Trứng"
              />
            )}
          />

          {errors?.materialInfo?.[index]?.name?.type === "required" && (
            <small className="text-danger text-[13px]">
              Tên sản phẩm không được rỗng
            </small>
          )}
        </Col>
      ) : (
        <Col className="!w-full !px-0 mt-1">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Tên sản phẩm
          </Typography.Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name={`materialInfo.${index}.name`}
            render={({ field: { value, onChange } }) => (
              <Input
                className={`!py-[10px] w-full !border-none !outline-none !bg-gray/70 !z-10 pointer-events-none`}
                value={value}
                onChange={onChange}
                placeholder="VD: Trứng"
              />
            )}
          />
        </Col>
      )}

      {modalType !== ModalType.INFORMATION ? (
        <Col className="!w-full !px-0 mt-2">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Giá sản phẩm <strong className="text-xl text-danger">*</strong>
          </Typography.Text>
          <Controller
            control={control}
            name={`materialInfo.${index}.price`}
            rules={{ required: true, validate: (value) => value > 0 }}
            render={({ field: { value, onChange } }) => (
              <InputNumber
                formatter={(value, __info) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                parser={(displayValue) =>
                  displayValue
                    ? Number.parseInt(
                        `${displayValue}`.replace(/\$\s?|(,*)/g, ""),
                      )
                    : ""
                }
                value={value}
                min={1}
                onChange={(value) => value && onChange(value)}
                className={`h-[38px] !w-full ${
                  errors?.materialInfo?.[index]?.price ? "!border-danger" : ""
                }`}
                placeholder="VD: 9000"
                controls={false}
                addonAfter="đ"
              />
            )}
          />
          {errors?.materialInfo?.[index]?.price?.type === "required" && (
            <small className="text-danger text-[13px]">
              Giá sản phẩm không được rỗng
            </small>
          )}
          {errors?.materialInfo?.[index]?.price?.type === "validate" && (
            <small className="text-danger text-[13px]">
              Giá sản phẩm không hợp lệ
            </small>
          )}
        </Col>
      ) : (
        <Col className="!w-full !px-0 mt-2">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Giá sản phẩm
          </Typography.Text>
          <Controller
            control={control}
            name={`materialInfo.${index}.price`}
            rules={{ required: true, validate: (value) => value > 0 }}
            render={({ field: { value, onChange } }) => (
              <InputNumber
                formatter={(value, __info) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                }
                parser={(displayValue) =>
                  displayValue
                    ? Number.parseInt(
                        `${displayValue}`.replace(/\$\s?|(,*)/g, ""),
                      )
                    : ""
                }
                value={value}
                min={1}
                onChange={(value) => value && onChange(value)}
                className={`!py-[10px] !w-full !border-none !outline-none !bg-gray/70 !z-10 pointer-events-none block `}
                placeholder="VD: 9000"
                controls={false}
              />
            )}
          />
        </Col>
      )}

      {modalType !== ModalType.INFORMATION ? (
        <Col className="!w-full !px-0 mt-2">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Số lượng <strong className="text-xl text-danger">*</strong>
          </Typography.Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name={`materialInfo.${index}.quantity`}
            render={({ field: { value, onChange } }) => (
              <Input
                className={`h-[38px] border-solid border-[1px] ${
                  errors?.materialInfo?.[index]?.quantity
                    ? "!border-danger"
                    : ""
                }`}
                value={value}
                onChange={onChange}
                placeholder="VD: Số lượng 1 | Cân nặng 1kg"
              />
            )}
          />
          {errors?.materialInfo?.[index]?.quantity?.type === "required" && (
            <small className="text-danger text-[13px]">
              Số lượng phẩm không được rỗng
            </small>
          )}
        </Col>
      ) : (
        <Col className="!w-full !px-0 mt-2">
          <Typography.Text
            type="secondary"
            className="!text-black !mb-2 text-[14.5px]"
          >
            Số lượng
          </Typography.Text>
          <Controller
            control={control}
            rules={{ required: true }}
            name={`materialInfo.${index}.quantity`}
            render={({ field: { value, onChange } }) => (
              <Input
                className={`!py-[10px] !w-full !border-none !outline-none !bg-gray/70 !z-10 pointer-events-none block `}
                value={value}
                onChange={onChange}
                placeholder="VD: Số lượng 1 | Cân nặng 1kg"
              />
            )}
          />
        </Col>
      )}
    </div>
  );
}

export default MaterialModalInfoChild;
