import React, { useId } from 'react';

interface FormContextFieldProps {
  label?: React.ReactNode;
  className?: string;
  bodyClass?: string;
  required?: boolean;
  render?({ id }: { id: string }): React.JSX.Element;
}

const FormContextField = (props: FormContextFieldProps) => {
  const id = useId();

  const { label, render, className, required, bodyClass } = props;

  return (
    <div className={className || 'space-y-2'}>
      <label htmlFor={id} className="flex font-bold text-[15px] w-max">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <div className={bodyClass || 'w-full'}>{render?.({ id })}</div>
    </div>
  );
};

export default FormContextField;
