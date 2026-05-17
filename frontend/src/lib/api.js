const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function orchestrate(farmerProfile) {
  const res = await fetch(`${API_URL}/api/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(farmerProfile),
  })

  if (!res.ok) {
    throw new Error(`Orchestrator failed: ${res.status}`)
  }

  return res.json()
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/api/health`)
    return res.ok
  } catch {
    return false
  }
}

export async function sendToWhatsApp(phoneNumber, plan, language) {
  const res = await fetch(`${API_URL}/api/whatsapp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, plan, language }),
  })

  if (!res.ok) {
    throw new Error(`WhatsApp send failed: ${res.status}`)
  }

  return res.json()
}