import express from 'express'
const app = express()
const port = 3000

// enable CORS for all routes and for our specific API-Key header
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
  next()
})

import * as message from './db/message.js'

app.get('/', async (req, res) => {
  res.send('Hello Msgscan!')
})

app.get('/messages/:msgIdOrSrcTxHash.json', async (req, res, next) => {
  try {
    let result = await message.findByMsgId(req.params.msgIdOrSrcTxHash)
    if (!result) {
      result = await message.findBySrcTxHash(req.params.msgIdOrSrcTxHash)
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.get('/messages/sent_by/:sourceDappAddress.json', async (req, res, next) => {
  try {
    const result = await message.queryBySrcDappAddress(req.params.sourceDappAddress)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.get('/messages/timespent/:op/:number/:unit.json', async (req, res, next) => {
  try {
    // == PARAMETER VALIDATION ==
    // ==========================
    // -- OP --
    const comparison = {
      gt: '>',
      lt: '<'
    }
    if (!Object.keys(comparison).includes(req.params.op)) {
      throw new Error('Invalid comparison operator, only gt and lt are allowed')
    }
    const op = comparison[req.params.op]


    // -- NUMBER --
    const number = parseInt(req.params.number)

    // -- UNIT --
    const units = ['seconds', 'minutes', 'hours', 'days']
    if (!units.includes(req.params.unit)) {
      throw new Error('Invalid unit, only seconds, minutes, hours, and days are allowed')
    }
    const unit = req.params.unit

    // -- STATUS --
    // if no status is provided, default to all
    let status = req.query.status ? req.query.status : 'inflight,success,failed'
    status = status.split(',')
    status = status.length > 0 ? status : ['inflight', 'success', 'failed']
    const statusChoices = {
      inflight: 0,
      success: 1,
      failed: 2
    }
    status = status.filter(s => Object.keys(statusChoices).includes(s)).map(s => statusChoices[s])
    if (status.length === 0) {
      throw new Error('Invalid status')
    }

    // == QUERY ==
    // ==========================
    const result = await message.queryByTimeSpent(op, number, unit, status)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(
    `Err: "${err.message}". Please check the server logs for more info.`
  )
})

app.listen(port, () => {
  console.log(`Msgscan server listening on port ${port}`)
})
