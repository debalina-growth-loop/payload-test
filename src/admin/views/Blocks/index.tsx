import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'

import { BlocksList } from './BlocksList'
import './index.scss'

export default function BlocksView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props

  if (!initPageResult.req.user) {
    redirect('/admin/login')
  }

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <BlocksList />
    </DefaultTemplate>
  )
}
