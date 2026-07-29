'use client'

import React, { useState } from 'react'
import { Button, toast, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

export const ApplyTemplateButton: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  const templateId = useFormFields(([fields]) => fields['template.templateRef']?.value) as
    | string
    | undefined
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    if (!id || !templateId) return

    setLoading(true)

    try {
      const res = await fetch(`/api/pages/${id}/apply-template`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      toast.success("Template blocks copied in — reloading this page's editor…")
      window.location.reload()
    } catch {
      toast.error('Could not apply the template. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleApply}
      disabled={!templateId || !id || loading}
      buttonStyle="secondary"
      size="small"
    >
      {loading
        ? 'Applying…'
        : !id
          ? 'Save the page first to apply a template'
          : 'Copy template blocks into this page'}
    </Button>
  )
}
