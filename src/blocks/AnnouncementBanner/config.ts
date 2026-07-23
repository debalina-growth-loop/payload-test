import type { Block } from 'payload'

import { link } from '@/fields/link'

export const AnnouncementBanner: Block = {
  slug: 'announcementBanner',
  interfaceName: 'AnnouncementBannerBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    link({ appearances: false }),
  ],
  labels: {
    plural: 'Announcement Banners',
    singular: 'Announcement Banner',
  },
}
