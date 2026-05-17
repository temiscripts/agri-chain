const rateLimit = require('express-rate-limit')

const standard = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { status: 'error', error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Try again in 15 minutes.' },
})

const webhook = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  validate: { xForwardedForHeader: false },
  message: { status: 'error', error: 'RATE_LIMIT_EXCEEDED', message: 'Webhook rate limit exceeded.' },
})

module.exports = { standard, webhook }
