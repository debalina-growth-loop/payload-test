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
          label: 'Platform (dark, left text + right AI graphic)',
          value: 'platform',
        },
        {
          label: 'Pilot (dark, ticker + left text + live console)',
          value: 'pilot',
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
        {
          label: 'Video Background (left text, bottom CTAs)',
          value: 'video',
        },
      ],
      required: true,
    },
    // ---- Marketing hero fields (only show when type = marketing) ----
    {
      name: 'prefix',
      type: 'text',
      label: 'Headline prefix (static first line, e.g. "How to")',
      admin: { condition: (_, { type } = {}) => ['marketing', 'platform', 'pilot'].includes(type) },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Rotating highlights (the coloured line that cycles)',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      admin: { condition: (_, { type } = {}) => ['marketing', 'platform', 'pilot'].includes(type) },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      admin: {
        condition: (_, { type } = {}) => ['marketing', 'platform', 'pilot'].includes(type),
        description: 'Wrap words in **double asterisks** to emphasise them (Pilot hero only).',
      },
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
      label: 'Right‑side image',
      admin: { condition: (_, { type } = {}) => ['marketing', 'platform'].includes(type) },
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Background lines image (optional)',
      admin: { condition: (_, { type } = {}) => ['marketing', 'platform'].includes(type) },
    },

    // ---- Pilot hero fields (only show when type = pilot) ----
    {
      name: 'headlineSuffix',
      type: 'text',
      label: 'Headline suffix (after the coral slash, e.g. "that runs the last mile.")',
      admin: { condition: (_, { type } = {}) => type === 'pilot' },
    },
    {
      name: 'tickerItems',
      type: 'array',
      label: 'Ticker items (the strip scrolling left under the navbar)',
      labels: { singular: 'Ticker item', plural: 'Ticker items' },
      admin: {
        condition: (_, { type } = {}) => type === 'pilot',
        initCollapsed: true,
        description: 'The strip loops seamlessly — you only need to enter each item once.',
      },
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'accent',
              type: 'checkbox',
              label: 'Coral text',
              defaultValue: false,
              admin: { width: '50%' },
            },
            {
              name: 'liveDot',
              type: 'checkbox',
              label: 'Show pulsing dot before the text',
              defaultValue: false,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'trustLabel',
      type: 'text',
      label: 'Trust strip label (e.g. "Powering dispatch at")',
      admin: { condition: (_, { type } = {}) => type === 'pilot' },
    },
    {
      name: 'trustItems',
      type: 'array',
      label: 'Trust strip names',
      labels: { singular: 'Name', plural: 'Names' },
      admin: { condition: (_, { type } = {}) => type === 'pilot', initCollapsed: true },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'pilotConsole',
      type: 'group',
      label: 'Live console (right side)',
      admin: { condition: (_, { type } = {}) => type === 'pilot' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Console title',
              defaultValue: 'Pilot · dispatcher console',
              admin: { width: '50%' },
            },
            {
              name: 'meta',
              type: 'text',
              label: 'Console meta (top right)',
              defaultValue: 'hub sfo-03 · 06:14 PT',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'footerLeft',
              type: 'text',
              label: 'Footer (left)',
              defaultValue: '11 agents online',
              admin: { width: '50%' },
            },
            {
              name: 'footerRight',
              type: 'text',
              label: 'Footer (right)',
              defaultValue: 'latency 180ms · governance: on',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'logs',
          type: 'array',
          label: 'Log lines',
          labels: { singular: 'Log line', plural: 'Log lines' },
          admin: {
            initCollapsed: true,
            description: 'These cycle through the console as a live feed, oldest scrolling off.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'time',
                  type: 'text',
                  label: 'Time (HH:MM:SS)',
                  admin: { width: '25%', placeholder: '17:34:49' },
                },
                { name: 'tag', type: 'text', label: 'Tag', required: true, admin: { width: '25%' } },
                {
                  name: 'tone',
                  type: 'select',
                  label: 'Tag colour',
                  defaultValue: 'validate',
                  admin: { width: '25%' },
                  options: [
                    { label: 'Validate (acid)', value: 'validate' },
                    { label: 'Dispatch (blue)', value: 'dispatch' },
                    { label: 'Execute (coral)', value: 'execute' },
                    { label: 'Close (pink)', value: 'close' },
                  ],
                },
                { name: 'value', type: 'text', label: 'Right value', admin: { width: '25%' } },
              ],
            },
            { name: 'message', type: 'text', label: 'Message', required: true },
          ],
        },
      ],
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
    {
      name: 'backgroundVideo',
      type: 'upload',
      label: 'Background video',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
        description: 'Autoplaying, muted, looping background video for the hero.',
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
