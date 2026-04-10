(function () {
  const TOKEN_KEY = 'alphaz_jwt';

  window.AlphazApi = {
    getToken() {
      return localStorage.getItem(TOKEN_KEY);
    },
    setToken(t) {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    },
    base() {
      return window.__API_BASE__ || '';
    },
    authHeaders() {
      const t = window.AlphazApi.getToken();
      const h = { 'Content-Type': 'application/json' };
      if (t) h.Authorization = 'Bearer ' + t;
      return h;
    },
    async fetch(path, opts = {}) {
      const url = window.AlphazApi.base() + path;
      const r = await fetch(url, {
        ...opts,
        headers: { ...window.AlphazApi.authHeaders(), ...opts.headers },
      });
      if (r.status === 401) {
        window.AlphazApi.setToken(null);
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
      }
      return r;
    },
    async getJson(path) {
      const r = await window.AlphazApi.fetch(path, { method: 'GET' });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
      return r.json();
    },
    async postJson(path, body) {
      const r = await window.AlphazApi.fetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
      if (r.status === 204) return null;
      return r.json();
    },
    async patchJson(path, body) {
      const r = await window.AlphazApi.fetch(path, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
      return r.json();
    },
    async delete(path) {
      const r = await window.AlphazApi.fetch(path, { method: 'DELETE' });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText);
    },
    loginUrl() {
      return window.AlphazApi.base() + '/auth/discord';
    },
  };
})();
