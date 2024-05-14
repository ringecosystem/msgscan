import express from 'express'
const app = express()
const port = 3000

import * as message from './db/message.js'

app.get('/', async (req, res) => {
  const messages = await message.findAll()
  res.send(messages)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
