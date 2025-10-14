import { toast } from 'sonner'

import { useLogin } from '../stores/login.store'

import { router } from '@/app/main'
import { userStore } from '@/app/stores/user.store'
import { postRequest } from '@/shared/api/http-client'
import { IS_DEV } from '@/shared/constants/env'
import { getCookie, setCookie } from '@/shared/lib/cookies'

import type { loginFormSchema, otpViewSchema } from '../schemas/login.schema'
import type { z } from 'zod'

// Step 1: Initiate login and send OTP
export async function initiateLogin({
  values,
}: {
  values: z.infer<typeof loginFormSchema>
}) {
  useLogin.setState({ email: values.email, password: values.password })
  return await postRequest<{ code: string }>('/dashboard/auth/initiate-login', {
    body: values,
  })
    .then((response) => {
      console.log('OTP Code:', response.data.code)
      console.log(IS_DEV)
      if (IS_DEV) console.log('OTP Code:', response.data.code)

      return response
    })
    .then((_) => {
      useLogin.getState().startResendOTPTimer()
      useLogin.setState({ currentView: 'otp' })
    })
    .catch((error) => {
      if (error.response?.message === 'Credentials Doesn`t Match Our Records') {
        throw new Error('Invalid email or password')
      } else if (error.response?.message === 'auth.access_denied') {
        throw new Error('Access Denied')
      }
      throw error
    })
}

// Step 1.5: Resend OTP
export async function resendOTP() {
  const email = useLogin.getState().email
  const password = useLogin.getState().password
  return await postRequest('/dashboard/auth/initiate-login', {
    body: { email, password },
  }).then(() => useLogin.getState().startResendOTPTimer())
}

// Step 2: Verify OTP and complete login
export async function verifyOTP({
  values,
}: {
  values: z.infer<typeof otpViewSchema>
}) {
  const email = useLogin.getState().email

  return await postRequest<{ token: string; user: any }>(
    '/dashboard/auth/complete-login',
    {
      body: {
        email,
        verification_code: values.otp,
      },
    },
  )
    .then((res) => {
      if (
        res.status !== true ||
        res.message !== 'auth.successfully_logged_in'
      ) {
        throw new Error('Login failed: Unexpected response from server')
      }

      return res.data
    })
    .then((data) => {
      if (!data.token || !data.user) {
        throw new Error('Login failed: Missing token or user data')
      }

      // Step 1: Set the token
      try {
        setCookie('token', data.token, 7)
      } catch (error) {
        console.error('Error setting cookie:', error)
        throw error
      }

      // Step 2: Update userStore
      try {
        userStore.setState({
          name: data.user.name || '',
          email: data.user.email || '',
          role: data.user.role?.name || '',
          permissions: data.user.permissions || [],
          created_at: data.user.created_at || '',
          isAuthenticated: getCookie('token') ? true : false,
        })
      } catch (error) {
        console.error('Error updating userStore:', error)
        throw error
      }

      // Step 3: Reset useLogin store
      try {
      } catch (error) {
        console.error('Error resetting useLogin store:', error)
        throw error
      }

      // Step 4: Handle navigation
      try {
        console.log('Redirecting to /')
        router.navigate({ to: '/' })
      } catch (error) {
        console.error('Error navigating:', error)
      }
      // Step 5: Show success toast
      try {
        toast.success('Successfully logged in')
      } catch (error) {
        console.error('Error showing toast:', error)
        // Don't throw the error, as this is a non-critical step
      }
    })
    .catch((error) => {
      console.error('Verify OTP Error:', error)
      if (error.response?.message === 'site.invalid_or_expired_code') {
        throw new Error('The OTP is invalid or expired')
      }
      throw error
    })
}
