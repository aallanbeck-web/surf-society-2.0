import { useState } from 'react'
import { Btn, DataTable, Field, Panel, Pill, Select, StatCard, StatStrip, SectionHead, TextInput } from '../../components/ui'
import { useAppState } from '../../state/AppState'
import { svgBoard } from '../../lib/svgBoard'

export default function Inventory() {
  const { boards, addBoard } = useAppState()
  const [showAddBoard, setShowAddBoard] = useState(false)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [type, setType] = useState('Shortboard')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('Excellent')
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null)

  const checkedOut = boards.filter((b) => b.status === 'out').length
  const boardTypes = new Set(boards.map((b) => b.type)).size

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !brand || !size) return
    addBoard({ name, brand, type, size, condition, photo: pendingPhoto })
    setName('')
    setBrand('')
    setSize('')
    setPendingPhoto(null)
    setShowAddBoard(false)
  }

  return (
    <>
      <SectionHead
        title="Inventory"
        action={
          <Btn
            variant="primary"
            onClick={() => {
              setShowAddBoard((v) => !v)
              setPendingPhoto(null)
            }}
          >
            {showAddBoard ? 'Cancel' : '+ Add board'}
          </Btn>
        }
      />
      <StatStrip>
        <StatCard value={boards.length} label="total boards" />
        <StatCard value={checkedOut} label="checked out now" />
        <StatCard value={boards.length - checkedOut} label="available now" />
        <StatCard value={boardTypes} label="board types" />
      </StatStrip>

      {showAddBoard && (
        <Panel>
          <h2 className="text-[16px]">Add a board</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Field label="Board name">
                <TextInput required placeholder="e.g. Green Room" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Brand">
                <TextInput required placeholder="e.g. Album" value={brand} onChange={(e) => setBrand(e.target.value)} />
              </Field>
              <Field label="Type">
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Shortboard</option>
                  <option>Midlength</option>
                  <option>Longboard</option>
                  <option>Fish</option>
                  <option>Soft-top</option>
                </Select>
              </Field>
              <Field label="Size">
                <TextInput required placeholder='e.g. 6&apos;2"' value={size} onChange={(e) => setSize(e.target.value)} />
              </Field>
              <Field label="Condition">
                <Select value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </Select>
              </Field>
            </div>
            <Field label="Photo">
              <div className="border border-dashed border-line-strong rounded-[10px] p-4 flex items-center gap-3.5">
                <div className="w-16 h-12 rounded-md bg-paper-dim flex-shrink-0 flex items-center justify-center overflow-hidden text-[11px] text-ink-soft">
                  {pendingPhoto ? <img src={pendingPhoto} className="w-full h-full object-cover" /> : 'No photo'}
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
              </div>
            </Field>
            <div className="flex gap-2.5 mt-5">
              <Btn type="submit" variant="primary">
                Save board
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      <DataTable>
        <table>
          <thead>
            <tr>
              {['', 'Name', 'Brand', 'Type', 'Size', 'Condition', 'Status'].map((h) => (
                <th key={h} className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boards.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 border-b border-line last:border-0">
                  <img src={b.photo || svgBoard(b.tint)} className="w-10 h-8 object-cover rounded" />
                </td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{b.name}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{b.brand}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{b.type}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{b.size}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{b.condition}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">
                  <Pill variant={b.status === 'available' ? 'available' : 'out'}>
                    {b.status === 'available' ? 'Available' : 'Checked out'}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  )
}
