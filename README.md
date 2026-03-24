# 🔐 AuthFlow — Firebase Google Auth with TTL Session Management

> **Internship Assignment** — Celebrare | Submitted by **Satyam Singh**

A production-ready React authentication system implementing Google OAuth via Firebase, protected routes, and a 24-hour TTL session mechanism — built as part of the frontend internship assignment at **Celebrare**.

---

## 📋 Assignment Requirements

| Requirement | Status |
|---|---|
| Google Sign-In via Firebase | ✅ Done |
| Store user name & email in localStorage | ✅ Done |
| 24-hour TTL session expiry | ✅ Done |
| Protected `/dashboard` route | ✅ Done |
| Redirect unauthenticated users to login | ✅ Done |
| Logout clears session immediately | ✅ Done |

---

## ✨ Features

- 🔑 **Google OAuth** — One-click sign-in via Firebase `signInWithPopup`
- 🛡️ **Protected Routes** — Unauthenticated users are hard-redirected to login
- ⏱️ **24-Hour Session TTL** — Sessions auto-expire; no manual cleanup needed
- 🔄 **Session Restore** — Returning users skip the login screen on page refresh
- 💾 **Minimal localStorage** — Only stores `name`, `email`, `expiresAt` — no tokens, no photos
- 🌀 **Smart Loader** — Skeleton on auth check, full-screen spinner on logout
- 📱 **Fully Responsive** — Works across mobile, tablet, and desktop
- 🌑 **Dark Glassmorphism UI** — Premium design with animated background blobs

---

## 🏗️ Project Structure

```
src/
├── context/
│   ├── AuthContext.js       # Creates the raw React context object
│   ├── AuthProvider.jsx     # All auth logic: login, logout, session, TTL
│   ├── useAuth.js           # Custom hook to consume the context
│   └── index.js             # Barrel export for clean imports
│
├── routes/
│   └── ProtectedRoute.jsx   # Blocks unauthenticated access to /dashboard
│
├── pages/
│   ├── Login.jsx            # Google sign-in UI with skeleton loading state
│   └── Dashboard.jsx        # User info + session details + logout
│
├── components/
│   ├── Navbar.jsx           # Sticky navbar with brand + logout button
│   └── Loader.jsx           # Full-screen animated loader (used on logout)
│
├── utils/
│   └── appStorage.js        # TTL-aware localStorage utility
│
└── firebase/
    └── config.js            # Firebase SDK init with .env variables
```

---

## 🔒 Session & localStorage Design

### What gets stored?

```js
// localStorage key: "authUser"
{
  "name": "Satyam Singh",
  "email": "[EMAIL_ADDRESS]",
  "expiresAt": 1711234567000   // Date.now() + 24 hours in ms
}
```

> ⚠️ **Deliberately NOT stored:** photo URL and Firebase tokens.  
> Photos are always fetched live from Firebase. Tokens are managed  
> internally by the Firebase SDK — never exposed in plain storage.

### TTL Flow

```
User logs in
    ↓
saveUser() → { name, email, expiresAt: now + 24h } → localStorage
    ↓
On every page load → getUser() runs Date.now() > expiresAt
    ↓
Valid?   → Instantly restore user state (no login screen) ✅
Expired? → clearUser() + signOut(auth) automatically ✅
Logout?  → clearUser() removes the key immediately ✅
```

---

## 🧩 Key Technical Decisions

### 1. Context Split into 4 Files

Instead of one big `AuthContext.jsx`, the context is deliberately split:

| File | Responsibility |
|---|---|
| `AuthContext.js` | Only creates the `createContext()` object |
| `AuthProvider.jsx` | All logic: login, logout, state, TTL |
| `useAuth.js` | Consuming hook — callable from any component |
| `index.js` | Barrel export for clean `import { useAuth } from "../context"` |

This avoids circular imports and makes every piece independently testable.

---

### 2. Race Condition Fix with `useRef`

Firebase's `onAuthStateChanged` fires **asynchronously**. Without a fix:

1. User clicks "Sign in with Google"
2. Firebase popup opens
3. `onAuthStateChanged` fires immediately — **localStorage is still empty!**
4. No TTL found → auto-logout 💥

**Fix:** A `justLoggedIn` ref is set **before** the popup opens, so the listener always recognizes a fresh login:

```js
const justLoggedIn = useRef(false);

const loginWithGoogle = async () => {
  justLoggedIn.current = true;          // Flag raised BEFORE async work
  await signInWithPopup(auth, googleProvider);
  // onAuthStateChanged fires → sees justLoggedIn.current = true → saves session ✅
};
```

---

### 3. Protected Route with `replace`

```jsx
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;  // Hard redirect

  return children;
}
```

The `replace` prop replaces the history entry — the user **cannot** press the browser Back button to bypass the route guard.

---

### 4. Auth State Listener Bootstrapping

On every page load, the `useEffect` in `AuthProvider` runs two steps **in order**:

1. **Synchronous cache check** — reads localStorage immediately, restores user state to prevent flash-of-unauthenticated-content (FOUC)
2. **Firebase listener** — `onAuthStateChanged` fires when Firebase confirms the session, and overwrites state with live data (including fresh photo URL)

```js
useEffect(() => {
  // Step 1: instant cache restore (prevents FOUC)
  const cached = getUser();
  if (cached) { setUser({ ...cached, photo: null }); setLoading(false); }

  // Step 2: Firebase confirms session (live data)
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { ... });

  return () => unsubscribe();
}, []);
```

---

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/Satyam8589/AuthFlow.git
cd AuthFlow
npm install
```

### 2. Configure Firebase
Create a `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Locally
```bash
npm run dev
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Firebase Auth | Google OAuth provider |
| React Router v7 | Client-side routing + protected routes |
| Tailwind CSS v4 | Utility-first styling |
| Vite | Fast dev server + build tool |

---

## 👨‍💻 Author

**Satyam Singh**  
Submitted as part of the **Frontend Internship Assignment** at [Celebrare](https://celebrare.in)

> This project demonstrates production-level auth patterns: TTL-based session management, async race condition resolution via `useRef`, protected routing with history replacement, and a deliberate minimal-storage design that fulfills assignment requirements while keeping sensitive data out of `localStorage`.
