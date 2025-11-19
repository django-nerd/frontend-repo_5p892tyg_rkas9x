// Mock encrypted storage: in real app, wrap WebCrypto + IndexedDB/localStorage.
// Never log secrets. We only simulate behavior.

const prefix = 'unnamed_secure_'

const encryptedStorage = {
  set(key, value) {
    try {
      const payload = { v: 1, t: Date.now(), data: value }
      localStorage.setItem(prefix + key, btoa(JSON.stringify(payload)))
    } catch (e) {
      // swallow errors, never print sensitive data
    }
  },
  get(key) {
    try {
      const raw = localStorage.getItem(prefix + key)
      if (!raw) return null
      const parsed = JSON.parse(atob(raw))
      return parsed?.data ?? null
    } catch (e) {
      return null
    }
  },
  remove(key) {
    try { localStorage.removeItem(prefix + key) } catch (e) {}
  }
}

export default encryptedStorage
