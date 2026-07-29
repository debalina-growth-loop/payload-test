/**
 * Server-side helpers for building public S3 media URLs.
 *
 * Deliberately NOT in `getMediaUrl.ts`: that module is imported by client
 * components, and `S3_BUCKET` / `S3_REGION` are not `NEXT_PUBLIC_`, so they are
 * undefined in the browser bundle. Reading them there yields hosts like
 * `https://undefined.s3.undefined.amazonaws.com` with no error.
 */

/**
 * The key prefix every media object lives under in the bucket.
 * Also hardcoded in scripts/*.mjs — change both together.
 */
export const S3_MEDIA_PREFIX = 'media'

/**
 * Only the bucket and region are needed to build URLs, and therefore at build
 * time. Credentials are deliberately NOT required here: the build makes no S3
 * API calls, and demanding them would force AWS secrets into the Docker build,
 * where `ARG` values are recoverable from `docker history`.
 *
 * Credentials are needed at runtime only (upload/delete); the AWS SDK raises its
 * own clear error if they are absent.
 */
const S3_URL_ENV_VARS = ['S3_BUCKET', 'S3_REGION'] as const

/**
 * Throws unless the bucket and region are set. Called from `next.config.ts` so a
 * misconfigured environment fails the build loudly.
 *
 * Without it the build still exits 0 and bakes `https://.s3..amazonaws.com/...`
 * into prerendered HTML — every image and video breaks with nothing in the logs.
 */
export const assertS3UrlEnv = (): void => {
  const missing = S3_URL_ENV_VARS.filter((name) => {
    const value = process.env[name]
    return !value || value.startsWith('PASTE_YOUR_')
  })

  if (missing.length) {
    throw new Error(
      `Missing required S3 environment variable(s): ${missing.join(', ')}.\n` +
        `Media is served directly from S3, so these must be set at BUILD time as well as ` +
        `at runtime — next.config.ts reads S3_BUCKET to register the image host, and media ` +
        `URLs are baked into prerendered pages.\n` +
        `Set them in your deployment environment (and .env locally). See .env.example.`,
    )
  }
}

/** e.g. `my-bucket.s3.us-east-1.amazonaws.com` */
export const getS3BucketHost = (): string => {
  assertS3UrlEnv()

  return `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`
}

/**
 * Mirrors the storage adapter's key layout: a per-document prefix overrides the
 * collection-level prefix, and only the filename segment is encoded.
 */
export const getS3MediaUrl = (filename: string, prefix?: null | string): string =>
  `https://${getS3BucketHost()}/${prefix || S3_MEDIA_PREFIX}/${encodeURIComponent(filename)}`
