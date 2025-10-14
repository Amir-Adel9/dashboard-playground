import LoginView from './components/LoginView'
import OTPView from './components/OTPView'
import { useLogin } from './stores/login.store'

const Login = () => {
  const currentView = useLogin((state) => state.currentView)

  switch (currentView) {
    case 'login':
      return <LoginView />
    case 'otp':
      return <OTPView />
    default:
      return <LoginView />
  }
}

export default Login
