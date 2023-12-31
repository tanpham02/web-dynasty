import { Switch, SwitchProps } from '@nextui-org/react';
import { Controller, useFormContext } from 'react-hook-form';

interface FormContextSwitchProps extends SwitchProps {
  name: string;
  label?: string;
}

const FormContextSwitch = (props: FormContextSwitchProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field: { value, onChange } }) => (
        <Switch value={value} onValueChange={onChange} {...props}>
          {props?.label}
        </Switch>
      )}
    />
  );
};

export default FormContextSwitch;
