import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useForm } from 'react-hook-form'

import ResendOTPButton from './ResendOTPButton'

import { verifyOTP } from '../api/login.api'
import { otpViewSchema } from '../schemas/login.schema'
import { useLogin } from '../stores/login.store'

import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/shared/components/ui/input-otp'
import { Label } from '@/shared/components/ui/label'

import type { z } from 'zod'

const OTPForm = () => {
  const otpViewForm = useForm<z.infer<typeof otpViewSchema>>({
    resolver: zodResolver(otpViewSchema),
    defaultValues: {
      otp: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const onSubmit = async (values: z.infer<typeof otpViewSchema>) => {
    try {
      await verifyOTP({ values })
    } catch (error) {
      otpViewForm.setError('otp', {
        type: 'manual',
        message:
          error instanceof Error
            ? error.message
            : 'The OTP is invalid or expired',
      })
    }
  }

  const enteredEmail = useLogin((state) => state.email)

  if (!enteredEmail) {
    useLogin.setState({
      currentView: 'login',
    })
  }

  return (
    <div>
      <div>
        <div className="w-full flex flex-col items-center gap-5">
          <h2 className="text-center text-lg font-medium w-full text-muted-foreground">
            Two-Factor Authentication
          </h2>
          <div className="flex flex-col items-center gap-2">
            <Label>Enter the OTP sent to the email:</Label>
            <Label className="text-sm text-muted-foreground block">
              {enteredEmail || 'No email was entered'}
            </Label>
          </div>
        </div>
        <Form {...otpViewForm}>
          <form onSubmit={otpViewForm.handleSubmit(onSubmit)}>
            <FormField
              control={otpViewForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-5 w-full"
              isLoading={otpViewForm.formState.isSubmitting}
            >
              Verify
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <ResendOTPButton />
      </div>
    </div>
  )
}

export default OTPForm
