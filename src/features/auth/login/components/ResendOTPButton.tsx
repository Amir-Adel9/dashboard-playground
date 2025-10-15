import { useEffect } from 'react'

import { resendOTP } from '../api/login.api'
import { useLogin } from '../stores/login.store'

import { Button } from '@/shared/components/ui/button'

let isFirstCycle = true

const ResendOTPButton = () => {
  const resendOTPTimer = useLogin((state) => state.resendOTPTimer)
  const isResendOTPDisabled = useLogin((state) => state.isResendOTPDisabled)
  const startResendOTPTimer = useLogin((state) => state.startResendOTPTimer)

  useEffect(() => {
    if (resendOTPTimer === 0 && !isResendOTPDisabled && isFirstCycle) {
      resendOTP()
      startResendOTPTimer()
      isFirstCycle = false
    }
  }, [resendOTPTimer, isResendOTPDisabled, startResendOTPTimer])

  return (
    <Button
      variant="link"
      disabled={isResendOTPDisabled}
      onClick={() => {
        resendOTP()
        startResendOTPTimer()
      }}
      className="text-center"
    >
      Resend OTP {resendOTPTimer !== 0 && ` in ${resendOTPTimer}s`}
    </Button>
  )
}

export default ResendOTPButton
