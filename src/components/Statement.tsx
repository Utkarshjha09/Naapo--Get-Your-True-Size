import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'

type Part = { text: string; accent?: boolean }

/**
 * Statement lights up: the words rest at half ink (still readable) and turn to ink one by one as
 * they cross the middle of the screen; the accent words turn oxblood. Scrubbed to the scrollbar,
 * so it runs back on the way up. Under reduced motion it is simply ink.
 */
export function Statement({ parts, label }: { parts: Part[]; label: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.45'] })

  const words = parts.flatMap((p) => p.text.split(' ').map((w) => ({ w, accent: !!p.accent })))

  return (
    <section aria-label={label} className="border-t border-line">
      <div className="mx-auto flex min-h-[80svh] max-w-[1240px] 2xl:max-w-[1400px] items-center px-5 py-24 md:px-8">
        <p
          ref={ref}
          className="max-w-[1050px] font-display text-[38px] leading-[1.08] tracking-[-0.01em] sm:text-[52px] lg:text-[68px]"
        >
          {words.map(({ w, accent }, i) =>
            reduce ? (
              <span key={i} className={accent ? 'text-oxblood' : ''}>
                {w}{' '}
              </span>
            ) : (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent}>
                {w}
              </Word>
            ),
          )}
        </p>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  accent: boolean
}) {
  // rest: #857d70 reads about 4:1 on the paper ground
  const color = useTransform(progress, range, ['#857d70', accent ? '#7b2d22' : '#1b1916'])
  return (
    <>
      <m.span style={{ color }}>{children}</m.span>{' '}
    </>
  )
}
