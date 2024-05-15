import lib from 'msgscan-lib'
const sql = lib.sql
const constants = lib.constants

// returns [signer]
async function findSigners(srcChainId, msgIndex) {
  const result = await sql`
    SELECT signer
    FROM ${sql(constants.PONDER_PUBLISH_SCHEMA)}."SignatureSubmittion"
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
