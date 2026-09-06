export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function fmt(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Parses a board size like `5'10"` or `9'0"` into total inches, for sorting.
 * Returns 0 for anything that doesn't match (keeps sort stable rather than throwing).
 */
export function sizeToInches(size: string): number {
  const match = size.match(/(\d+)'(?:(\d+)")?/)
  if (!match) return 0
  const feet = Number(match[1])
  const inches = Number(match[2] ?? 0)
  return feet * 12 + inches
}
