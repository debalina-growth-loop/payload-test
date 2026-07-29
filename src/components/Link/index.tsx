import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Product } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  borderColor?: string | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'products'
    value: Page | Post | Product | string | number
  } | null
  rounded?: 'none' | 'md' | 'full' | null
  size?: ButtonProps['size'] | null
  textColor?: string | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

const ROUNDED_CLASSES: Record<string, string> = {
  none: 'rounded-none',
  md: 'rounded-md',
  full: 'rounded-full',
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    borderColor,
    children,
    className,
    label,
    newTab,
    reference,
    rounded,
    size: sizeFromProps,
    textColor,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const style: React.CSSProperties = {}
  if (textColor) style.color = textColor
  if (borderColor) style.borderColor = borderColor
  const hasStyleOverride = Object.keys(style).length > 0

  const roundedClass = rounded ? ROUNDED_CLASSES[rounded] : undefined

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link
        className={cn(className)}
        href={href || url || ''}
        style={hasStyleOverride ? style : undefined}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button
      asChild
      className={cn(className, roundedClass)}
      size={size}
      style={hasStyleOverride ? style : undefined}
      variant={appearance}
    >
      <Link
        className={cn(className, roundedClass)}
        href={href || url || ''}
        style={hasStyleOverride ? style : undefined}
        {...newTabProps}
      >
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
