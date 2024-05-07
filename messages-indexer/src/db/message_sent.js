import sql from './db.js'

// get all MessageSent events after a given log on ${chainId}
async function getMessageSentsAfter(chainId, blockNumber, transactionIndex, logIndex) {
  const id = `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
  return await sql`
    SELECT *
    FROM indexer."MessageSent"
    WHERE "chainId"=${chainId} and id > ${id}
  `
}

export { getMessageSentsAfter }

// async function main() {
//   const result = await getMessageSentsAfter(11155111, 5852791, 60, 0)
//   console.log(result)
// }
//
// main().catch(console.error)
