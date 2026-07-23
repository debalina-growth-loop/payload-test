import type { Block } from 'payload'

export const TrustBadges: Block = {
  slug: 'trustBadges',
  interfaceName: 'TrustBadgesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Trusted and highly rated on',
    },
    {
      name: 'badges',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link (optional)',
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    plural: 'Trust Badges',
    singular: 'Trust Badges',
  },
}
