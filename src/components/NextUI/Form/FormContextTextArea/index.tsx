import { Textarea, TextAreaProps } from '@nextui-org/react';
import {
  Controller,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

interface FormContextTextAreaProps extends TextAreaProps {
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}

const FormContextTextArea = ({
  name,
  rules,
  ...props
}: FormContextTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
        <Textarea
          value={value}
          onValueChange={onChange}
          ref={ref}
          classNames={{
            inputWrapper: 'border-b',
            label: 'font-semibold',
          }}
          className="font-semibold"
          color={!!error ? 'danger' : 'primary'}
          variant="underlined"
          isInvalid={!!error?.message}
          errorMessage={error?.message}
          {...props}
        />
      )}
    />
  );
};

export default FormContextTextArea;
