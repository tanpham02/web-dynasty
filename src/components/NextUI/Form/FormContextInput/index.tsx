import { Input, InputProps } from '@nextui-org/react';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

interface FormContextInputProps<T extends FieldValues> extends InputProps {
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}
const FormContextInput = <T extends FieldValues>(props: FormContextInputProps<T>) => {
  const { control } = useFormContext<FieldValues>();

  return (
    <Controller
      control={control}
      name={props.name}
      rules={props?.rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Input
          value={value}
          onValueChange={onChange}
          errorMessage={error?.message}
          ref={ref}
          classNames={{
            inputWrapper: 'border-b',
            label: 'font-semibold',
          }}
          color={!!error ? 'danger' : 'primary'}
          size="lg"
          variant="underlined"
          {...props}
        />
      )}
    />
  );
};

export default FormContextInput;
