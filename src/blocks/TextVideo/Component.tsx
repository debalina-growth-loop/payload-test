import React from 'react'

import type { TextVideoBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

const mediaVideo = (m: unknown): { url: string; mime: string } | null => {
  if (typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string') {
    return {
      url: (m as { url: string }).url,
      mime: (m as { mimeType?: string }).mimeType || 'video/mp4',
    }
  }
  return null
}

export const TextVideoComponent: React.FC<TextVideoBlock> = ({
  heading,
  body,
  links,
  videoEmbedUrl,
  videoFile,
  background,
}) => {
  const file = mediaVideo(videoFile)
  const bg = background === 'white' ? '#ffffff' : '#DCEFF6'

  return (
    <section style={{ backgroundColor: bg }} className="w-full">
      <div className="mx-auto flex max-w-[1360px] flex-col-reverse items-center justify-between gap-10 px-6 py-[40px] lg:flex-row lg:py-[60px]">
        {/* Left: text */}
        <div className="w-full lg:w-[43%]">
          {heading && (
            <h2
              className="mb-[30px] text-[2rem] font-bold leading-[1.31]"
              style={{ color: '#012A36' }}
            >
              {heading}
            </h2>
          )}

          {body && (
            <RichText
              className="mb-[30px] text-[1.13rem] leading-[1.8]"
              data={body}
              enableGutter={false}
            />
          )}

          {Array.isArray(links) && links.length > 0 && (
            <CMSLink
              {...links[0].link}
              appearance="inline"
              className="mt-2 inline-flex items-center gap-3 rounded-full border-2 border-[#012A36] px-7 py-3 text-[1.05rem] font-bold text-[#012A36] transition-colors hover:bg-[#012A36] hover:text-white"
            >
              <svg width="20" height="12" viewBox="0 0 23 12" fill="none" aria-hidden="true">
                <path
                  d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
                  fill="currentColor"
                />
              </svg>
            </CMSLink>
          )}
        </div>

        {/* Right: video */}
        <div className="w-full lg:w-[48%]">
          <div className="mx-auto w-full max-w-[622px] overflow-hidden rounded-lg">
            {file ? (
              <video controls className="aspect-video w-full" src={file.url} />
            ) : videoEmbedUrl ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={videoEmbedUrl}
                  title={heading || 'Video'}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-lg border-0"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
