import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }: PasswordInputProps, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={className}
        {...props}
        ref={ref}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
})

export default PasswordInput
