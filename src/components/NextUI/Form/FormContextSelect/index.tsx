import { Select, SelectProps } from "@nextui-org/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormContextSelectProps extends SelectProps {
  name: string;
}

const FormContextSelect = (props: FormContextSelectProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Select
          {...props}
          selectedKeys={value?.[0]}
          size="sm"
          onSelectionChange={onChange}
          color={!!error ? "danger" : "default"}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default FormContextSelect;
