const TTL = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "authUser";

export function saveUser(user) {
  const data = {
    name: user.displayName,
    email: user.email,
    expiresAt: Date.now() + TTL,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const data = JSON.parse(raw);

  if (Date.now() > data.expiresAt) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return data;
}

export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}
