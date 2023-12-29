import { Select, SelectProps } from '@nextui-org/react';
import { Controller, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

interface FormContextSelectProps extends SelectProps {
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}

const FormContextSelect = (props: FormContextSelectProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={props.name}
      rules={props.rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <Select
          {...props}
          ref={ref}
          selectedKeys={value?.[0]}
          size="md"
          classNames={{
            trigger: 'border-b',
            label: 'font-semibold',
          }}
          onSelectionChange={onChange}
          color={!!error ? 'danger' : 'primary'}
          variant="underlined"
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default FormContextSelect;
