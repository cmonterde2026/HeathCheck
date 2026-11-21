import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogOut,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthFormCard } from './AuthFormCard';

export function AccountView() {
  const {
    user,
    authReady,
    isFirebaseConfigured,
    missingFirebaseKeys,
    displayName,
    authBusy,
    authError,
    logout,
  } = useAuth();

  return (
    <div className="space-y-6">
      {/* Firebase Environment Status Banner */}
      {!isFirebaseConfigured ? (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold">
                Firebase Configuration Required
              </p>
              <p className="leading-relaxed text-amber-900">
                HealthCheck is connected to the modular Firebase Authentication SDK for Email/Password registration, Login, Google Sign-In, and Logout. Add the missing environment variables below to connect your <span className="font-semibold">HealthCheck-Web</span> project.
              </p>
              <p className="font-mono text-xs text-amber-900">
                Missing environment keys: {missingFirebaseKeys.join(', ')}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-[#A7F3D0] bg-[#EDF7F2] p-4 text-sm text-[#0D3B2B]">
          <div className="flex items-center gap-2.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-[#188055] shrink-0" aria-hidden="true" />
            <span>Firebase Authentication is connected and active.</span>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Auth Card / Authenticated Profile */}
        <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 sm:p-8 lg:col-span-7">
          {!authReady ? (
            <div className="py-12 text-center text-sm text-[#4A6559]">
              Checking authentication session...
            </div>
          ) : user ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#E8F0EB] pb-5">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D3B2B] text-white">
                    <UserCheck className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-[#0D3B2B] truncate">
                      {displayName}
                    </h2>
                    <p className="text-sm text-[#4A6559] truncate">{user.email}</p>
                  </div>
                </div>
                <span className="rounded-lg border border-[#A7F3D0] bg-[#EDF7F2] px-3 py-1 text-xs font-semibold text-[#0D3B2B] shrink-0">
                  Authenticated
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div className="rounded-lg border border-[#E6EFEA] bg-[#F8FCF9] p-4">
                  <dt className="text-xs font-medium text-[#4A6559]">Sign-In Provider</dt>
                  <dd className="mt-1 font-semibold text-[#0D3B2B]">
                    {user.providerData[0]?.providerId === 'google.com'
                      ? 'Google Sign-In'
                      : 'Email & Password'}
                  </dd>
                </div>
                <div className="rounded-lg border border-[#E6EFEA] bg-[#F8FCF9] p-4">
                  <dt className="text-xs font-medium text-[#4A6559]">Account UID</dt>
                  <dd className="mt-1 font-mono text-xs text-[#0D3B2B] truncate">{user.uid}</dd>
                </div>
              </dl>

              {authError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-900"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={authBusy}
                onClick={() => void logout()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0D3B2B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14533C] disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>{authBusy ? 'Signing out...' : 'Log Out'}</span>
              </button>
            </div>
          ) : (
            <AuthFormCard />
          )}
        </section>

        {/* Right Column: Firebase Environment Checklist */}
        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <KeyRound className="h-5 w-5 text-[#188055]" aria-hidden="true" />
              <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
                HealthCheck-Web Environment Keys
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#385447]">
              Ensure these environment variables from your Firebase project settings are configured in your environment and restart the app:
            </p>
            <div className="rounded-lg bg-[#F4FAF6] p-3 font-mono text-[11px] leading-relaxed text-[#0D3B2B]">
              VITE_FIREBASE_API_KEY<br />
              VITE_FIREBASE_AUTH_DOMAIN<br />
              VITE_FIREBASE_PROJECT_ID<br />
              VITE_FIREBASE_STORAGE_BUCKET<br />
              VITE_FIREBASE_MESSAGING_SENDER_ID<br />
              VITE_FIREBASE_APP_ID
            </div>
            <ol className="list-decimal space-y-2 pl-4 text-xs leading-relaxed text-[#385447]">
              <li>
                Keep <strong>Email/Password</strong> and <strong>Google</strong> enabled in Firebase Authentication.
              </li>
              <li>
                Add your preview and deployment hostnames under Firebase Console{' '}
                <strong>Authentication → Settings → Authorized domains</strong> so Google Sign-In works in browser popups.
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
