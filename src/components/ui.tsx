import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Globe2,
  LayoutDashboard,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  TriangleAlert,
  UserRound,
  WalletCards,
  X,
  type LucideIcon,
} from 'lucide-react'

export type IconName =
  | 'home' | 'book' | 'calendar' | 'exam' | 'wallet' | 'check' | 'file'
  | 'bell' | 'help' | 'user' | 'settings' | 'globe' | 'search' | 'menu'
  | 'close' | 'chevron' | 'download' | 'plus' | 'clock' | 'pin' | 'alert'
  | 'arrow' | 'eye'

const iconMap: Record<IconName, LucideIcon> = {
  home: LayoutDashboard,
  book: BookOpen,
  calendar: CalendarDays,
  exam: FileCheck2,
  wallet: WalletCards,
  check: Check,
  file: FileText,
  bell: Bell,
  help: CircleHelp,
  user: UserRound,
  settings: Settings,
  globe: Globe2,
  search: Search,
  menu: Menu,
  close: X,
  chevron: ChevronRight,
  download: Download,
  plus: Plus,
  clock: Clock3,
  pin: MapPin,
  alert: TriangleAlert,
  arrow: ArrowRight,
  eye: Eye,
}

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  const Component = iconMap[name]
  return <Component aria-hidden="true" className={className} size={size} strokeWidth={1.75} />
}

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft-danger' | 'gold' | 'text'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`button ${variant} size-${size} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className={`button-spinner ${loading ? 'visible' : ''}`} aria-hidden="true" />
      <span className="button-label">{children}</span>
    </button>
  )
}

export function IconButton({
  icon,
  label,
  size = 'sm',
  className = '',
  ...props
}: {
  icon: IconName
  label: string
  size?: 'xs' | 'sm' | 'md'
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={`icon-button size-${size} ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon name={icon} size={size === 'xs' ? 14 : 16} />
    </button>
  )
}

export function CloseButton(props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & { label?: string }) {
  const { label = 'Close', className = '', ...rest } = props
  return <IconButton {...rest} icon="close" label={label} size="xs" className={`close-button ${className}`} />
}

export function Badge({ children, tone = 'info', dot = false }: { children: ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`badge ${tone}`}>{dot && <i aria-hidden="true" />}{children}</span>
}

export function statusTone(status: string) {
  const value = status.toLowerCase()
  if (['verified', 'complete', 'completed', 'paid', 'approved'].includes(value)) return 'success'
  if (['pending', 'in review', 'due soon', 'due'].includes(value)) return 'warning'
  if (['missing', 'required', 'overdue', 'rejected', 'blocked'].includes(value)) return 'danger'
  return 'neutral'
}

export function Card({
  children,
  className = '',
  onClick,
  title,
  description,
  action,
  footer,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  title?: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
}) {
  return (
    <section
      className={`card ${className} ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick()
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && <header className="card-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <div className="card-action">{action}</div>}</header>}
      {title ? <div className="card-body">{children}</div> : children}
      {footer && <footer className="card-footer">{footer}</footer>}
    </section>
  )
}

export function ListRow({
  leading,
  title,
  description,
  trailing,
  onClick,
  className = '',
}: {
  leading?: ReactNode
  title: string
  description?: string
  trailing?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const content = <>
    {leading && <span className="list-row-leading">{leading}</span>}
    <span className="list-row-content"><strong title={title}>{title}</strong>{description && <small>{description}</small>}</span>
    {trailing && <span className="list-row-trailing">{trailing}</span>}
  </>
  const classes = `list-row ${leading ? 'has-leading' : ''} ${className}`
  return onClick
    ? <button type="button" className={classes} onClick={onClick}>{content}</button>
    : <div className={classes}>{content}</div>
}

export function Switch({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="list-row switch-row" onClick={(event) => { if (!(event.target as HTMLElement).closest('button')) onChange(!checked) }}>
      <span className="list-row-content"><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? 'on' : ''}
        onClick={() => onChange(!checked)}
      >
        <i><Check size={11} strokeWidth={2.25} /></i>
      </button>
    </div>
  )
}
