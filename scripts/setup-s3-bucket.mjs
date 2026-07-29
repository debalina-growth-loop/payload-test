/**
 * Configures a media bucket for public reads of the `media/` prefix:
 *   - relaxes Block Public Access just enough for a public bucket *policy*
 *     (ACL-based public access stays blocked; the plugin does not use ACLs)
 *   - installs a bucket policy granting s3:GetObject on `media/*` only
 *   - installs CORS rules for GET/HEAD
 *
 * Intended for provisioning a NEW bucket (e.g. staging/production).
 *
 * WARNING: PutBucketPolicy and PutBucketCors REPLACE the bucket's existing
 * policy and CORS configuration wholesale — they do not merge. Running this
 * against a bucket shared with other applications can revoke their access.
 * Always run --dry-run first and read the "current state" section.
 *
 * fareye-dev-bucket was already public-read (policy on the whole bucket, CORS
 * for localhost) when the S3 migration was done, so this was NOT applied to it.
 *
 *   pnpm setup:s3 -- --dry-run
 *   pnpm setup:s3
 */
import {
  GetBucketCorsCommand,
  GetBucketLocationCommand,
  GetBucketPolicyCommand,
  GetPublicAccessBlockCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(dirname, '../.env') })

// Must stay in sync with S3_MEDIA_PREFIX in src/plugins/index.ts.
const PREFIX = 'media'

const dryRun = process.argv.includes('--dry-run')
const { S3_ACCESS_KEY_ID, S3_BUCKET, S3_REGION, S3_SECRET_ACCESS_KEY } = process.env

const missing = Object.entries({
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
})
  .filter(([, value]) => !value || value.startsWith('PASTE_YOUR_'))
  .map(([key]) => key)

if (missing.length) {
  console.error(`Missing or placeholder env vars in .env: ${missing.join(', ')}`)
  process.exit(1)
}

const client = new S3Client({
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  region: S3_REGION,
})

const policy = {
  Statement: [
    {
      Action: 's3:GetObject',
      Effect: 'Allow',
      Principal: '*',
      Resource: `arn:aws:s3:::${S3_BUCKET}/${PREFIX}/*`,
      Sid: 'PublicReadPayloadMedia',
    },
  ],
  Version: '2012-10-17',
}

const corsRules = [
  {
    AllowedHeaders: ['*'],
    AllowedMethods: ['GET', 'HEAD'],
    AllowedOrigins: ['*'],
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3000,
  },
]

const publicAccessBlock = {
  // Keep ACL-based public access blocked; only policy-based access is needed.
  BlockPublicAcls: true,
  BlockPublicPolicy: false,
  IgnorePublicAcls: true,
  RestrictPublicBuckets: false,
}

const step = async (label, cmd, { tolerate = [] } = {}) => {
  try {
    const res = await client.send(cmd)
    console.log(`[ok]   ${label}`)
    return res
  } catch (err) {
    if (tolerate.includes(err.name)) {
      console.log(`[none] ${label}: ${err.name}`)
      return null
    }
    console.log(`[FAIL] ${label}: ${err.name} — ${err.message.split('\n')[0]}`)
    return { __failed: err }
  }
}

console.log(`bucket=${S3_BUCKET} region=${S3_REGION} prefix=${PREFIX}/`)
console.log(dryRun ? 'mode=dry-run\n' : 'mode=apply\n')

console.log('--- current state ---')
const head = await step('HeadBucket', new HeadBucketCommand({ Bucket: S3_BUCKET }))
if (head?.__failed) {
  console.error('\nCannot reach the bucket. Check the name, region, and credentials.')
  process.exit(1)
}

const loc = await step('GetBucketLocation', new GetBucketLocationCommand({ Bucket: S3_BUCKET }))
const actualRegion = loc && !loc.__failed ? loc.LocationConstraint || 'us-east-1' : null
if (actualRegion) console.log(`       actual region: ${actualRegion}`)

const pab = await step(
  'GetPublicAccessBlock',
  new GetPublicAccessBlockCommand({ Bucket: S3_BUCKET }),
  { tolerate: ['NoSuchPublicAccessBlockConfiguration'] },
)
if (pab && !pab.__failed) {
  console.log(`       ${JSON.stringify(pab.PublicAccessBlockConfiguration)}`)
}

const existingPolicy = await step(
  'GetBucketPolicy',
  new GetBucketPolicyCommand({ Bucket: S3_BUCKET }),
  { tolerate: ['NoSuchBucketPolicy'] },
)
if (existingPolicy && !existingPolicy.__failed) {
  console.log(`       existing policy: ${existingPolicy.Policy}`)
}

const existingCors = await step('GetBucketCors', new GetBucketCorsCommand({ Bucket: S3_BUCKET }), {
  tolerate: ['NoSuchCORSConfiguration'],
})
if (existingCors && !existingCors.__failed) {
  console.log(`       existing CORS: ${JSON.stringify(existingCors.CORSRules)}`)
}

if (actualRegion && actualRegion !== S3_REGION) {
  console.error(
    `\nRegion mismatch: bucket is in "${actualRegion}" but S3_REGION is "${S3_REGION}".` +
      `\nFix S3_REGION in .env before continuing — uploads and URLs will both be wrong.`,
  )
  process.exit(1)
}

console.log('\n--- intended configuration ---')
console.log(`PublicAccessBlock: ${JSON.stringify(publicAccessBlock)}`)
console.log(`Policy: ${JSON.stringify(policy)}`)
console.log(`CORS: ${JSON.stringify(corsRules)}`)

if (dryRun) {
  console.log('\nDry run — nothing changed.')
  process.exit(0)
}

console.log('\n--- applying ---')
const results = []

results.push([
  'PutPublicAccessBlock',
  await step(
    'PutPublicAccessBlock',
    new PutPublicAccessBlockCommand({
      Bucket: S3_BUCKET,
      PublicAccessBlockConfiguration: publicAccessBlock,
    }),
  ),
])

results.push([
  'PutBucketPolicy',
  await step(
    'PutBucketPolicy',
    new PutBucketPolicyCommand({ Bucket: S3_BUCKET, Policy: JSON.stringify(policy) }),
  ),
])

results.push([
  'PutBucketCors',
  await step(
    'PutBucketCors',
    new PutBucketCorsCommand({
      Bucket: S3_BUCKET,
      CORSConfiguration: { CORSRules: corsRules },
    }),
  ),
])

const failed = results.filter(([, res]) => res?.__failed)

if (failed.length) {
  console.error(
    `\n${failed.length} step(s) failed. The access key likely lacks the matching` +
      ` s3:Put* bucket permission — apply these in the S3 console instead:`,
  )
  failed.forEach(([label]) => console.error(`  - ${label}`))
  process.exit(1)
}

console.log('\nBucket configured.')
