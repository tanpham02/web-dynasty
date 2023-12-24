import { Textarea, TextAreaProps } from "@nextui-org/react";
import { Controller, useFormContext } from "react-hook-form";

interface FormContextTextAreaProps extends TextAreaProps {
  name: string;
}

const FormContextTextArea = (props: FormContextTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
        <Textarea
          value={value}
          onValueChange={onChange}
          ref={ref}
          classNames={{
            inputWrapper: "border-b",
            label: "font-semibold",
          }}
          color={!!error ? "danger" : "primary"}
          variant="underlined"
          errorMessage={error?.message}
          {...props}
        />
      )}
    />
  );
};

export default FormContextTextArea;
