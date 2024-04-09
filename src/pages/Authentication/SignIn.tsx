import LoginBg from '~/assets/svg/login-bg.svg';
import { LoginForm, WelcomeContent } from './components';

const SignIn = () => {
  return (
    <div className="grid lg:grid-cols-2 h-svh py-20 container">
      <div className="lg:border-r-2 border-zinc-100 flex flex-col items-center h-full justify-center">
        <WelcomeContent />
        <LoginForm />
      </div>
      <img src={LoginBg} className="w-4/5 object-contain m-auto hidden lg:block" />
    </div>
  );
};

export default SignIn;
