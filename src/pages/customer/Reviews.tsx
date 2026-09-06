import { Fragment, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Btn, Field, Panel, Select, SectionHead, Textarea } from '../../components/ui'
import { useAppState } from '../../state/AppState'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

function AdSlot() {
  return (
    <div className="border border-dashed border-line-strong rounded-xl p-6.5 text-center text-ink-soft text-[12.5px] bg-paper-dim">
      <b className="block text-[13.5px] text-ink-soft mb-1">Advertisement</b>
      Space reserved for sponsors — wetsuit brands, board shapers, local surf schools.
    </div>
  )
}

export default function Reviews() {
  const { boards, reviews, addReview } = useAppState()
  const [searchParams, setSearchParams] = useSearchParams()

  const boardFilter = searchParams.get('board') ?? 'All'
  const [typeFilter, setTypeFilter] = useState('All')
  const [skillFilter, setSkillFilter] = useState('All')

  const boardNames = useMemo(() => boards.map((b) => b.name), [boards])
  const boardTypes = useMemo(() => Array.from(new Set(boards.map((b) => b.type))).sort(), [boards])

  const setBoardFilter = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'All') next.delete('board')
    else next.set('board', value)
    setSearchParams(next, { replace: true })
  }

  const filtered = reviews.filter(
    (r) =>
      (boardFilter === 'All' || r.board === boardFilter) &&
      (typeFilter === 'All' || r.boardType === typeFilter) &&
      (skillFilter === 'All' || r.skill === skillFilter),
  )

  const hasFilters = boardFilter !== 'All' || typeFilter !== 'All' || skillFilter !== 'All'
  const clearFilters = () => {
    setTypeFilter('All')
    setSkillFilter('All')
    setBoardFilter('All')
  }

  const [showForm, setShowForm] = useState(false)
  const [reviewBoard, setReviewBoard] = useState(boardFilter !== 'All' ? boardFilter : (boards[0]?.name ?? ''))
  const [skill, setSkill] = useState('Beginner')
  const [rating, setRating] = useState('5')
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addReview({ board: reviewBoard, skill, rating: Number(rating), text })
    setText('')
    setShowForm(false)
  }

  return (
    <>
      <SectionHead
        title="Board Reviews"
        action={
          <Btn variant="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : 'Write a review'}
          </Btn>
        }
      />
      <p className="text-ink-soft max-w-[560px] mb-6">
        Reviews from members who've actually ridden the board, tagged with the reviewer's skill level so you can
        weigh advice from someone at your own stage.
      </p>

      <div className="flex gap-3 mb-6 flex-wrap items-end">
        <Field label="Board">
          <Select className="px-2.5 py-1.5 text-[13px]" value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
            <option value="All">All boards</option>
            {boardNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Board type">
          <Select className="px-2.5 py-1.5 text-[13px]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All types</option>
            {boardTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Experience level">
          <Select className="px-2.5 py-1.5 text-[13px]" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="All">All levels</option>
            {SKILL_LEVELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        {hasFilters && (
          <Btn variant="text" onClick={clearFilters}>
            Clear filters
          </Btn>
        )}
      </div>

      {showForm && (
        <Panel>
          <h2 className="text-[16px]">Write a review</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Field label="Board">
                <Select value={reviewBoard} onChange={(e) => setReviewBoard(e.target.value)}>
                  {boardNames.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Your skill level">
                <Select value={skill} onChange={(e) => setSkill(e.target.value)}>
                  {SKILL_LEVELS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Rating">
                <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">5 — loved it</option>
                  <option value="4">4 — good</option>
                  <option value="3">3 — fine</option>
                  <option value="2">2 — not for me</option>
                  <option value="1">1 — avoid</option>
                </Select>
              </Field>
            </div>
            <Field label="Review">
              <Textarea
                rows={3}
                required
                placeholder="How did it paddle, turn, hold up in chop?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Field>
            <div className="flex gap-2.5 mt-5">
              <Btn type="submit" variant="primary">
                Post review
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      {filtered.length === 0 ? (
        <p className="text-ink-soft text-[13.5px]">No reviews match these filters yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((r, i) => (
            <Fragment key={r.id}>
              <div className="bg-card border border-line rounded-xl px-5 py-4.5">
                <div className="flex justify-between flex-wrap gap-1.5">
                  <div>
                    <div className="font-semibold text-[14.5px]">{r.board}</div>
                    <div className="text-[12.5px] text-ink-soft mt-0.5">
                      {r.boardType} · reviewed by {r.reviewer} · {r.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold-deep tracking-wide">{stars(r.rating)}</div>
                    <span className="text-[11.5px] font-semibold px-2.5 py-[3px] rounded-full bg-paper-dim text-ink-soft">
                      {r.skill}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 text-[13.5px]">{r.text}</div>
              </div>
              {i === 0 && <AdSlot />}
            </Fragment>
          ))}
          <AdSlot />
        </div>
      )}
    </>
  )
}
