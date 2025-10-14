import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { initiateLogin } from '../api/login.api'
import { loginFormSchema } from '../schemas/login.schema'

import PasswordInput from '@/shared/components/custom/PasswordInput'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'

import type { z } from 'zod'

const LoginView = () => {
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const onSubmit = async () => {
    try {
      await initiateLogin({
        values: loginForm.getValues(),
      })
      toast.success('OTP sent to your email')
    } catch (error: any) {
      if (error.message === 'Access Denied') {
        toast.error(error.message)
      } else {
        loginForm.setError('email', {
          type: 'manual',
          message: '',
        })
        loginForm.setError('password', {
          type: 'manual',
          message: error.message,
        })
      }
    }
  }

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmit)}
        className="space-y-5 w-full"
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm font-medium text-right text-secondary hover:underline cursor-pointer underline-offset-4">
          <Link to="/">Forgot password?</Link>
        </div>
        <Button
          type="submit"
          className="w-full"
          isLoading={loginForm.formState.isSubmitting}
        >
          Login
        </Button>
      </form>
    </Form>
  )
}

export default LoginView
