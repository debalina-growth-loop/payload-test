import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Marketing (left text + right image)',
          value: 'marketing',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    // ---- Marketing hero fields (only show when type = marketing) ----
    {
      name: 'prefix',
      type: 'text',
      label: 'Headline prefix (static first line, e.g. "How to")',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Rotating highlights (the coloured line that cycles)',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
      label: 'Right‑side image',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Background lines image (optional)',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },

    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
