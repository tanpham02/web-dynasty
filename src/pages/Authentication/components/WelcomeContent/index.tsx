import Logo from '~/assets/images/logo/logo-transparent.png';

const WelcomeContent = () => {
  return (
    <>
      <img src={Logo} className="w-26 h-26 object-contain" />
      <p className="text-2xl font-bold mt-4 text-center">Chào mừng bạn trở lại</p>
      <p className="text-lg lg:text-xl font-medium text-center px-4">
        Đăng nhập vào trang quản lý Dynasty Pizza Dashboard
      </p>
    </>
  );
};

export default WelcomeContent;
