import { useEffect, useRef, useState } from 'react'
import { SLIDES } from '../lib/mockData'
import { svgBoard } from '../lib/svgBoard'

export default function Slideshow() {
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mb-12">
      <div className="flex justify-between items-baseline mb-3.5">
        <h2 className="text-[18px]">From the quiver</h2>
        <span className="text-[12.5px] text-ink-soft">Newest &amp; most popular boards</span>
      </div>
      <div className="relative rounded-2xl overflow-hidden aspect-[21/8] bg-ink-soft">
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-[600ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s) => (
            <div key={s.name} className="flex-none w-full relative">
              <img src={svgBoard(s.tint)} alt={s.name} className="w-full h-full object-cover block" />
              <div className="absolute inset-x-0 bottom-0 px-[22px] py-[18px] bg-gradient-to-t from-ink/85 to-transparent text-white">
                <div className="text-[11.5px] font-semibold text-gold">{s.tag}</div>
                <div className="font-serif text-[19px] mt-0.5">{s.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-3.5 right-4.5 flex gap-1.5">
          {SLIDES.map((s, i) => (
            <span key={s.name} className={`w-[7px] h-[7px] rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
