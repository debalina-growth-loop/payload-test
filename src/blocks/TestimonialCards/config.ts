import type { Block } from 'payload'

export const TestimonialCards: Block = {
  slug: 'testimonialCards',
  interfaceName: 'TestimonialCardsBlock',
  labels: {
    singular: 'Testimonial Cards',
    plural: 'Testimonial Cards',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section heading (optional)',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Section subheading (optional)',
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
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Company logo',
        },
        {
          name: 'quote',
          type: 'textarea',
          label: 'Quote',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author / title (optional)',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'metricValue',
              type: 'text',
              label: 'Metric value',
              admin: { width: '40%', placeholder: 'e.g. 8.6%' },
            },
            {
              name: 'metricLabel',
              type: 'text',
              label: 'Metric label',
              admin: { width: '60%', placeholder: 'e.g. Sales growth with AI-powered routing' },
            },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Read story URL (optional)',
        },
      ],
    },
  ],
}
