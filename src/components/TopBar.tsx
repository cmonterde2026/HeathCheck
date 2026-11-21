import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SectionId } from '../types/health';

interface TopBarProps {
  activeSection: SectionId;
  onOpenMobileMenu: () => void;
  onNavigateAccount: () => void;
}

const SECTION_TITLES: Record<SectionId, string> = {
  dashboard: 'Home Dashboard',
  symptoms: 'Symptom Checker',
  bmi: 'BMI Calculator',
  wellness: 'Daily Wellness Tracker',
  tips: 'Health Tips',
  account: 'User Account',
};

export function TopBar({
  activeSection,
  onOpenMobileMenu,
  onNavigateAccount,
}: TopBarProps) {
  const { user, displayName } = useAuth();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#DCE7E0] bg-white/95 px-4 py-3.5 backdrop-blur-xs sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE7E0] text-[#10261D] hover:bg-[#EDF7F2] lg:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="font-display text-lg font-semibold tracking-tight text-[#0D3B2B] truncate sm:text-xl">
          {SECTION_TITLES[activeSection]}
        </h1>
      </div>

      <div className="hidden md:block text-xs font-medium text-[#4A6559] whitespace-nowrap">
        {formattedDate}
      </div>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onNavigateAccount}
          className="inline-flex items-center gap-2 rounded-lg border border-[#CFE0D6] bg-[#F4FAF6] px-3.5 py-2 text-sm font-medium text-[#0D3B2B] transition-colors hover:bg-[#E4F2EA] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#188055]"
        >
          <User className="h-4 w-4 text-[#188055] shrink-0" aria-hidden="true" />
          <span className="max-w-[160px] truncate">
            {user ? displayName : 'Sign In'}
          </span>
        </button>
      </div>
    </header>
  );
}
