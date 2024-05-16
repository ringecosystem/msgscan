import express from 'express'
const app = express()
const port = 3000

import * as message from './db/message.js'

app.get('/', async (req, res) => {
  res.send('Hello Msgscan!')
})

app.get('/messages/:sourceChainTransactionHash', async (req, res) => {
  const result = await message.findBySrcTxHash(req.params.sourceChainTransactionHash)
  res.send(result)
})

app.get('/messages/send_by/:sourceDappAddress', async (req, res) => {
  const result = await message.queryBySrcDappAddress(req.params.sourceDappAddress)
  res.send(result)
})

app.listen(port, () => {
  console.log(`Msgscan server listening on port ${port}`)
})
