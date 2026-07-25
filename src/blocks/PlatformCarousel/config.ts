import type { Block } from 'payload'

const isStats = (_: unknown, s: { type?: string } | undefined) => s?.type === 'stats'
const isTestimonial = (_: unknown, s: { type?: string } | undefined) => s?.type === 'testimonial'
const isLogos = (_: unknown, s: { type?: string } | undefined) => s?.type === 'logos'
const isStatsOrLogos = (_: unknown, s: { type?: string } | undefined) =>
  s?.type === 'stats' || s?.type === 'logos'
const isImageOrTestimonial = (_: unknown, s: { type?: string } | undefined) =>
  s?.type === 'testimonial' || s?.type === 'image'

export const PlatformCarousel: Block = {
  slug: 'platformCarousel',
  interfaceName: 'PlatformCarouselBlock',
  labels: {
    singular: 'Platform Carousel',
    plural: 'Platform Carousels',
  },
  fields: [
    {
      name: 'autoplaySeconds',
      type: 'number',
      label: 'Autoplay interval in seconds (0 = no autoplay)',
      defaultValue: 4,
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      labels: { singular: 'Slide', plural: 'Slides' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Slide type',
          defaultValue: 'testimonial',
          required: true,
          options: [
            { label: 'Stats (heading + CTA + numbers)', value: 'stats' },
            { label: 'Testimonial (image + quote + metric)', value: 'testimonial' },
            { label: 'Logo grid (heading + background + logo cards)', value: 'logos' },
            { label: 'Full image (single pre-composed image)', value: 'image' },
          ],
        },
        {
          name: 'indicatorLogo',
          type: 'upload',
          relationTo: 'media',
          label: 'Indicator logo (shown in the coral bar; optional — a dot is used if empty)',
        },

        // ---- Stats slide ----
        { name: 'heading', type: 'text', label: 'Heading', admin: { condition: isStats } },
        { name: 'body', type: 'textarea', label: 'Body', admin: { condition: isStats } },
        {
          name: 'subheading',
          type: 'text',
          label: 'Bold sub-line (e.g. "Transform your delivery experience today.")',
          admin: { condition: isStats },
        },
        {
          type: 'row',
          admin: { condition: isStats },
          fields: [
            { name: 'ctaLabel', type: 'text', label: 'CTA label', admin: { width: '40%' } },
            { name: 'ctaUrl', type: 'text', label: 'CTA URL', admin: { width: '60%' } },
          ],
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background image',
          admin: { condition: isStatsOrLogos },
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Stat numbers',
          labels: { singular: 'Stat', plural: 'Stats' },
          admin: { condition: isStats, initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '40%', placeholder: '1.5Bn' } },
                { name: 'label', type: 'text', required: true, admin: { width: '60%', placeholder: 'Deliveries' } },
              ],
            },
          ],
        },

        // ---- Logo grid slide ----
        {
          name: 'gridHeading',
          type: 'text',
          label: 'Grid heading (e.g. "First Choice for Last Mile for")',
          admin: { condition: isLogos },
        },
        {
          name: 'gridHighlight',
          type: 'text',
          label: 'Highlighted part of heading (coral, e.g. "150+ brands")',
          admin: { condition: isLogos },
        },
        {
          name: 'logos',
          type: 'array',
          label: 'Logo cards',
          labels: { singular: 'Logo', plural: 'Logos' },
          admin: { condition: isLogos, initCollapsed: true },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },

        // ---- Testimonial / Image slide ----
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image (person/testimonial, or the full logo-grid image)',
          admin: { condition: isImageOrTestimonial },
        },
        { name: 'company', type: 'text', label: 'Company name', admin: { condition: isTestimonial } },
        { name: 'quote', type: 'textarea', label: 'Quote', admin: { condition: isTestimonial } },
        {
          type: 'row',
          admin: { condition: isTestimonial },
          fields: [
            { name: 'authorName', type: 'text', label: 'Author name', admin: { width: '50%' } },
            { name: 'authorTitle', type: 'text', label: 'Author title', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          admin: { condition: isTestimonial },
          fields: [
            { name: 'metricValue', type: 'text', label: 'Metric value', admin: { width: '30%', placeholder: '8.6%' } },
            {
              name: 'metricLabel',
              type: 'text',
              label: 'Metric label',
              admin: { width: '70%', placeholder: 'Sales growth with AI-powered routing' },
            },
          ],
        },
      ],
    },
  ],
}
