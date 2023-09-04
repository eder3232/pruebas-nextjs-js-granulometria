import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
}

const TH3: FC<PropsWithChildren<Props>> = ({ children, className = '' }) => {
  return (
    <h3
      className={twMerge(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
    >
      {children}
    </h3>
  )
}

export default TH3
