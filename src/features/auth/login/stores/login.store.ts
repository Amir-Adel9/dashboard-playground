import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface LoginStore {
  email: string
  password: string
  otp: string
  currentView: 'login' | 'otp'
  resendOTPTimer: number
  isResendOTPDisabled: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setOTP: (otp: string) => void
  setCurrentView: (currentView: 'login' | 'otp') => void
  startResendOTPTimer: () => void
  resumeResendOTPTimer: () => void
}

export const useLogin = create<LoginStore>()(
  persist(
    (set) => ({
      email: '',
      password: '',
      otp: '',
      currentView: 'login',
      resendOTPTimer: 0,
      isResendOTPDisabled: false,
      setEmail: (email: string) => set({ email }),
      setPassword: (password: string) => set({ password }),
      setOTP: (otp: string) => set({ otp }),
      setCurrentView: (currentView: 'login' | 'otp') => set({ currentView }),
      startResendOTPTimer: () => {
        set({ resendOTPTimer: 60, isResendOTPDisabled: true })
        const interval = setInterval(() => {
          set((state) => {
            if (state.resendOTPTimer <= 1) {
              clearInterval(interval)
              return {
                resendOTPTimer: 0,
                isResendOTPDisabled: false,
              }
            }
            return { resendOTPTimer: state.resendOTPTimer - 1 }
          })
        }, 1000)
      },
      resumeResendOTPTimer: () => {
        const interval = setInterval(() => {
          set((currentState) => {
            if (currentState.resendOTPTimer <= 1) {
              clearInterval(interval)
              return {
                resendOTPTimer: 0,
                isResendOTPDisabled: false,
              }
            }
            return {
              resendOTPTimer: currentState.resendOTPTimer - 1,
            }
          })
        }, 1000)
      },
    }),
    {
      name: 'login',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        email: state.email,
        password: state.password, // Persist password
        resendOTPTimer: state.resendOTPTimer,
        isResendOTPDisabled: state.isResendOTPDisabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.resendOTPTimer !== 0 && state?.isResendOTPDisabled) {
          state.resumeResendOTPTimer()
        }
      },
    },
  ),
)
