import type { Block } from 'payload'

// A page-level "chrome" block: adding it opts this page out of the automatic
// global header and lets it pick a visual style instead. It always renders at
// the very top of the page (above the hero), regardless of where it sits in
// the blocks list — see extractChromeBlocks.
export const HeaderBlock: Block = {
  slug: 'headerBlock',
  interfaceName: 'HeaderBlock',
  labels: {
    singular: 'Header',
    plural: 'Headers',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Style',
      defaultValue: 'default',
      admin: {
        description:
          'Always renders at the very top of the page, above the hero, no matter where you place this block in the list. Adding it replaces the default header for this page.',
      },
      options: [
        { label: 'Default (solid)', value: 'default' },
        { label: 'Glass (frosted, transparent)', value: 'glass' },
      ],
    },
  ],
}
