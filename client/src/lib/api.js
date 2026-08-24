const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function authHeaders() {
  const userId = localStorage.getItem('x-user-id')
  return userId ? { 'x-user-id': userId } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...options
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status} ${res.statusText} ${text}`)
  }
  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' })
}

export const authApi = {
  login: (body) => api.post('/api/auth/login', body),
  signup: (body) => api.post('/api/auth/signup', body)
}

export const reservationsApi = {
  create: (body) => api.post('/api/reservations', body),
  byUser: (userId) => api.get(`/api/reservations/${userId}`)
}

export const passApi = {
  me: () => api.get('/api/pass/me')
}

export const adminApi = {
  reservations: () => api.get('/api/admin/reservations'),
  summary: () => api.get('/api/admin/summary')
}
