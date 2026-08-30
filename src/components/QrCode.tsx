import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

/**
 * Generates a QR code client-side with the `qrcode` package instead of
 * calling a third-party image API (api.qrserver.com in the old prototype).
 */
export default function QrCode({ data, size = 170 }: { data: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(data, { width: size, margin: 1, color: { dark: '#0E2A32', light: '#FFFFFF' } }).then((url) => {
      if (!cancelled) setSrc(url)
    })
    return () => {
      cancelled = true
    }
  }, [data, size])

  if (!src) {
    return <div className="w-[170px] h-[170px] rounded-lg bg-paper-dim mx-auto" />
  }
  return <img src={src} alt="QR code to join" width={size} height={size} className="rounded-lg mx-auto" />
}
