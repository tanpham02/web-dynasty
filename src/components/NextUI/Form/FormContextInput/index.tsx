import { Input, InputProps } from '@nextui-org/react'
import { useState } from 'react'
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import Svg from 'react-inlinesvg'

import EyeSlashIcon from '~/assets/svg/eye-slash.svg'
import EyeIcon from '~/assets/svg/eye.svg'

interface FormContextInputProps<T extends { [key: string]: keyof T }>
  extends InputProps {
  name: FieldPath<T>
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >
}
const FormContextInput = <T extends FieldValues>(
  props: FormContextInputProps<T>,
) => {
  const { control } = useFormContext()
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

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
          isInvalid={!!error?.message}
          classNames={{
            inputWrapper: 'bg-white !border hover:!border-primary',
            label: 'font-semibold',
            input: 'text-primary-text-color',
            errorMessage: 'flex justify-start items-center',
          }}
          color={!!error ? 'danger' : 'primary'}
          size="md"
          variant="bordered"
          endContent={
            props?.type === 'password' ? (
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <Svg
                    src={EyeIcon}
                    className="text-2xl text-default-400 pointer-events-none w-5 h-5"
                  />
                ) : (
                  <Svg
                    src={EyeSlashIcon}
                    className="text-2xl text-default-400 pointer-events-none w-5 h-5"
                  />
                )}
              </button>
            ) : (
              <></>
            )
          }
          {...props}
          type={
            props?.type !== 'password'
              ? props.type
              : isVisible
                ? 'text'
                : 'password'
          }
        />
      )}
    />
  )
}

export default FormContextInput
