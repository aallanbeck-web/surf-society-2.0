/**
 * Placeholder board artwork used until real photos are uploaded.
 * Renders a simple tinted surfboard silhouette as a data: URI — same
 * technique as the original prototype, so no image assets are needed.
 */
export function svgBoard(fill: string): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'>
    <rect width='200' height='150' fill='${fill}'/>
    <ellipse cx='100' cy='75' rx='26' ry='62' fill='rgba(255,255,255,0.85)' transform='rotate(20 100 75)'/>
    <line x1='100' y1='20' x2='100' y2='130' stroke='rgba(14,42,50,0.25)' stroke-width='2' transform='rotate(20 100 75)'/>
  </svg>
`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
