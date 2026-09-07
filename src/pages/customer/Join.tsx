import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Btn, Field, Panel, SectionHead, Select, TextInput } from '../../components/ui'
import QrCode from '../../components/QrCode'
import { useAppState } from '../../state/AppState'
import { TIERS } from '../../lib/mockData'
import { fmt } from '../../lib/format'

const DAILY_OPTION = 'Daily'

export default function Join() {
  const navigate = useNavigate()
  const { joinSuccess, joinAsMember, signInAs } = useAppState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tier, setTier] = useState(DAILY_OPTION)

  const isDaily = tier === DAILY_OPTION

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    joinAsMember({ name, email, phone, tier })
  }

  if (joinSuccess) {
    return (
      <>
        <SectionHead title="Welcome to the Society" />
        <div className="bg-kelp/10 border border-kelp rounded-xl p-5.5">
          {joinSuccess.tier === DAILY_OPTION ? (
            <p className="m-0 mb-2.5">
              <b>{joinSuccess.name}</b> has a Surf Society account for daily rentals — no membership, pay per visit
              at pickup.
            </p>
          ) : (
            <p className="m-0 mb-2.5">
              <b>{joinSuccess.name}</b> is signed up on the <b>{joinSuccess.tier}</b> plan. First charge of{' '}
              <b>${joinSuccess.amount}</b> is scheduled for <b>{fmt(joinSuccess.nextBilling)}</b>.
            </p>
          )}
          <Btn
            variant="primary"
            onClick={() => {
              signInAs(joinSuccess.name)
              navigate('/account')
            }}
          >
            Go to My Account
          </Btn>
        </div>
      </>
    )
  }

  return (
    <>
      <SectionHead title="Join The Surf Society" />
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div className="bg-card border border-line rounded-[14px] p-6.5 text-center">
          <QrCode data="https://thesurfsociety.com/join" />
          <p className="text-[13px] text-ink-soft mt-3">
            Scan to open the sign-up page on your phone and join in under a minute.
          </p>
        </div>
        <Panel className="mb-0">
          <h2 className="text-[16px]">Or sign up here</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Field label="Full name">
                <TextInput required placeholder="Jane Rivera" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email">
                <TextInput
                  required
                  type="email"
                  placeholder="jane@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <TextInput required placeholder="(858) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <Field label="Account type">
                <Select value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value={DAILY_OPTION}>Daily rental — no membership</option>
                  {TIERS.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} — ${t.price}/mo
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <p className="text-ink-soft text-[13px] mt-3">
              {isDaily
                ? "You'll pay per rental at pickup — no monthly fee, no included days. Switch to a membership any time."
                : `$${TIERS.find((t) => t.name === tier)?.price}/month, billed until you cancel.`}
            </p>
            <div className="flex gap-2.5 mt-5">
              <Btn type="submit" variant="gold">
                {isDaily ? 'Create account' : 'Join now'}
              </Btn>
            </div>
          </form>
        </Panel>
      </div>
    </>
  )
}
