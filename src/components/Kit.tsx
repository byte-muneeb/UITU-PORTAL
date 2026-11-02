import { Badge, Button, Card, CloseButton, IconButton, Switch } from './ui'
import { Logo } from './Logo'

export function Kit() {
  return (
    <main className="kit-page">
      <header>
        <Logo variant="full" />
        <div><span>Interface reference</span><h1>UIT component kit</h1><p>Light-theme production states for portal controls.</p></div>
      </header>
      <section className="kit-grid">
        <Card className="kit-card">
          <h2>Buttons</h2>
          <div className="kit-row">
            <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button><Button variant="gold">Gold accent</Button><Button loading>Saving</Button>
          </div>
          <div className="kit-row"><Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button size="lg">Large</Button><Button disabled>Disabled</Button></div>
        </Card>
        <Card className="kit-card">
          <h2>Icon controls</h2>
          <div className="kit-row"><IconButton icon="bell" label="Notifications" /><IconButton icon="search" label="Search" /><CloseButton /></div>
        </Card>
        <Card className="kit-card">
          <h2>Status</h2>
          <div className="kit-row"><Badge tone="success" dot>Verified</Badge><Badge tone="warning" dot>Due soon</Badge><Badge tone="danger" dot>Blocked</Badge><Badge>Information</Badge></div>
        </Card>
        <Card className="kit-card">
          <h2>Form controls</h2>
          <label>Student ID<input defaultValue="24SP-030-SE" /></label>
          <label>Program<select defaultValue="Software Engineering"><option>Software Engineering</option></select></label>
          <Switch label="Email notifications" checked onChange={() => undefined} />
        </Card>
        <Card className="kit-card logo-kit">
          <h2>Official logo system</h2>
          <Logo variant="full" /><Logo variant="mark" /><div className="kit-dark"><Logo variant="onDark" /></div>
        </Card>
      </section>
    </main>
  )
}
