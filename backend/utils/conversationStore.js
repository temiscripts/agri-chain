const SESSION_TTL = 30 * 60 * 1000 // 30 minutes

const sessions = new Map()

function get(phone) {
  const entry = sessions.get(phone)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    sessions.delete(phone)
    return null
  }
  return entry.data
}

function set(phone, data) {
  sessions.set(phone, { data, expiresAt: Date.now() + SESSION_TTL })
}

function update(phone, patch) {
  const current = get(phone) || {}
  set(phone, { ...current, ...patch })
}

function clear(phone) {
  sessions.delete(phone)
}

module.exports = { get, set, update, clear }
