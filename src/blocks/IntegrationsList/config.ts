import type { Block } from 'payload'

export const IntegrationsList: Block = {
  slug: 'integrationsList',
  interfaceName: 'IntegrationsListBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Integrations',
    },
    {
      name: 'integrations',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    plural: 'Integrations Lists',
    singular: 'Integrations List',
  },
}
