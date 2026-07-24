import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const TextVideo: Block = {
  slug: 'textVideo',
  interfaceName: 'TextVideoBlock',
  labels: {
    singular: 'Text + Video',
    plural: 'Text + Video',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      appearances: false,
      overrides: { maxRows: 1 },
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'videoEmbedUrl',
          type: 'text',
          label: 'Video embed URL',
          admin: {
            width: '50%',
            description: 'Paste a YouTube / Wistia / Vimeo embed URL (used if no file uploaded).',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Or upload a video file',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: 'lightBlue',
      options: [
        { label: 'Light Blue', value: 'lightBlue' },
        { label: 'White', value: 'white' },
      ],
    },
  ],
}
