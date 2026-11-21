import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  firebaseAuth,
  googleAuthProvider,
  isFirebaseConfigured,
  missingFirebaseKeys,
  missingRequiredAuthKeys,
} from '../lib/firebase';

interface AuthActionResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isFirebaseConfigured: boolean;
  missingFirebaseKeys: string[];
  missingRequiredAuthKeys: string[];
  displayName: string;
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  registerWithEmail: (fullName: string, email: string, password: string) => Promise<AuthActionResult>;
  loginWithEmail: (email: string, password: string) => Promise<AuthActionResult>;
  signInWithGoogle: () => Promise<AuthActionResult>;
  logout: () => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function formatFirebaseError(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = String((err as { code: unknown }).code);
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a password with at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email address or password. Please check your credentials and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/operation-not-allowed':
        return 'This sign-in provider is not enabled in your Firebase project settings.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized in Firebase Authentication. Add it under Firebase Console → Authentication → Settings → Authorized domains.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email using a different sign-in method.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in window was closed before completing sign-in.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in request was already in progress.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      case 'auth/network-request-failed':
        return 'Network error occurred while contacting Firebase. Check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a few minutes before trying again.';
      default:
        return `Authentication error (${code}). Please verify your Firebase configuration.`;
    }
  }
  return 'Unable to complete authentication request.';
}

const NOT_CONFIGURED_MESSAGE =
  'Firebase Authentication environment variables are not configured yet. Add your VITE_FIREBASE_* keys to .env (or AI Studio / Netlify environment variables) and restart the server to enable registration, login, and Google Sign-In.';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(!isFirebaseConfigured);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const registerWithEmail = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthActionResult> => {
    setAuthError(null);
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthError(NOT_CONFIGURED_MESSAGE);
      return { ok: false, error: NOT_CONFIGURED_MESSAGE };
    }

    setAuthBusy(true);
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const trimmedName = fullName.trim();
      if (trimmedName) {
        await updateProfile(credential.user, { displayName: trimmedName });
        await credential.user.reload();
        setUser(firebaseAuth.currentUser);
      }
      return { ok: true };
    } catch (err) {
      const msg = formatFirebaseError(err);
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setAuthBusy(false);
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<AuthActionResult> => {
    setAuthError(null);
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthError(NOT_CONFIGURED_MESSAGE);
      return { ok: false, error: NOT_CONFIGURED_MESSAGE };
    }

    setAuthBusy(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      return { ok: true };
    } catch (err) {
      const msg = formatFirebaseError(err);
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setAuthBusy(false);
    }
  };

  const signInWithGoogle = async (): Promise<AuthActionResult> => {
    setAuthError(null);
    if (!isFirebaseConfigured || !firebaseAuth || !googleAuthProvider) {
      setAuthError(NOT_CONFIGURED_MESSAGE);
      return { ok: false, error: NOT_CONFIGURED_MESSAGE };
    }

    setAuthBusy(true);
    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
      return { ok: true };
    } catch (err) {
      const msg = formatFirebaseError(err);
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = async (): Promise<AuthActionResult> => {
    setAuthError(null);
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthError(NOT_CONFIGURED_MESSAGE);
      return { ok: false, error: NOT_CONFIGURED_MESSAGE };
    }

    setAuthBusy(true);
    try {
      await signOut(firebaseAuth);
      return { ok: true };
    } catch (err) {
      const msg = formatFirebaseError(err);
      setAuthError(msg);
      return { ok: false, error: msg };
    } finally {
      setAuthBusy(false);
    }
  };

  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'HealthCheck Member');

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isFirebaseConfigured,
        missingFirebaseKeys,
        missingRequiredAuthKeys,
        displayName,
        authBusy,
        authError,
        clearAuthError,
        registerWithEmail,
        loginWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
