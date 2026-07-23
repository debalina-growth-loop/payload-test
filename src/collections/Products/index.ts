import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { FeatureChecklist } from '../../blocks/FeatureChecklist/config'
import { TrustBadges } from '../../blocks/TrustBadges/config'
import { SpecsTable } from '../../blocks/SpecsTable/config'
import { IntegrationsList } from '../../blocks/IntegrationsList/config'
import { AnnouncementBanner } from '../../blocks/AnnouncementBanner/config'
import { SectionHeading } from '../../blocks/SectionHeading/config'
import { linkGroup } from '@/fields/linkGroup'
import { defaultLexical } from '@/fields/defaultLexical'
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
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'tagline',
              type: 'text',
            },
            {
              name: 'heroImage',
              type: 'upload',
              admin: {
                description: 'Full-bleed background image behind the hero text.',
              },
              relationTo: 'media',
            },
            linkGroup({
              appearances: ['default', 'outline'],
              overrides: {
                name: 'ctas',
                label: 'Hero buttons',
                maxRows: 2,
              },
            }),
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: defaultLexical,
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
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
              admin: {
                initCollapsed: true,
              },
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
