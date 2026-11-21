import {
  Activity,
  BookOpen,
  Calculator,
  HeartPulse,
  LayoutDashboard,
  Lock,
  LogOut,
  ShieldCheck,
  Stethoscope,
  UserCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SectionId } from '../types/health';

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: SectionId;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
  { id: 'symptoms', label: 'Symptom Checker', icon: Stethoscope },
  { id: 'bmi', label: 'BMI Calculator', icon: Calculator },
  { id: 'wellness', label: 'Wellness Tracker', icon: Activity },
  { id: 'tips', label: 'Health Tips', icon: BookOpen },
  { id: 'account', label: 'User Account', icon: UserCircle2 },
];

export function Sidebar({
  activeSection,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { user, displayName, logout, authBusy } = useAuth();

  const handleSelect = (id: SectionId) => {
    onNavigate(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-[#0D3B2B] text-white">
      <div>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86EFAC] rounded-md"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A6349] text-[#A7F3D0]">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
              HealthCheck
            </span>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-emerald-100/80 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-5 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isProtectedUnauthed = item.id === 'dashboard' && !user;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86EFAC] ${
                  isActive
                    ? 'bg-[#175B43] text-white'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#A7F3D0]' : 'text-emerald-200/75'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {isProtectedUnauthed && (
                  <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-200/70" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-5 space-y-3">
        {user && (
          <div className="rounded-lg bg-white/10 p-3 border border-white/10 space-y-2.5">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              {user.email && (
                <p className="text-[11px] text-emerald-100/75 truncate">{user.email}</p>
              )}
            </div>
            <button
              type="button"
              disabled={authBusy}
              onClick={() => void logout()}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{authBusy ? 'Signing out...' : 'Log Out'}</span>
            </button>
          </div>
        )}

        <div className="rounded-lg bg-white/5 p-3.5 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A7F3D0]">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Personal Monitoring Only</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/80">
            Educational self-tracking tool. Always consult a qualified healthcare professional for medical advice or diagnosis.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 border-r border-[#0B3023]">
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-[#082218]/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
