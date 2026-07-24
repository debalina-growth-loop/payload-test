import React from 'react'

import type { TextVideoBlock } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

const mediaVideo = (m: unknown): { url: string } | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? { url: (m as { url: string }).url }
    : null

const mediaUrl = (m: unknown): string | null => mediaVideo(m)?.url ?? null

export const TextVideoComponent: React.FC<TextVideoBlock> = ({
  sectionHeading,
  sectionSubheading,
  mediaPosition,
  heading,
  body,
  links,
  linkStyle,
  logo,
  bottomLink,
  videoEmbedUrl,
  videoFile,
  background,
}) => {
  const file = mediaVideo(videoFile)
  const logoUrl = mediaUrl(logo)
  const bg = background === 'white' ? '#ffffff' : '#DCEFF6'
  const videoLeft = mediaPosition === 'left'

  const Video = (
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
  )

  const Text = (
    <div className="w-full lg:w-[43%]">
      {heading && (
        <h2 className="mb-[30px] text-[2rem] font-bold leading-[1.31]" style={{ color: '#012A36' }}>
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

      {Array.isArray(links) && links.length > 0 && links[0]?.link && (
        linkStyle === 'underline' ? (
          <CMSLink
            {...links[0].link}
            appearance="inline"
            className="inline-block font-bold text-[#012A36] underline underline-offset-4 transition-opacity hover:opacity-70"
          />
        ) : (
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
        )
      )}

      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="mt-6 max-h-16 w-auto" loading="lazy" />
      )}
    </div>
  )

  return (
    <section style={{ backgroundColor: bg }} className="w-full">
      <div className="mx-auto max-w-[1360px] px-6 py-[40px] lg:py-[60px]">
        {(sectionHeading || sectionSubheading) && (
          <div className="mb-12 text-center">
            {sectionHeading && (
              <h2 className="text-[2rem] font-bold text-[#012A36]">{sectionHeading}</h2>
            )}
            {sectionSubheading && (
              <p className="mt-3 text-[1.25rem] font-bold text-[#012A36]">{sectionSubheading}</p>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          {videoLeft ? (
            <>
              {Video}
              {Text}
            </>
          ) : (
            <>
              {Text}
              {Video}
            </>
          )}
        </div>

        {bottomLink?.label && (
          <div className="mt-14 text-center">
            <CMSLink
              {...bottomLink}
              appearance="inline"
              className="inline-block text-[1.05rem] font-bold text-[#012A36] underline underline-offset-4 transition-opacity hover:opacity-70"
            />
          </div>
        )}
      </div>
    </section>
  )
}
