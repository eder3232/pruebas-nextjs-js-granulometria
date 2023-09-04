import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
}

const TH2: FC<PropsWithChildren<Props>> = ({ children, className = '' }) => {
  return (
    <h2
      className={twMerge(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
        className
      )}
    >
      {children}
    </h2>
  )
}

export default TH2
