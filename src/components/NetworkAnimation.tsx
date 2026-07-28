import React from 'react'

// Decorative constellation that slowly drifts top↔bottom. Safe in both server and
// client components (no hooks). Sits on the right by default; pass side="left" to
// mirror it to the left edge.
const NETWORK_NODES: Array<[number, number, 'w' | 'c']> = [
  [540, 60, 'c'], [420, 140, 'w'], [560, 240, 'w'], [300, 90, 'w'],
  [470, 320, 'w'], [360, 260, 'w'], [250, 200, 'w'], [580, 420, 'c'],
  [430, 470, 'w'], [330, 430, 'w'], [520, 560, 'w'], [400, 640, 'c'],
  [300, 600, 'w'], [560, 720, 'w'],
]
const NETWORK_EDGES: Array<[number, number]> = [
  [2, 1], [1, 0], [0, 2], [1, 2], [1, 3], [5, 6], [5, 4], [4, 2],
  [4, 7], [4, 8], [8, 9], [8, 7], [7, 10], [8, 10], [10, 13], [10, 11],
  [11, 12], [11, 13], [9, 12],
]

export const NetworkAnimation: React.FC<{
  side?: 'left' | 'right'
  className?: string
}> = ({ side = 'right', className }) => {
  const pos =
    side === 'left' ? 'left-0 -scale-x-100' : 'right-0'
  return (
    <div
      className={`net-drift pointer-events-none absolute top-[-15%] z-0 h-[130%] w-[60%] opacity-70 ${pos} ${
        className ?? ''
      }`}
    >
      <style>{`@keyframes netDrift{0%{transform:translateY(0)}50%{transform:translateY(-7%)}100%{transform:translateY(0)}}.net-drift{animation:netDrift 16s ease-in-out infinite;will-change:transform}`}</style>
      <svg
        viewBox="0 0 600 800"
        preserveAspectRatio="xMaxYMin slice"
        className="h-full w-full"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="rgba(255,255,255,0.16)" strokeWidth="1">
          {NETWORK_EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={NETWORK_NODES[a][0]}
              y1={NETWORK_NODES[a][1]}
              x2={NETWORK_NODES[b][0]}
              y2={NETWORK_NODES[b][1]}
            />
          ))}
        </g>
        <g>
          {NETWORK_NODES.map(([x, y, kind], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={kind === 'c' ? 1 : 0.5}
              fill={kind === 'c' ? '#FF7A64' : 'rgba(255,255,255,0.75)'}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
