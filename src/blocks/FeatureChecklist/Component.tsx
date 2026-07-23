import React from 'react'
import { CheckCircle } from 'lucide-react'

import type { FeatureChecklistBlock as FeatureChecklistBlockProps } from '@/payload-types'

export const FeatureChecklistBlock: React.FC<FeatureChecklistBlockProps> = ({
  heading,
  items,
}) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-6">{heading}</h2>}
      {Array.isArray(items) && items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle className="text-primary shrink-0" size={20} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
