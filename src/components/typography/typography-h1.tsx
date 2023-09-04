import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
}

const TH1: FC<PropsWithChildren<Props>> = ({ children, className = '' }) => {
  return (
    <h1
      className={twMerge(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}

export default TH1
