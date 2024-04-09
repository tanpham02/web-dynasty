import { Button } from '@nextui-org/react';
import { FormProvider } from 'react-hook-form';

import { FormContextInput } from '~/components/NextUI/Form';
import { useLoginForm } from './useLoginForm';

const LoginForm = () => {
  const { formMethods, handleLogin, isLogin } = useLoginForm();

  return (
    <FormProvider {...formMethods}>
      <div className="space-y-4 w-full px-10">
        <FormContextInput name="username" label="Tài khoản" />
        <FormContextInput name="password" label="Mật khẩu" type="password" />
        <Button
          size="lg"
          variant="shadow"
          isLoading={isLogin}
          onClick={handleLogin}
          className="w-full bg-primary text-white"
        >
          Đăng nhập
        </Button>
      </div>
    </FormProvider>
  );
};

export default LoginForm;
