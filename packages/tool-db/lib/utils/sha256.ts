import crypto, { type BinaryLike } from 'node:crypto'

export default function sha256(str: BinaryLike): string {
  const hash = crypto.createHash('sha256')
  hash.update(str)
  return hash.digest('hex')
}
