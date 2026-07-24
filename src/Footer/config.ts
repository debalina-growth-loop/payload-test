import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

// Recursively remove `required` so a link group becomes optional
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeOptional = (field: any) => {
  if (field && typeof field === 'object') {
    if ('required' in field) delete field.required
    if (Array.isArray(field.fields)) field.fields.forEach(makeOptional)
  }
  return field
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background color',
      defaultValue: 'navy',
      options: [
        { label: 'Dark Navy', value: 'navy' },
        { label: 'Deep Teal', value: 'teal' },
        { label: 'Charcoal Black', value: 'black' },
        { label: 'Midnight Blue', value: 'blue' },
        { label: 'Plum', value: 'plum' },
      ],
      admin: { description: 'Footer uses light text, so pick a dark shade.' },
    },
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Logo image (white)' },
        { name: 'text', type: 'text', label: 'Brand text (fallback)' },
      ],
    },
    makeOptional(
      link({
        appearances: false,
        overrides: { name: 'ctaLink', label: "CTA button (e.g. Let's Talk)" },
      }),
    ),
    {
      name: 'columns',
      type: 'array',
      label: 'Link columns',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'subscribe',
      type: 'group',
      label: 'Subscribe box',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Subscribe for updates' },
        { name: 'placeholder', type: 'text', defaultValue: 'Work Mail*' },
        {
          name: 'consentText',
          type: 'text',
          defaultValue: 'By filling this form, you agree to our',
        },
        makeOptional(
          link({
            appearances: false,
            overrides: { name: 'privacyLink', label: 'Privacy Policy link' },
          }),
        ),
        { name: 'buttonLabel', type: 'text', defaultValue: 'Subscribe Now' },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal links',
      admin: { initCollapsed: true },
      fields: [link({ appearances: false })],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social URLs',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'linkedin', type: 'text', admin: { width: '50%' } },
            { name: 'twitter', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'facebook', type: 'text', admin: { width: '50%' } },
            { name: 'youtube', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: 'Copyright 2026 by FarEye',
          admin: { width: '50%' },
        },
        {
          name: 'rightsText',
          type: 'text',
          defaultValue: 'All rights reserved.',
          admin: { width: '50%' },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
