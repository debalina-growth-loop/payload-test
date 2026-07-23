import React from 'react'

import type { IntegrationsListBlock as IntegrationsListBlockProps } from '@/payload-types'

export const IntegrationsListBlock: React.FC<IntegrationsListBlockProps> = ({
  heading,
  integrations,
}) => {
  return (
    <div className="container">
      {heading && <h2 className="mb-6">{heading}</h2>}
      {Array.isArray(integrations) && integrations.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration, i) => (
            <div key={i}>
              <h4 className="mb-1">{integration.name}</h4>
              {integration.description && (
                <p className="text-muted-foreground">{integration.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
