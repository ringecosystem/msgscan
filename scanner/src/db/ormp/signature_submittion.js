import sql from '../db.js'

// returns [signer]
async function findSigners(srcChainId, msgIndex) {
  const result = await sql`
    SELECT signer
    FROM indexer."SignatureSubmittion"
    WHERE "srcChainId" = ${srcChainId} and "msgIndex" = ${msgIndex}
  `

  // uniq
  const signerSet = new Set()
  for (const row of result) {
    const signer = row.signer
    if (!signerSet.has(signer)) {
      signerSet.add(`0x${signer.toString('hex')}`)
    }
  }

  return Array.from(signerSet)
}

export { findSigners }
