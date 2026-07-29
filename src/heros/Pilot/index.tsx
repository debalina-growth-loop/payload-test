'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'

// Brand colours (change these to rebrand)
const CORAL = '#FF7A64'
const INK = '#012A36' // dark navy backdrop, shared with the platform hero
const ACID = '#D4F25A' // live/validate green
const PANEL = '#131418' // console panel fill
const HAIR = 'rgba(242,241,237,0.08)'
const HAIR_STRONG = 'rgba(242,241,237,0.16)'
const MUTED = '#8B8A85'
const DIM = '#55554F'

// Tag colour per phase of the dispatch lifecycle
const TONE_COLOR: Record<string, string> = {
  validate: ACID,
  dispatch: '#84B5F2',
  execute: CORAL,
  close: '#E3A5D9',
}

const VISIBLE_LOGS = 11 // how many lines the console shows at once
const LOG_INTERVAL = 3000 // ms between new lines
const LOG_STEP_SECONDS = 3 // clock increment per new line

type LogLine = {
  time: string
  tag: string
  tone: string
  message: string
  value: string
}

/** "17:34:49" -> seconds since midnight (returns null for anything unparseable). */
const parseClock = (t: string): number | null => {
  const m = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(t.trim())
  if (!m) return null
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])
}

const formatClock = (total: number): string => {
  const s = ((total % 86400) + 86400) % 86400
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`
}

/** Splits "handles **200+ decisions** a day" into plain / emphasised runs. */
const emphasise = (text: string): React.ReactNode[] =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-[#F2F1ED]">
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )

/** Randomised drifting dots — generated after mount so SSR and client markup match. */
const Particles: React.FC = () => {
  const [dots, setDots] = useState<React.CSSProperties[]>([])

  useEffect(() => {
    setDots(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    )
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {dots.map((style, i) => (
        <span
          key={i}
          className="absolute size-[2px] rounded-full bg-[rgba(0,212,255,0.5)]"
          style={{ ...style, animationName: 'pilotFloat', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
        />
      ))}
    </div>
  )
}

/**
 * Pilot hero — dark navy with a left-scrolling ticker under the navbar, a moving grid
 * and drifting particles behind, headline + subtitle + CTAs + trust strip on the left,
 * and a self-updating "dispatcher console" log feed on the right.
 *
 * Reuses the shared hero fields (prefix, highlights, subtitle, links) and adds
 * headlineSuffix, tickerItems, trustLabel/trustItems and pilotConsole.
 */
export const PilotHero: React.FC<Page['hero']> = (props) => {
  const {
    prefix,
    highlights,
    headlineSuffix,
    subtitle,
    links,
    tickerItems,
    trustLabel,
    trustItems,
    pilotConsole,
  } = props || {}

  const emphasis = (highlights ?? [])
    .map((h) => h.text)
    .filter(Boolean)
    .join(' ')
  const ticker = (tickerItems ?? []).filter((t) => Boolean(t.text))
  const trust = (trustItems ?? []).map((t) => t.text).filter(Boolean)

  // Authored log lines, normalised and back-filled with a clock where none was typed
  const authored = useMemo<LogLine[]>(() => {
    const rows = (pilotConsole?.logs ?? []).filter((l) => Boolean(l.tag && l.message))
    let clock = parseClock(rows.find((r) => parseClock(r.time ?? '') !== null)?.time ?? '') ?? 62089 // 17:14:49
    return rows.map((l) => {
      clock = parseClock(l.time ?? '') ?? clock + LOG_STEP_SECONDS
      return {
        time: formatClock(clock),
        tag: l.tag as string,
        tone: l.tone ?? 'validate',
        message: l.message as string,
        value: l.value ?? '',
      }
    })
  }, [pilotConsole?.logs])

  // A full console on first paint: cycle the authored lines until every row is filled.
  // Deterministic, so the server and client markup agree.
  const initialFeed = useMemo<LogLine[]>(() => {
    if (authored.length === 0) return []
    const start = parseClock(authored[0]!.time)!
    return Array.from({ length: VISIBLE_LOGS }, (_, i) => ({
      ...authored[i % authored.length]!,
      time: formatClock(start + i * LOG_STEP_SECONDS),
    }))
  }, [authored])

  const [feed, setFeed] = useState<LogLine[]>(initialFeed)

  useEffect(() => {
    setFeed(initialFeed)
    if (authored.length < 2) return

    // Pick up where the seeded rows left off
    let cursor = VISIBLE_LOGS % authored.length
    const timer = setInterval(() => {
      setFeed((prev) => {
        const next = authored[cursor++ % authored.length]!
        const lastClock = parseClock(prev[prev.length - 1]?.time ?? '')
        const time = lastClock === null ? next.time : formatClock(lastClock + LOG_STEP_SECONDS)
        return [...prev, { ...next, time }].slice(-VISIBLE_LOGS)
      })
    }, LOG_INTERVAL)

    return () => clearInterval(timer)
  }, [authored, initialFeed])

  return (
    // -mt-16 cancels the page wrapper's top padding so the hero runs to the very top
    <section className="relative -mt-16 overflow-hidden" style={{ background: INK }}>
      {/* Ticker — starts below the fixed navbar */}
      {ticker.length > 0 && (
        <div
          className="relative z-10 overflow-hidden pt-20"
          style={{ borderBottom: `1px solid ${HAIR}` }}
          aria-hidden="true"
        >
          <div
            className="flex w-max gap-12 whitespace-nowrap py-3 font-mono text-xs"
            style={{ color: MUTED, animation: 'pilotTicker 60s linear infinite' }}
          >
            {/* Duplicated so the loop (translateX -50%) is seamless */}
            {[...ticker, ...ticker].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5"
                style={item.accent ? { color: CORAL } : undefined}
              >
                {item.liveDot && (
                  <i className="size-[5px] shrink-0 rounded-full" style={{ background: ACID }} />
                )}
                {item.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Background layers */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'pilotGrid 20s linear infinite',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 85% 30%, rgba(255,77,28,0.08) 0%, transparent 45%), radial-gradient(circle at 10% 70%, rgba(212,242,90,0.04) 0%, transparent 45%)',
        }}
      />
      <Particles />

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-start gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-[60px] lg:pt-[70px]">
        {/* LEFT: headline, subtitle, CTAs, trust strip */}
        <div>
          {(prefix || emphasis || headlineSuffix) && (
            <h1 className="mb-7 text-[clamp(2.75rem,7vw,5.75rem)] font-normal leading-[0.98] tracking-[-0.035em] text-[#F2F1ED]">
              {prefix}
              {emphasis && (
                <>
                  {prefix ? ' ' : ''}
                  <span className="font-light italic">{emphasis}</span>
                </>
              )}
              {headlineSuffix && (
                <>
                  {/* nbsp keeps the slash on the same line as the word before it */}
                  {' '}
                  <span className="font-light" style={{ color: CORAL }}>
                    /
                  </span>{' '}
                  {headlineSuffix}
                </>
              )}
            </h1>
          )}

          {subtitle && (
            <p className="mb-10 max-w-[540px] text-[19px] leading-[1.55]" style={{ color: MUTED }}>
              {emphasise(subtitle)}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-wrap items-center gap-3.5">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={
                    i === 0
                      ? 'border-2 border-transparent bg-[#FF7A64] px-6 py-[0.55rem] text-[1.05rem] font-bold text-white transition-transform hover:scale-[1.03]'
                      : 'border-2 border-white/80 bg-transparent px-6 py-[0.55rem] text-[1.05rem] font-bold text-white transition-colors hover:bg-white hover:text-[#06222c]'
                  }
                />
              ))}
            </div>
          )}

          {(trustLabel || trust.length > 0) && (
            <div className="mt-16 flex flex-col gap-4 pt-7" style={{ borderTop: `1px solid ${HAIR}` }}>
              {trustLabel && (
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.08em]"
                  style={{ color: MUTED }}
                >
                  {trustLabel}
                </div>
              )}
              {trust.length > 0 && (
                <div className="flex flex-wrap gap-9 text-xl italic text-[#F2F1ED] opacity-85">
                  {trust.map((name, i) => (
                    <span key={i}>{name}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: live dispatcher console */}
        {(pilotConsole?.label || feed.length > 0) && (
          <div
            className="overflow-hidden rounded font-mono text-xs"
            style={{ background: PANEL, border: `1px solid ${HAIR_STRONG}` }}
            aria-label={pilotConsole?.label || 'Live console'}
          >
            <div
              className="flex items-center justify-between gap-4 px-[18px] py-3.5"
              style={{ borderBottom: `1px solid ${HAIR}`, background: 'rgba(0,0,0,0.25)' }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: ACID, animation: 'pilotPulse 1.8s infinite' }}
                  aria-hidden="true"
                />
                {pilotConsole?.label && (
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#F2F1ED]">
                    {pilotConsole.label}
                  </span>
                )}
              </div>
              {pilotConsole?.meta && (
                <span className="whitespace-nowrap text-[11px]" style={{ color: MUTED }}>
                  {pilotConsole.meta}
                </span>
              )}
            </div>

            <div className="flex min-h-[320px] flex-col gap-2.5 px-[18px] py-4 [font-variant-numeric:tabular-nums]">
              {feed.map((log, i) => (
                <div
                  key={`${log.time}-${i}`}
                  className="grid grid-cols-[64px_84px_1fr_auto] items-baseline gap-3 leading-[1.5] sm:grid-cols-[72px_94px_1fr_auto]"
                  style={{ animation: 'pilotLogIn 0.4s both' }}
                >
                  <span className="text-[11px]" style={{ color: DIM }}>
                    {log.time}
                  </span>
                  <span
                    className="text-[11px] font-medium tracking-[0.04em]"
                    style={{ color: TONE_COLOR[log.tone] ?? ACID }}
                  >
                    {log.tag}
                  </span>
                  <span className="text-xs text-[#F2F1ED]">{log.message}</span>
                  <span className="text-[11px]" style={{ color: MUTED }}>
                    {log.value}
                  </span>
                </div>
              ))}
            </div>

            {(pilotConsole?.footerLeft || pilotConsole?.footerRight) && (
              <div
                className="flex justify-between gap-4 px-[18px] py-3 text-[11px]"
                style={{
                  borderTop: `1px solid ${HAIR}`,
                  background: 'rgba(0,0,0,0.2)',
                  color: MUTED,
                }}
              >
                <span>{pilotConsole?.footerLeft}</span>
                <span>{pilotConsole?.footerRight}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pilotTicker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pilotGrid { from { transform: translateY(0) } to { transform: translateY(50px) } }
        @keyframes pilotPulse {
          0% { box-shadow: 0 0 0 0 rgba(212,242,90,0.6) }
          70% { box-shadow: 0 0 0 12px rgba(212,242,90,0) }
          100% { box-shadow: 0 0 0 0 rgba(212,242,90,0) }
        }
        @keyframes pilotLogIn { from { opacity: 0; transform: translateX(-8px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes pilotFloat {
          0% { opacity: 0; transform: translateY(100%) translateX(0) }
          10%, 90% { opacity: 1 }
          100% { opacity: 0; transform: translateY(-100%) translateX(100px) }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pilotTicker"], [style*="pilotGrid"], [style*="pilotFloat"], [style*="pilotPulse"] { animation: none !important }
        }
      `}</style>
    </section>
  )
}
