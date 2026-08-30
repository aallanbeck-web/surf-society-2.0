import type { ReactNode } from 'react'

type PillVariant = 'active' | 'inactive' | 'available' | 'out' | 'current' | 'past_due'

const PILL_STYLES: Record<PillVariant, string> = {
  active: 'bg-kelp/[0.14] text-kelp-deep',
  available: 'bg-kelp/[0.14] text-kelp-deep',
  current: 'bg-kelp/[0.14] text-kelp-deep',
  inactive: 'bg-rust/[0.12] text-rust',
  past_due: 'bg-rust/[0.12] text-rust',
  out: 'bg-gold/[0.18] text-gold-deep',
}

export function Pill({ variant, children }: { variant: PillVariant; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-[3px] rounded-full ${PILL_STYLES[variant]}`}>
      {children}
    </span>
  )
}

export function SectionHead({ title, size = 'lg', action }: { title: string; size?: 'lg' | 'sm'; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2.5 flex-wrap mb-5">
      <h1 className={size === 'lg' ? 'text-[26px]' : 'text-[18px]'}>{title}</h1>
      {action}
    </div>
  )
}

export function StatCard({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="bg-card border border-line rounded-xl px-5 py-[18px]">
      <div className="font-serif text-[26px]">{value}</div>
      <div className="text-[12.5px] text-ink-soft mt-0.5">{label}</div>
    </div>
  )
}

export function StatStrip({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">{children}</div>
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card border border-line rounded-xl p-6 mb-7 ${className}`}>{children}</div>
}

export function Banner({ tone, children }: { tone: 'good' | 'bad'; children: ReactNode }) {
  const toneClass = tone === 'good' ? 'bg-kelp/[0.12] text-kelp-deep' : 'bg-rust/10 text-rust'
  return <div className={`rounded-[10px] px-[18px] py-3.5 text-[13.5px] font-medium mb-5 flex items-center gap-2.5 ${toneClass}`}>{children}</div>
}

export function DataTable({ children }: { children: ReactNode }) {
  return <div className="bg-card border border-line rounded-xl overflow-hidden overflow-x-auto">{children}</div>
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 mt-3.5">
      <label className="text-[12.5px] font-semibold text-ink-soft">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'px-3 py-2.5 border border-line-strong rounded-lg bg-paper focus:outline focus:outline-2 focus:outline-kelp focus:outline-offset-1'

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

type BtnVariant = 'primary' | 'gold' | 'ghost' | 'text'

const BTN_STYLES: Record<BtnVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-soft',
  gold: 'bg-gold text-ink hover:bg-gold-deep hover:text-paper',
  ghost: 'bg-transparent text-ink border border-line-strong hover:bg-paper',
  text: 'bg-transparent text-ink font-semibold underline underline-offset-[3px] p-0',
}

export function Btn({
  variant = 'primary',
  className = '',
  ...props
}: { variant?: BtnVariant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    variant === 'text'
      ? 'text-[14.5px]'
      : 'border-none px-[22px] py-3 rounded-lg font-semibold text-[14.5px] inline-flex items-center gap-2 w-fit'
  return <button {...props} className={`${base} ${BTN_STYLES[variant]} ${className}`} />
}

export function MiniBtn({
  tone = 'default',
  className = '',
  ...props
}: { tone?: 'default' | 'checkout' | 'checkin' | 'warn' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const toneClass =
    tone === 'checkout'
      ? 'bg-ink text-paper border-ink'
      : tone === 'checkin'
        ? 'bg-kelp text-white border-kelp'
        : tone === 'warn'
          ? 'bg-rust text-white border-rust'
          : 'bg-paper text-ink border-line-strong'
  return (
    <button
      {...props}
      className={`border px-3 py-1.5 rounded-md text-[12.5px] font-semibold ${toneClass} ${className}`}
    />
  )
}
