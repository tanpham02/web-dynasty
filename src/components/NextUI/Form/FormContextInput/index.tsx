import { Input, InputProps } from '@nextui-org/react';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

interface FormContextInputProps<T extends { [key: string]: keyof T }> extends InputProps {
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}
const FormContextInput = <T extends FieldValues>(props: FormContextInputProps<T>) => {
  const { control } = useFormContext();

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
            inputWrapper: 'bg-white',
            label: 'font-semibold',
            input: 'text-primary-text-color',
          }}
          color={!!error ? 'danger' : 'primary'}
          size="md"
          variant="bordered"
          {...props}
        />
      )}
    />
  );
};

export default FormContextInput;
