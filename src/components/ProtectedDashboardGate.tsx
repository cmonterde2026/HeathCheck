import {
  Activity,
  ArrowRight,
  BookOpen,
  Calculator,
  Lock,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SectionId } from '../types/health';
import { AuthFormCard } from './AuthFormCard';

interface ProtectedDashboardGateProps {
  onNavigate: (section: SectionId) => void;
}

export function ProtectedDashboardGate({ onNavigate }: ProtectedDashboardGateProps) {
  const { isFirebaseConfigured, missingFirebaseKeys } = useAuth();

  const publicTools: Array<{
    id: SectionId;
    title: string;
    description: string;
    icon: typeof Stethoscope;
  }> = [
    {
      id: 'symptoms',
      title: 'Symptom Checker',
      description: 'Review general health guidance and safety checks.',
      icon: Stethoscope,
    },
    {
      id: 'bmi',
      title: 'BMI Calculator',
      description: 'Calculate Body Mass Index using kg and cm.',
      icon: Calculator,
    },
    {
      id: 'wellness',
      title: 'Daily Wellness Tracker',
      description: 'Record daily water, sleep, and physical activity.',
      icon: Activity,
    },
    {
      id: 'tips',
      title: 'Health Tips',
      description: 'Read nutrition, hydration, exercise, and sleep guides.',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Protected Access Notice */}
      <section className="rounded-xl border border-[#CFE0D6] bg-[#EDF7F2] p-5 text-[#0D3B2B]">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0D3B2B] text-white">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-[#0D3B2B]">
              Personal Health Dashboard — Sign In Required
            </h2>
            <p className="text-sm leading-relaxed text-[#2F4E3F]">
              Your personal dashboard is protected. Sign in with your Firebase Email/Password account or Google account to view your profile summary, name, email, and personal health overview.
            </p>
          </div>
        </div>
      </section>

      {!isFirebaseConfigured && (
        <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold">
                Firebase Environment Variables Required
              </p>
              <p className="leading-relaxed text-amber-900">
                Add your Firebase Web App credentials for <span className="font-semibold">HealthCheck-Web</span> so live authentication can connect. Missing keys:
              </p>
              <p className="font-mono text-xs text-amber-900">
                {missingFirebaseKeys.join(', ')}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 sm:p-8 lg:col-span-7">
          <AuthFormCard />
        </section>

        <aside className="space-y-4 rounded-xl border border-[#DCE7E0] bg-white p-6 lg:col-span-5">
          <div>
            <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
              HealthCheck Tools
            </h3>
            <p className="mt-1 text-xs text-[#4A6559]">
              You can still open these health tools directly while signing in to unlock your personal dashboard.
            </p>
          </div>

          <div className="space-y-2.5">
            {publicTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(tool.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-[#E2ECE6] bg-[#F8FCF9] p-3.5 text-left transition-colors hover:border-[#A8CBB8] hover:bg-[#EDF7F2]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-[#DCE7E0] text-[#0D3B2B]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D3B2B] truncate">
                        {tool.title}
                      </p>
                      <p className="text-xs text-[#4A6559] truncate">{tool.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#188055]" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
