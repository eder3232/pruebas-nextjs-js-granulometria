import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
}

const TP: FC<PropsWithChildren<Props>> = ({ children, className = '' }) => {
  return (
    <p className={twMerge('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  )
}

export default TP
