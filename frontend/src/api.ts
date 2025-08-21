const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: any = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const AuthAPI = {
  async login(email: string, password: string) {
    return api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async register(email: string, password: string, full_name?: string) {
    return api('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, full_name }) });
  },
  async changePassword(current_password: string, new_password: string) {
    return api('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) });
  }
};

export const DriversAPI = {
  async list(params: Record<string, any> = {}) {
    const qs = new URLSearchParams(params as any).toString();
    return api(`/api/drivers/${qs ? `?${qs}` : ''}`);
  },
  async create(payload: any) {
    return api('/api/drivers/create', { method: 'POST', body: JSON.stringify(payload) });
  },
  async update(id: string, payload: any) {
    return api(`/api/drivers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async remove(id: string) {
    return api(`/api/drivers/${id}`, { method: 'DELETE' });
  }
};

export const LogsAPI = {
  async list(params: Record<string, any> = {}) {
    const qs = new URLSearchParams(params as any).toString();
    return api(`/api/logs${qs ? `?${qs}` : ''}`);
  }
};

export const ProfileAPI = {
  async uploadPicture(file: File) {
    const token = localStorage.getItem('token');
    const headers: any = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const form = new FormData();
    form.append('file', file)
    const res = await fetch(`${API_BASE}/api/profile/picture`, { method: 'POST', headers, body: form })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  getPictureUrl() {
    return `${API_BASE}/api/profile/picture`
  }
}