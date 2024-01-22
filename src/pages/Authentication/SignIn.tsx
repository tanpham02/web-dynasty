import { Button } from '@nextui-org/react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import ICO_EYE_ACTIVE from '~/assets/svg/eye-active.svg';
import ICO_EYE_INACTIVE from '~/assets/svg/eye-inactive.svg';
import { LOCAL_STORAGE } from '~/constants/local_storage';
import { PATH_NAME } from '~/constants/router';
import { SignInType } from '~/models/authen';
import authService from '~/services/authService';
import LogoNoBg from '~/assets/svg/logo-login-page.svg';

const SignIn = () => {
  const navigation = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isRevealPwd, setIsRevealPwd] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>({
    defaultValues: {
      username: 'admin',
      password: '13112002',
    },
  });
  const onSubmit: SubmitHandler<SignInType> = async (data: SignInType) => {
    try {
      const formData = new FormData();
      formData.append(
        'userLoginInfo',
        JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      );
      const response = await authService.signIn(formData);

      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, response.refreshToken);
      navigation(PATH_NAME.STAFF_MANAGEMENT);
      enqueueSnackbar({
        message: 'Đăng nhập thành công!',
        autoHideDuration: 2000,
      });
      reset();
    } catch (error) {
      enqueueSnackbar({
        message: 'Đăng nhập thất bại!',
        variant: 'error',
        autoHideDuration: 2000,
      });
      console.log(error);
    }
  };

  const setStyleValidate = (name: string) =>
    errors[name as keyof typeof errors] ? { border: '2px solid red' } : {};
  return (
    <>
      <div className="rounded-sm border h-[100vh] border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center h-full">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className=" py-17.5 px-26 text-center">
              <span className="mt-15 inline-block">
                <Link
                  className="mb-5.5 flex justify-center items-center"
                  to={PATH_NAME.STAFF_MANAGEMENT}
                >
                  {/* <img
                    className="hidden dark:block w-[400px] object-cover"
                    src="https://thepizzacompany.vn/images/thumbs/000/0003640_Vn-doc.png"
                    alt="Logo"
                  /> */}
                  {/* <img
                    className="dark:hidden w-[400px] object-cover"
                    src="https://thepizzacompany.vn/images/thumbs/000/0003640_Vn-doc.png"
                    alt="Logo"
                  /> */}
                  <img src={LogoNoBg} />
                </Link>
              </span>
            </div>
          </div>

          <div className="w-full  border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5  ">
              <i className="mb-1.5 text-lg block font-semibold">Đăng nhập vào </i>
              <h2 className="mb-9 text-3xl uppercase text-center font-bold text-black dark:text-white sm:text-title-xl2 italic">
                Dynasty Dashboard
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      {...register('username', {
                        required: true,
                      })}
                      style={setStyleValidate('username')}
                      placeholder="Nhập tên đăng nhập của bạn"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.username?.type === 'required' && (
                      <span className="relative mt-2 block text-sm font-semibold text-danger">
                        Vui lòng nhập tên đăng nhập của bạn !
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mật khẩu
                  </label>
                  <div className="relative flex">
                    <input
                      id="password"
                      type={isRevealPwd ? 'text' : 'password'}
                      {...register('password', {
                        required: true,
                      })}
                      style={setStyleValidate('password')}
                      placeholder="Nhập mật khẩu của bạn"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    <img
                      className="absolute top-4 right-4"
                      src={isRevealPwd ? ICO_EYE_ACTIVE : ICO_EYE_INACTIVE}
                      width={'3%'}
                      height={'3%'}
                      alt="Your SVG"
                      onClick={() => setIsRevealPwd((prevState) => !prevState)}
                    />
                  </div>
                  {errors.password?.type === 'required' && (
                    <span className="relative mt-2 block text-sm font-semibold text-danger">
                      Vui lòng nhập mật khẩu
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  {/* <input
                    type="submit"
                    value="Đăng nhập"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  /> */}
                  <Button
                    color="primary"
                    className="w-full"
                    size="lg"
                    variant="shadow"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
