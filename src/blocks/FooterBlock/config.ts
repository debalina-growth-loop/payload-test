import type { Block } from 'payload'

// A page-level "chrome" block: adding it opts this page out of the automatic
// global footer and lets it pick a visual style instead. It always renders at
// the very bottom of the page, regardless of where it sits in the blocks list
// — see extractChromeBlocks.
export const FooterBlock: Block = {
  slug: 'footerBlock',
  interfaceName: 'FooterBlock',
  labels: {
    singular: 'Footer',
    plural: 'Footers',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Style',
      defaultValue: 'default',
      admin: {
        description:
          'Always renders at the very bottom of the page, no matter where you place this block in the list. Adding it replaces the default footer for this page.',
      },
      options: [
        { label: 'Default (solid)', value: 'default' },
        { label: 'Glass (frosted, transparent)', value: 'glass' },
      ],
    },
  ],
}
