function log(agent, requestId, message) {
  const rid = requestId ? `[${requestId}]` : '[system]'
  console.log(`${rid} [${agent}] ${message}`)
}

function logError(agent, requestId, error) {
  const rid = requestId ? `[${requestId}]` : '[system]'
  console.error(`${rid} [${agent}] ERROR ${error}`)
}

module.exports = { log, logError }
