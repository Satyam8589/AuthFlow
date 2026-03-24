import { useEffect, useState, useRef } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { saveUser, getUser, clearUser } from "../utils/appStorage";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const justLoggedIn = useRef(false);

  useEffect(() => {
    const cached = getUser();
    if (cached) {
      setUser({
        ...cached,
        photo: null,
      });
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const session = getUser();

        if (session || justLoggedIn.current) {
          justLoggedIn.current = false;
          saveUser(firebaseUser);

          setUser({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            expiresAt: getUser()?.expiresAt,
          });
        } else {
          setUser(null);
          clearUser();
          signOut(auth);
        }
      } else {
        setUser(null);
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    justLoggedIn.current = true;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      justLoggedIn.current = false;
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    clearUser();
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
