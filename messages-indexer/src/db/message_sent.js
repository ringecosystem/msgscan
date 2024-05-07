import sql from './db.js'

async function getMessageSentsAfter(protocol, chainId, blockNumber, transactionIndex, logIndex) {
  const id = `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
  return await sql`
    SELECT *
    FROM indexer."MessageSent"
    WHERE "protocol"=${protocol} and id > ${id}
  `
}

export { getMessageSentsAfter }

// async function main() {
//   const result = await getMessageSentsAfter('ormp', 11155111, 5852791, 60, 0)
//   console.log(result)
// }
//
// main().catch(console.error)
