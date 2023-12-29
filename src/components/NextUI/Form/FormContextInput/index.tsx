import { Input, InputProps } from '@nextui-org/react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

interface FormContextInputProps<T extends { [key: string]: keyof T }> extends InputProps {
  control: Control<FieldValues, T>;
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}
const FormContextInput = <T extends FieldValues>(props: FormContextInputProps<T>) => {
  const {} = useFormContext<T>();

  return (
    <Controller
      control={props.control}
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
          size="md"
          variant="underlined"
          {...props}
        />
      )}
    />
  );
};

export default FormContextInput;
