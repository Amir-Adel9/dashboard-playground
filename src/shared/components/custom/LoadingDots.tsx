import { cn } from '@/shared/utils/tailwind-merge'

const LoadingDots = ({
  bg = 'bg-background',
  className,
}: {
  bg?: string
  className?: string
}) => {
  return (
    <div className="flex gap-1 justify-center">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            bg,
            'rounded-full h-[5px] w-[5px] animate-bounce',
            className,
          )}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.75s',
          }}
        />
      ))}
    </div>
  )
}

export default LoadingDots
