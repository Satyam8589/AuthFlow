# 🔐 AuthFlow — Firebase Auth with TTL Session Management

A production-ready React authentication system built for a internship assignment at **Celebrare**. Implements Google OAuth via Firebase, protected routes, and a secure session management system with a **24-hour Time-To-Live (TTL)**.

---

## ✨ Features

- 🔑 **Google OAuth** — One-click sign-in via Firebase `signInWithPopup`
- 🛡️ **Protected Routes** — Unauthenticated users are hard-redirected to login
- ⏱️ **24-Hour Session TTL** — Sessions automatically expire; no manual cleanup needed
- 🔄 **Session Restore** — Returning users skip the login screen on page refresh
- 💾 **localStorage with TTL** — Stores name + email with a 24-hour expiry timestamp
- 🌀 **Smart Loader** — Skeleton loading on auth check, full-screen loader on logout
- 📱 **Fully Responsive** — Works across mobile, tablet, and desktop
- 🌑 **Dark Glassmorphism UI** — Premium design with animated background blobs

---

## 🏗️ Project Structure

```
src/
├── context/
│   ├── AuthContext.js       # Creates the raw context object
│   ├── AuthProvider.jsx     # All auth logic: login, logout, session, TTL
│   ├── useAuth.js           # Custom hook to consume the context
│   └── index.js             # Barrel export for clean imports
│
├── routes/
│   └── ProtectedRoute.jsx   # Blocks unauthenticated access to /dashboard
│
├── pages/
│   ├── Login.jsx            # Google sign-in UI with skeleton loading
│   └── Dashboard.jsx        # User info + session details dashboard
│
├── components/
│   ├── Navbar.jsx           # Sticky navbar with brand and logout button
│   └── Loader.jsx           # Full-screen animated loader
│
├── utils/
│   └── appStorage.js        # TTL session manager (localStorage utility)
│
└── firebase/
    └── config.js            # Firebase init with env vars
```

---

## 🔒 localStorage & TTL Design

### What is stored in localStorage?

As required by the assignment, the user's **name** and **email** are stored alongside a **24-hour expiry timestamp**:

```js
// localStorage key: "authUser"
{
  "name": "Satyam Singh",
  "email": "satyam@gmail.com",
  "expiresAt": 1711234567000   // Unix timestamp — now + 24 hours
}
```

> ⚠️ **Note:** The user's photo URL and Firebase tokens are deliberately **not stored** in localStorage. The photo is always fetched live from Firebase, and access tokens are managed by the Firebase SDK internally — not exposed in plain storage.

### 24-Hour TTL Flow

```
User logs in
    ↓
saveUser() → writes { name, email, expiresAt: now + 24h } to localStorage
    ↓
On every page refresh → getUser() checks Date.now() > expiresAt
    ↓
Valid? → Instantly restore user state — no login screen ✅
Expired? → Auto-clear localStorage + force signOut(auth) ✅
Logout? → clearUser() removes the key immediately ✅
```

---

## 🧩 Key Technical Decisions

### 1. Context Split into 4 Files
Instead of a monolithic `AuthContext.jsx`, the context is split:
- `AuthContext.js` — Only creates the context object (no dependencies)
- `AuthProvider.jsx` — All the logic, separately testable
- `useAuth.js` — The consuming hook, isolated for reusability
- `index.js` — Clean barrel export

This avoids circular dependencies and makes each file independently maintainable.

### 2. Race Condition Fix with `useRef`
Firebase's `onAuthStateChanged` fires asynchronously. If we only relied on `localStorage` to verify a session, a fresh login would:
1. Open the Google popup
2. Firebase fires `onAuthStateChanged` (session not yet written!)
3. See no TTL in `localStorage` → force logout 💥

**Fix:** A `useRef` flag (`justLoggedIn`) is set **before** the popup opens, so the listener always sees it in time.

```js
const justLoggedIn = useRef(false);

const loginWithGoogle = async () => {
  justLoggedIn.current = true;         // Raise flag before async work
  await signInWithPopup(auth, googleProvider);
  saveUser(firebaseUser);              // Write name, email, TTL to localStorage
};
```

### 3. Protected Route Implementation
```jsx
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;  // Hard redirect

  return children;  // Render the protected component
}
```

The `replace` prop ensures the user can't click the browser **Back** button to bypass the guard.

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
| Firebase Auth | Google OAuth |
| React Router v7 | Client-side routing + protected routes |
| Tailwind CSS v4 | Styling |
| Vite | Build tool |

---

## 👨‍💻 Author

**Satyam** — Built as part of an internship assignment for **Celebrare**

> This project demonstrates real-world authentication patterns including TTL-based session management, async race condition resolution with `useRef`, protected routing with React Router, and a deliberate local storage design that balances the assignment requirements with minimal data exposure.
