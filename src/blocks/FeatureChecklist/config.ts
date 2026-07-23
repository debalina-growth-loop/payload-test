import type { Block } from 'payload'

export const FeatureChecklist: Block = {
  slug: 'featureChecklist',
  interfaceName: 'FeatureChecklistBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    plural: 'Feature Checklists',
    singular: 'Feature Checklist',
  },
}
