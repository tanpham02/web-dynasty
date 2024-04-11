import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE, PATH_NAME } from "~/constants";

import { SignInType } from "~/models";
import { AuthService } from "~/services";

export const useLoginForm = () => {
    const navigation = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const formMethods = useForm<SignInType>({
        defaultValues: {
            username: 'admin',
            password: '13112002',
        },
    });

    const { handleSubmit, reset, formState: { isSubmitting: isLogin } } = formMethods;

    const login = async (data: SignInType) => {
        try {
            const formData = new FormData();
            formData.append(
                'userLoginInfo',
                JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            );
            const response = await AuthService.signIn(formData);

            localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, response.accessToken);
            localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, response.refreshToken);
            navigation(PATH_NAME.STAFF_MANAGEMENT);
            enqueueSnackbar({
                message: 'Đăng nhập thành công!',
            });
            reset();
        } catch (error) {
            enqueueSnackbar({
                message: 'Đăng nhập thất bại!',
                variant: 'error',
            });
            console.log(error);
        }
    };

    const handleLogin = handleSubmit(login)

    return { handleLogin, formMethods, isLogin } as const
}