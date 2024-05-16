import express from 'express'
const app = express()
const port = 3000

import * as message from './db/message.js'

app.get('/', async (req, res) => {
  res.send('Hello Msgscan!')
})

app.get('/messages/:msgIdOrSrcTxHash', async (req, res) => {
  let result = await message.findByMsgId(req.params.msgIdOrSrcTxHash)
  if (!result) {
    result = await message.findBySrcTxHash(req.params.msgIdOrSrcTxHash)
  }
  res.send(result)
})

app.get('/messages/sent_by/:sourceDappAddress', async (req, res) => {
  const result = await message.queryBySrcDappAddress(req.params.sourceDappAddress)
  res.send(result)
})

app.listen(port, () => {
  console.log(`Msgscan server listening on port ${port}`)
})
