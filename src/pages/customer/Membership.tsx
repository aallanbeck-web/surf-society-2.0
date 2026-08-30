import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Btn, Field, Select, TextInput } from '../../components/ui'
import { useAppState } from '../../state/AppState'
import { TIERS } from '../../lib/mockData'

export default function Membership() {
  const navigate = useNavigate()
  const { members, signInAs } = useAppState()
  const [acct, setAcct] = useState(members[0]?.name ?? '')

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    signInAs(acct)
    navigate('/account')
  }

  return (
    <>
      <div className="max-w-[560px] mb-7">
        <h1 className="text-[32px]">Membership</h1>
        <p className="text-ink-soft mt-2.5">
          Three ways to keep a board under your arm. Every tier includes damage coverage and same-day swaps if
          something's not right for the conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-11">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`bg-card rounded-[14px] px-[26px] py-7 flex flex-col ${t.featured ? 'border-2 border-gold' : 'border border-line'}`}
          >
            {t.featured && (
              <span className="text-xs font-semibold text-gold-deep bg-gold/[0.14] px-2.5 py-1 rounded-full inline-block mb-3.5 w-fit">
                Where most members land
              </span>
            )}
            <div className="text-[22px] font-serif">{t.name}</div>
            <div className="font-serif text-[34px] mt-2.5">
              ${t.price}
              <span className="font-sans text-sm text-ink-soft font-medium"> / month</span>
            </div>
            <div className="text-ink-soft text-[13.5px] mt-2 min-h-[34px]">{t.desc}</div>
            <ul className="list-none p-0 my-5 flex flex-col gap-2.5 flex-1">
              {t.perks.map((p) => (
                <li key={p} className="text-[13.5px] pl-5 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[9px] before:h-[9px] before:rounded-[2px] before:bg-kelp">
                  {p}
                </li>
              ))}
            </ul>
            <Btn variant={t.featured ? 'gold' : 'ghost'} onClick={() => navigate('/join')}>
              Join {t.name}
            </Btn>
          </div>
        ))}
      </div>

      <div className="bg-card border border-line rounded-[14px] px-[30px] py-7 max-w-[440px]">
        <h2 className="text-[18px]">Already a member?</h2>
        <p className="text-ink-soft text-[13px] mt-1.5">
          Sign in to manage bookings, update payment, and check your rental history.
        </p>
        <form onSubmit={handleSignIn}>
          <Field label="Account (demo — pick one to preview)">
            <Select value={acct} onChange={(e) => setAcct(e.target.value)}>
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} — {m.tier}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Password">
            <TextInput type="password" placeholder="••••••••" />
          </Field>
          <Btn type="submit" variant="primary" className="mt-4.5">
            Sign in
          </Btn>
        </form>
      </div>
    </>
  )
}
