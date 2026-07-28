import type { Block } from 'payload'

export const UpdatesCards: Block = {
  slug: 'updatesCards',
  interfaceName: 'UpdatesCardsBlock',
  labels: {
    singular: 'Updates Cards',
    plural: 'Updates Cards',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section heading',
      defaultValue: 'Latest Updates',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Preview image',
        },
        {
          name: 'overlayLines',
          type: 'array',
          label: 'Overlay text on image (optional)',
          labels: { singular: 'Line', plural: 'Lines' },
          admin: {
            initCollapsed: true,
            description: 'When present the image is dimmed. Tick "Coral" to colour a line.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'text', type: 'text', required: true, admin: { width: '70%' } },
                { name: 'highlight', type: 'checkbox', label: 'Coral', admin: { width: '30%' } },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'badgeType',
              type: 'text',
              label: 'Left badge',
              defaultValue: 'Case study',
              admin: { width: '50%' },
            },
            {
              name: 'badgeCategory',
              type: 'text',
              label: 'Right badge',
              admin: { width: '50%', placeholder: 'e.g. Grocery' },
            },
          ],
        },
        { name: 'title', type: 'textarea', label: 'Card title' },
        {
          name: 'action',
          type: 'select',
          label: 'Action',
          defaultValue: 'download',
          options: [
            { label: 'Download (link to a URL)', value: 'download' },
            { label: 'Watch (play video in a modal)', value: 'watch' },
          ],
        },
        {
          name: 'actionLabel',
          type: 'text',
          admin: { description: 'Optional. Defaults to "Download" / "Watch".' },
        },
        {
          name: 'downloadUrl',
          type: 'text',
          label: 'Download / link URL',
          admin: { condition: (_, s) => s?.action !== 'watch' },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Video embed URL',
          admin: {
            condition: (_, s) => s?.action === 'watch',
            description: 'YouTube / Wistia / Vimeo embed URL.',
          },
        },
      ],
    },
  ],
}
