type LayoutOffender = {
  route: string
  width: number
  selector: string
  overflowPx: number
  reason: 'container-edge' | 'scroll-width' | 'clipped-text' | 'page-scroll'
}

declare global {
  interface Window {
    __UIT_LAYOUT_AUDIT__?: {
      run: () => LayoutOffender[]
      results: LayoutOffender[]
    }
  }
}

const intentionalOverflow = '.table-scroll,.tabs,.sidebar nav,.drawer,.dialog,.command,.sidebar-brand,.sidebar-toggle,.popover-wrap,.top-icon,.brand-logo,.hero-watermark,.dashboard-hero,.profile-photo,[data-overflow-x],[data-layout-ignore]'
const containerSelector = '.card,.content,.dialog,.drawer,.popover,.topbar,.sidebar,[data-layout-container]'

function selectorFor(element: Element) {
  const htmlElement = element as HTMLElement
  if (htmlElement.id) return `#${CSS.escape(htmlElement.id)}`
  const classes = [...element.classList].slice(0, 3).map(name => `.${CSS.escape(name)}`).join('')
  return `${element.tagName.toLowerCase()}${classes}`
}

function hasTextNode(element: Element) {
  return [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
}

function auditLayout(): LayoutOffender[] {
  document.querySelectorAll('[data-layout-overflow]').forEach(element => {
    element.removeAttribute('data-layout-overflow')
    ;(element as HTMLElement).style.removeProperty('outline')
  })

  const route = location.pathname
  const width = window.innerWidth
  const offenders: LayoutOffender[] = []
  const seen = new Set<string>()
  const flagged: Array<{ element: Element, overflowPx: number, reason: LayoutOffender['reason'] }> = []
  const record = (element: Element, overflowPx: number, reason: LayoutOffender['reason']) => {
    const descendantAlreadyExplainsOverflow = flagged.some(flag =>
      flag.reason === reason &&
      element.contains(flag.element) &&
      flag.overflowPx >= overflowPx - 2
    )
    if (descendantAlreadyExplainsOverflow) return
    const selector = selectorFor(element)
    const key = `${selector}:${reason}`
    if (seen.has(key) || overflowPx < 3) return
    seen.add(key)
    flagged.push({ element, overflowPx, reason })
    offenders.push({ route, width, selector, overflowPx: Math.ceil(overflowPx), reason })
    element.setAttribute('data-layout-overflow', reason)
    ;(element as HTMLElement).style.setProperty('outline', '2px solid #dc2626', 'important')
  }

  if (document.documentElement.scrollWidth > width) {
    record(document.documentElement, document.documentElement.scrollWidth - width, 'page-scroll')
  }

  ;[...document.querySelectorAll('body *')].reverse().forEach(element => {
    if (!(element instanceof HTMLElement) || ['OPTION', 'SCRIPT', 'STYLE'].includes(element.tagName) || element.closest('[aria-hidden="true"]')) return
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || style.position === 'fixed') return
    const visibleRect = element.getBoundingClientRect()
    if (!element.getClientRects().length || (visibleRect.width === 0 && visibleRect.height === 0)) return
    const intentional = element.matches(intentionalOverflow) || Boolean(element.closest(intentionalOverflow))
    const intentionalClip = element.hasAttribute('title') || element.hasAttribute('data-truncate')
    const container = element.parentElement?.closest(containerSelector)
    if (container && container !== element && !intentional) {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      record(element, Math.max(rect.right - containerRect.right, containerRect.left - rect.left), 'container-edge')
    }
    if (!intentional && !intentionalClip && style.display !== 'inline' && element.scrollWidth > element.clientWidth + 2) {
      record(element, element.scrollWidth - element.clientWidth, 'scroll-width')
      if (hasTextNode(element) && ['hidden', 'clip'].includes(style.overflowX)) {
        record(element, element.scrollWidth - element.clientWidth, 'clipped-text')
      }
    }
  })

  console.groupCollapsed(`[UIT layout audit] ${route} · ${width}px · ${offenders.length} offender(s)`)
  console.table(offenders)
  console.groupEnd()
  window.dispatchEvent(new CustomEvent('uit:layout-audit', { detail: offenders }))
  if (window.__UIT_LAYOUT_AUDIT__) window.__UIT_LAYOUT_AUDIT__.results = offenders
  return offenders
}

export function enableLayoutDebug() {
  if (import.meta.env.PROD || new URLSearchParams(location.search).get('debug') !== 'layout') return
  let timer = 0
  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(auditLayout, 80)
  }
  window.__UIT_LAYOUT_AUDIT__ = { run: auditLayout, results: [] }
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  window.addEventListener('resize', schedule)
  window.addEventListener('popstate', schedule)
  schedule()
}
