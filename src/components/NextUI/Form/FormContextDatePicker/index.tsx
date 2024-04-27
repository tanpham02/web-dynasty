import { parseDate } from '@internationalized/date';
import { DatePicker, DatePickerProps } from '@nextui-org/react';
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import {
  DATE_FORMAT_DDMMYYYYTHHMMSS,
  DATE_FORMAT_YYYYMMDD,
  formatDate,
} from '~/utils/date.utils';

interface FormContextDatePickerProps<T extends { [key: string]: keyof T }>
  extends DatePickerProps {
  name: FieldPath<T>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}
const FormContextDatePicker = <T extends FieldValues>(
  props: FormContextDatePickerProps<T>,
) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      rules={props?.rules}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <DatePicker
          showMonthAndYearPickers
          ref={ref}
          color="primary"
          variant="bordered"
          value={parseDate(
            formatDate(value || new Date(), DATE_FORMAT_YYYYMMDD),
          )}
          onChange={onChange}
          {...props}
          isInvalid={!!error?.message}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default FormContextDatePicker;
