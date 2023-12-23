import { Input, InputProps } from "@nextui-org/react";
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface FormContextInputProps extends InputProps {
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
}
const FormContextInput = (props: FormContextInputProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={props.name}
      control={control}
      rules={props?.rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Input
          value={value}
          onValueChange={onChange}
          errorMessage={error?.message}
          ref={ref}
          color={!!error ? "danger" : "default"}
          size="sm"
          {...props}
        />
      )}
    />
  );
};

export default FormContextInput;
