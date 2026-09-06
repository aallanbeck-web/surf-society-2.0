import { DataTable } from './ui'
import type { RentalHistoryEntry } from '../lib/types'

export default function RentalHistoryTable({ entries }: { entries: RentalHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-ink-soft text-[13.5px]">No rentals on record yet.</p>
  }
  return (
    <DataTable>
      <table>
        <thead>
          <tr>
            {['Board', 'Checked out', 'Returned'].map((h) => (
              <th key={h} className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((r, i) => (
            <tr key={i}>
              <td className="px-4 py-3 border-b border-line text-[13.5px]">{r.board}</td>
              <td className="px-4 py-3 border-b border-line text-[13.5px]">{r.checkedOut}</td>
              <td className="px-4 py-3 border-b border-line text-[13.5px]">{r.returned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTable>
  )
}
