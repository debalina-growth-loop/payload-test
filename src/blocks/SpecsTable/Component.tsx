import React from 'react'

import type { SpecsTableBlock as SpecsTableBlockProps } from '@/payload-types'

export const SpecsTableBlock: React.FC<SpecsTableBlockProps> = ({ heading, specs }) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-6">{heading}</h2>}
      {Array.isArray(specs) && specs.length > 0 && (
        <dl className="grid gap-4 md:grid-cols-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex justify-between border-b border-border py-2">
              <dt className="font-medium">{spec.label}</dt>
              <dd className="text-muted-foreground">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
