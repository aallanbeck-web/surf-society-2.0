import { useState } from 'react'
import { Banner, Btn, Field, Panel, Select, Textarea } from './ui'
import { useAppState } from '../state/AppState'
import type { Member } from '../lib/types'

type TemplateKey = 'overdue_board' | 'past_due_payment' | 'upcoming_swell' | 'promotion' | 'custom'

const TEMPLATES: Record<TemplateKey, { label: string; subject: string; body: (m: Member) => string }> = {
  overdue_board: {
    label: 'Board overdue',
    subject: 'Your rental board is overdue',
    body: (m) =>
      `Hi ${m.name}, just a reminder that your rental board is overdue for return. Please bring it back at your earliest convenience, or contact us if you need to arrange an extension.`,
  },
  past_due_payment: {
    label: 'Payment past due',
    subject: 'Payment past due',
    body: (m) =>
      `Hi ${m.name}, we weren't able to process your last membership payment. Please update your payment method to keep your booking privileges active.`,
  },
  upcoming_swell: {
    label: 'Upcoming swell',
    subject: 'Swell on the way',
    body: (m) =>
      `Hi ${m.name}, a solid swell is lining up this weekend — great chance to get out on the water. Want to grab a board?`,
  },
  promotion: {
    label: 'Promotion',
    subject: 'A little something for you',
    body: (m) => `Hi ${m.name}, as a valued member of The Surf Society, enjoy a free board upgrade on your next rental this month.`,
  },
  custom: { label: 'Custom message', subject: 'Message from The Surf Society', body: () => '' },
}

export default function ContactClientPanel({
  member,
  defaultTemplate = 'custom',
  onClose,
}: {
  member: Member
  defaultTemplate?: TemplateKey
  onClose: () => void
}) {
  const { sendClientMessage } = useAppState()
  const [channel, setChannel] = useState<'email' | 'text'>('email')
  const [templateKey, setTemplateKey] = useState<TemplateKey>(defaultTemplate)
  const [body, setBody] = useState(TEMPLATES[defaultTemplate].body(member))
  const [sent, setSent] = useState(false)

  const handleTemplateChange = (key: string) => {
    const k = key as TemplateKey
    setTemplateKey(k)
    setBody(TEMPLATES[k].body(member))
  }

  const destination = channel === 'email' ? member.email : member.phone

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    sendClientMessage({
      memberName: member.name,
      channel,
      destination,
      subject: TEMPLATES[templateKey].label,
      body,
    })
    setSent(true)
  }

  if (sent) {
    return (
      <Panel>
        <Banner tone="good">
          Sent (simulated) to {member.name} via {channel === 'email' ? 'email' : 'text'} at {destination} — no real
          email or SMS is sent yet, see README for what Phase 2 needs.
        </Banner>
        <Btn variant="ghost" onClick={onClose}>
          Close
        </Btn>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="flex justify-between items-start">
        <h2 className="text-[16px]">Message {member.name}</h2>
        <Btn variant="text" onClick={onClose}>
          Cancel
        </Btn>
      </div>
      <form onSubmit={handleSend}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Field label="Send via">
            <Select value={channel} onChange={(e) => setChannel(e.target.value as 'email' | 'text')}>
              <option value="email">Email — {member.email}</option>
              <option value="text">Text — {member.phone}</option>
            </Select>
          </Field>
          <Field label="Template">
            <Select value={templateKey} onChange={(e) => handleTemplateChange(e.target.value)}>
              {(Object.entries(TEMPLATES) as [TemplateKey, (typeof TEMPLATES)[TemplateKey]][]).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Message">
          <Textarea rows={4} required value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <div className="flex gap-2.5 mt-5">
          <Btn type="submit" variant="primary">
            Send message
          </Btn>
        </div>
      </form>
    </Panel>
  )
}
