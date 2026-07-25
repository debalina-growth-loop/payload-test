'use client'

import React, { useEffect, useRef } from 'react'

/**
 * Simple, sparse constellation that drifts top → bottom. Transparent canvas (draws
 * only faint lines + dots over the hero gradient — no baked background, so no box or
 * colour tint). Kept to a handful of nodes with long connecting lines, biased to the
 * left so it sits behind the text, not the right-side illustration.
 * Honours prefers-reduced-motion.
 */
export const NetworkBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0

    const BAND = 0.62 // keep nodes within the left ~62% of the hero

    type Node = { x: number; y: number; vx: number; vy: number; r: number }
    let nodes: Node[] = []

    const build = () => {
      const parent = canvas.parentElement
      width = parent?.clientWidth || window.innerWidth
      height = parent?.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = 12 // sparse / simple
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width * BAND,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: Math.random() * 0.25 + 0.12, // gentle downward drift
        r: Math.random() * 1.2 + 0.9,
      }))
    }

    const MAX_DIST = 300 // long lines → sparse triangulated look

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width * BAND) n.vx *= -1
        if (n.y > height + 20) {
          n.y = -20
          n.x = Math.random() * width * BAND
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12
            ctx.strokeStyle = `rgba(203,213,225,${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = 'rgba(226,232,240,0.5)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    build()
    draw()

    const onResize = () => {
      build()
      if (reduced) draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
