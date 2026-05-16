require('dotenv').config()
const express = require('express')
const { log } = require('./utils/logger')
const farmPlanRoute = require('./routes/farmPlan')
const whatsappRoute = require('./routes/whatsapp')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.get('/', (req, res) => res.json({
  name: 'AgriChain API',
  version: '1.0.0',
  status: 'running',
  agents: ['soil', 'weather', 'market', 'finance', 'pest'],
}))

app.get('/health', (req, res) => res.json({ status: 'healthy' }))

app.use('/api', farmPlanRoute)
app.use('/webhook', whatsappRoute)

app.use((err, req, res, next) => {
  log('server', null, `Unhandled error: ${err.message}`)
  res.status(500).json({ status: 'error', error: 'INTERNAL_ERROR', message: err.message })
})

app.listen(PORT, () => log('server', null, `AgriChain backend running on port ${PORT}`))

module.exports = app
