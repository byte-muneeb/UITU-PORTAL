import { Logo } from './Logo'

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading UIT Student Portal">
      <div className="loading-mark">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" />
        </svg>
        <Logo variant="mark" />
      </div>
      <span>Preparing your portal</span>
    </div>
  )
}
