import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { BreadcrumbBlock } from '../../blocks/Breadcrumb/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FooterBlock } from '../../blocks/FooterBlock/config'
import { HeaderBlock } from '../../blocks/HeaderBlock/config'
import { HeroSectionBlock } from '../../blocks/HeroSection/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { FeatureChecklist } from '../../blocks/FeatureChecklist/config'
import { TrustBadges } from '../../blocks/TrustBadges/config'
import { SpecsTable } from '../../blocks/SpecsTable/config'
import { IntegrationsList } from '../../blocks/IntegrationsList/config'
import { AnnouncementBanner } from '../../blocks/AnnouncementBanner/config'
import { SectionHeading } from '../../blocks/SectionHeading/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Used to generate the URL slug and shown in the admin list — not displayed on the page itself. Build the visible page from the blocks below.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              admin: {
                initCollapsed: true,
              },
              blocks: [
                HeaderBlock,
                FooterBlock,
                BreadcrumbBlock,
                HeroSectionBlock,
                AnnouncementBanner,
                SectionHeading,
                FeatureChecklist,
                TrustBadges,
                SpecsTable,
                IntegrationsList,
                Content,
                MediaBlock,
                CallToAction,
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'hideHeader',
          type: 'checkbox',
          label: 'Hide header',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Skip the header entirely. Ignored if a Header block is in the layout.',
          },
        },
        {
          name: 'hideFooter',
          type: 'checkbox',
          label: 'Hide footer',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Skip the footer entirely. Ignored if a Footer block is in the layout.',
          },
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProduct],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
