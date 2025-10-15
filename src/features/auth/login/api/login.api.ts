import { toast } from 'sonner'

import { useLogin } from '../stores/login.store'

import { router } from '@/app/routes/router'
import { userStore } from '@/app/stores/user.store'
import { postRequest } from '@/shared/api/http-client'
import { IS_DEV } from '@/shared/constants/env'
import { getCookie, setCookie } from '@/shared/lib/cookies'

import type { loginFormSchema, otpViewSchema } from '../schemas/login.schema'
import type { ApiError } from '@/shared/api/api.types'
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

  try {
    const res = await postRequest<{ token: string; user: any }>(
      '/dashboard/auth/complete-login',
      {
        body: {
          email,
          verification_code: values.otp,
        },
      },
    )

    if (res.status !== true || res.message !== 'auth.successfully_logged_in') {
      throw new Error('Login failed: Unexpected response from server')
    }

    const data = res.data
    if (!data.token || !data.user) {
      throw new Error('Login failed: Missing token or user data')
    }

    // Step 1: Set the token
    setCookie('auth-token', data.token)

    // Step 2: Update userStore
    userStore.setState({
      name: data.user.name || '',
      email: data.user.email || '',
      role: data.user.role?.name || '',
      permissions: data.user.permissions || [],
      created_at: data.user.created_at || '',
      isAuthenticated: !!getCookie('auth-token'),
    })

    // Step 3: Reset useLogin store (empty for now)

    // Step 4: Handle navigation
    router.navigate({ to: '/' })

    // Step 5: Show success toast
    toast.success('Successfully logged in')
  } catch (error) {
    if ((error as ApiError).message === 'site.invalid_or_expired_code') {
      throw new Error('The OTP is invalid or expired')
    }
    throw error
  }
}
