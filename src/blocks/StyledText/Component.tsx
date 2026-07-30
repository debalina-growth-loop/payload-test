import React from 'react'

import type { StyledTextBlock as StyledTextBlockProps } from '@/payload-types'

const FONT_SIZE_CLASSES: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
}

const FONT_FAMILY_CLASSES: Record<string, string> = {
  sans: '',
  serif: 'font-serif',
  mono: 'font-mono',
}

export const StyledTextBlock: React.FC<StyledTextBlockProps> = ({
  bold,
  color,
  fontFamily,
  fontSize,
  text,
}) => {
  const classes = [
    FONT_SIZE_CLASSES[fontSize || 'lg'],
    FONT_FAMILY_CLASSES[fontFamily || 'sans'],
    bold ? 'font-bold' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <p className={classes} style={color ? { color } : undefined}>
      {text}
    </p>
  )
}
