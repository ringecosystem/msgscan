import lib from 'msgscan-lib'
const sql = lib.sql
const constants = lib.constants

// get all MessageSent events after a given log on ${chainId}
async function getMessageSentsAfter(chainId, blockNumber, transactionIndex, logIndex) {
  const id = `${chainId}-${blockNumber}-${transactionIndex}-${logIndex}`
  const result = await sql`
    SELECT *
    FROM ${sql(constants.PONDER_PUBLISH_SCHEMA)}."MessageSent"
    WHERE "chainId"=${chainId} and id > ${id}
  `
  return result
}

export { getMessageSentsAfter }

// async function main() {
//   const result = await getMessageSentsAfter(11155111, 5852791, 60, 0)
//   console.log(result)
// }
//
// main().catch(console.error)
