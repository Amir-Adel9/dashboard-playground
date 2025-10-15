import { toast } from 'sonner'

import { useLogin } from '../stores/login.store'

import { router } from '@/app/routes/router'
import { userStore } from '@/app/stores/user.store'
import { postRequest } from '@/shared/api/http-client'
import { IS_DEV } from '@/shared/constants/env'
import { setCookie } from '@/shared/lib/cookies'

import type { loginFormSchema, otpViewSchema } from '../schemas/login.schema'
import type { LoginResponse } from '../types/login.types'
import type { ApiError } from '@/shared/api/api.types'
import type { z } from 'zod'

export async function initiateLogin({
  values,
}: {
  values: z.infer<typeof loginFormSchema>
}) {
  useLogin.setState({ email: values.email, password: values.password })
  return await postRequest<{ code: string; user: any }>(
    '/dashboard/auth/initiate-login',
    {
      body: values,
    },
  )
    .then((response) => {
      if (IS_DEV) console.log('OTP Code:', response.data.code)

      // Set user data from initiate-login response
      if (response.data.user) {
        userStore.setState({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          role: response.data.user.role?.name || '',
          permissions: response.data.user.permissions || [],
          created_at: response.data.user.created_at || '',
          isAuthenticated: false, // Not authenticated yet, waiting for OTP verification
        })
      }

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

export async function resendOTP() {
  const email = useLogin.getState().email
  const password = useLogin.getState().password
  return await postRequest<{ code: string }>('/dashboard/auth/initiate-login', {
    body: { email, password },
  })
    .then((response) => {
      if (IS_DEV) console.log('OTP Code:', response.data.code)

      return response
    })
    .then(() => useLogin.getState().startResendOTPTimer())
}

export async function verifyOTP({
  values,
}: {
  values: z.infer<typeof otpViewSchema>
}) {
  const email = useLogin.getState().email

  try {
    const res = await postRequest<LoginResponse>(
      '/dashboard/auth/complete-login',
      {
        body: {
          email,
          verification_code: values.otp,
        },
      },
    )

    // Check if the response indicates success
    if (res.status !== true) {
      throw new Error('Login failed: Unexpected response from server')
    }

    const data = res.data

    setCookie('auth-token', data.token)

    // Only set isAuthenticated to true, user data already set in initiate-login
    userStore.setState({
      isAuthenticated: true,
    })

    router.navigate({ to: '/' })

    toast.success('Successfully logged in')
  } catch (error) {
    console.error('Login error:', error)

    // Clear user data that was set in initiate-login since complete-login failed
    userStore.setState({
      name: '',
      email: '',
      role: '',
      permissions: [],
      created_at: '',
      isAuthenticated: false,
    })

    // Check for specific OTP-related errors
    const errorMessage =
      (error as ApiError).message || (error as any).response?.message || ''

    if (
      errorMessage.includes('invalid data or expired code') ||
      (errorMessage.includes('invalid') && errorMessage.includes('expired'))
    ) {
      throw new Error('The OTP is invalid or expired')
    }

    // Re-throw the original error for other cases
    throw error
  }
}
