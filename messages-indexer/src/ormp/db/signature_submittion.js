import sql from '../../db/db.js'

// returns [signer]
async function findSigners(chainId, messageIndex) {
  const result = await sql`
    SELECT signer
    FROM indexer."SignatureSubmittion"
    WHERE "srcChainId" = ${chainId} and "msgIndex" = ${messageIndex}
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
