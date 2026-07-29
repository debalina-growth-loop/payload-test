/**
 * Snapshots the keys under the S3 media/ prefix and diffs against the previous
 * snapshot. Use it to prove an admin-panel action reached S3:
 *
 *   pnpm s3:snap                 # take a baseline
 *   ...delete an image in /admin...
 *   pnpm s3:snap                 # shows exactly which keys disappeared
 *
 * Pass a substring to inspect one file and its generated size variants:
 *
 *   pnpm s3:snap -- --find my-image
 *
 * Deleting a single upload should remove the original plus every imageSizes
 * variant, so expect several keys to vanish at once, not just one.
 */
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(dirname, '../.env') })

const PREFIX = 'media'
const SNAPSHOT_PATH = path.resolve(dirname, '../.s3-media-snapshot.json')

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

const findIndex = process.argv.indexOf('--find')
const findTerm = findIndex > -1 ? process.argv[findIndex + 1] : null

const client = new S3Client({
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  region: S3_REGION,
})

const keys = []
let ContinuationToken

do {
  const page = await client.send(
    new ListObjectsV2Command({ Bucket: S3_BUCKET, ContinuationToken, Prefix: `${PREFIX}/` }),
  )
  ;(page.Contents || []).forEach((obj) => keys.push(obj.Key))
  ContinuationToken = page.NextContinuationToken
} while (ContinuationToken)

keys.sort()

console.log(`s3://${S3_BUCKET}/${PREFIX}/ — ${keys.length} objects`)

if (findTerm) {
  const hits = keys.filter((key) => key.toLowerCase().includes(findTerm.toLowerCase()))
  console.log(`\nkeys matching "${findTerm}": ${hits.length}`)
  hits.forEach((key) => console.log(`  ${key}`))
  if (!hits.length) console.log('  (none — deleted from S3, or never uploaded)')
  process.exit(0)
}

let previous = null
try {
  const raw = await fs.readFile(SNAPSHOT_PATH, 'utf8')
  previous = JSON.parse(raw)
} catch {
  // No baseline yet.
}

if (!previous) {
  console.log('\nNo previous snapshot — baseline saved.')
  console.log('Now delete an image in /admin, then run this again.')
} else {
  const before = new Set(previous.keys)
  const after = new Set(keys)
  const removed = previous.keys.filter((key) => !after.has(key))
  const added = keys.filter((key) => !before.has(key))

  console.log(`\nsince last snapshot (${previous.takenAt}):`)
  console.log(`  ${previous.keys.length} -> ${keys.length} objects`)

  console.log(`\nREMOVED from S3: ${removed.length}`)
  removed.forEach((key) => console.log(`  - ${key}`))

  console.log(`\nADDED to S3: ${added.length}`)
  added.forEach((key) => console.log(`  + ${key}`))

  if (!removed.length && !added.length) console.log('\nNo change.')
}

await fs.writeFile(
  SNAPSHOT_PATH,
  `${JSON.stringify({ bucket: S3_BUCKET, keys, prefix: PREFIX, takenAt: new Date().toISOString() }, null, 2)}\n`,
)
