import { useState } from 'react'
import { Btn, TextInput } from './ui'
import type { Note } from '../lib/types'

/** Staff-only notes list + add-note form — reused for both member and board notes. */
export default function NotesPanel({
  notes,
  onAdd,
  placeholder = 'Add a note...',
}: {
  notes: Note[]
  onAdd: (text: string) => void
  placeholder?: string
}) {
  const [text, setText] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <div>
      {notes.length === 0 ? (
        <p className="text-ink-soft text-[13px] mb-3">No staff notes yet.</p>
      ) : (
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mb-3.5">
          {notes.map((n) => (
            <li key={n.id} className="text-[13px] border-b border-line pb-2.5">
              <div>{n.text}</div>
              <div className="text-ink-soft text-[11.5px] mt-1">{n.date}</div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="flex gap-2">
        <TextInput
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <Btn type="submit" variant="ghost">
          Add
        </Btn>
      </form>
    </div>
  )
}
