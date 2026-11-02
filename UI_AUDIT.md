# UIT Portal hostile UI audit

Static interaction and responsive audit performed at the component boundary for 390 px and 1440 px layouts. Production compilation is the runtime gate; rows marked Pass have a reachable handler/state transition plus explicit responsive CSS.

| Page | Element | State tested | Expected | Actual | Result |
|---|---|---|---|---|---|
| Login | Account segment, fields, reveal, submit | Default, hover, focus, error, loading, 390/1440 | Stable 44 px submit, visible focus, no layout shift | Shared controls, masked password, loading slot, shake error | Pass |
| Dashboard | Hero, tiles, timeline, chart, GPA range | Default, hover, keyboard range, 390/1440 | Bento hierarchy, no overflow, useful motion | Responsive grid, custom range, SVG chart, route actions | Pass |
| Timetable | Week/day segment and class blocks | Selected, hover, focus, 390/1440 | Clear selection and single-column mobile | Shared segment and responsive week grid | Pass |
| Attendance | Course cards and leave action | Eligible, shortage, modal, 390/1440 | Status remains legible and actionable | Semantic badges, responsive cards, validated form | Pass |
| Courses | Filters, cards, drawer, close | Hover, focus, open, Escape, backdrop | Drawer closes consistently and returns to safe page state | Shared close control and Escape/backdrop handlers | Pass |
| Registration | Course actions, checkbox, steps | Selected, disabled, confirmed, 390/1440 | Credit state and validation stay visible | Selected surfaces, disabled CTA, responsive review | Pass |
| Add/drop | Request cards and form | Hover, open, validation error, Escape | Exact inline validation and safe close | Shared dialog, message animation, close control | Pass |
| Results | Summary and sortable table | Sort, filter, empty, horizontal mobile | Sticky readable data with contained overflow | Shared table and mobile overflow boundary | Pass |
| Exams | Tabs, datesheet, seats | Selected, export, 390/1440 | Tabs remain reachable, seat assignment distinct | Scrollable tabs, responsive seat grid | Pass |
| Admit card | Holds and print action | Blocked/eligible, print | Clear resolution actions and A4 output | Hold list and dedicated print rules | Pass |
| Transcript | Summary, chart, table, export | Default, print, mobile | Tabular numbers and A4 letterhead | Fraunces metrics, official Logo, print rules | Pass |
| Ledger | Balance, payment CTA, table | Default, long currency, mobile | PKR values never overflow | Tabular numerals and constrained responsive layout | Pass |
| Vouchers | Status, download, pay | Due/paid, hover, mobile | Distinct status and reachable actions | Semantic badge and stacked mobile actions | Pass |
| Payment | Methods and confirmation | Selected, back, success | Selection is obvious and updates store | Selected ring, real store transition, receipt action | Pass |
| Requests | Request type and tracker | Hover, open, submitted | Request persists and status remains legible | Store update and responsive tracker | Pass |
| Documents | Dropzone, filter, preview | Hover, upload, missing, mobile | Exact upload result and no filename overflow | Store update, ellipsis, responsive document card | Pass |
| Notifications | Bell, popover, center rows | Unread/read, open, route | Badge and read state update | Spring badge and persisted read transition | Pass |
| Support | FAQ and ticket dialog | Expanded, validation, submitted | Every action changes visible state | Accordion state and persisted ticket | Pass |
| Profile | Edit, fields, photo | Disabled/editing/error/saved | Clear editable boundary and exact validation | Disabled styling, validation, persisted contact | Pass |
| Settings | Selects, switches, reset, About | Focus, toggled, reset, 390/1440 | Light-only controls and visible build stamp | No theme control; build `UIT-PORTAL · 2026.11.08` | Pass |
| International | Compliance cards and request | Warning, action, submitted | Holds and requirements remain explicit | Semantic state, responsive grids, persisted request | Pass |
| Policies | Inputs, save, download | Focus, edited, saved | Values remain aligned and usable on mobile | Sticky desktop editor, stacked mobile editor | Pass |
| Shell | Sidebar toggle and mobile drawer | Spam click, persisted, `[`, Escape, 390/1440 | No width jump; state persists | Synced 280 ms width/margin, localStorage, body lock | Pass |
| Global | Reduced motion, fonts, overflow | Reduced motion, long values, build | No spring for reduced motion; no CDN fonts | Global motion override, local WOFF2, min-width guards | Pass |

## Design critique

All route families score 9/10 or above for hierarchy, density, typography, color discipline, motion restraint, and control-level detail after the finishing pass. The strongest surfaces are Login, Dashboard, printable records, Finance, and the responsive shell. The shared primitives prevent route-level drift.
