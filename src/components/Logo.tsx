import type { MouseEvent } from 'react'

export type LogoVariant = 'full' | 'mark' | 'onDark'

type LogoProps = {
  variant?: LogoVariant
  className?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function Logo({ variant = 'full', className = '', onClick }: LogoProps) {
  const mark = variant === 'mark'
  return (
    <a
      className={`brand-logo brand-logo--${variant} ${className}`}
      href="/dashboard"
      aria-label="UIT Student Portal home"
      onClick={onClick}
    >
      <img
        src={mark ? '/uit-mark.png' : '/uit-logo-official.jpg'}
        alt={mark ? 'UIT University mark' : 'UIT University'}
        width={mark ? 640 : 1614}
        height={640}
        decoding="async"
      />
    </a>
  )
}
