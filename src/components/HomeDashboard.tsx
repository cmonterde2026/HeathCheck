import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calculator,
  Droplets,
  HeartPulse,
  LogOut,
  Mail,
  Moon,
  Scale,
  Stethoscope,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BmiRecord, DailyWellnessLog, SectionId, WellnessTargets } from '../types/health';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface HomeDashboardProps {
  todayLog: DailyWellnessLog;
  targets: WellnessTargets;
  latestBmi: BmiRecord | null;
  onNavigate: (section: SectionId) => void;
}

const WELLNESS_HERO_IMAGE = '/src/assets/images/wellness_movement_rest_1795245291683.jpg';

export function HomeDashboard({
  todayLog,
  targets,
  latestBmi,
  onNavigate,
}: HomeDashboardProps) {
  const { user, displayName, logout, authBusy } = useAuth();
  const [imageFailed, setImageFailed] = useState(false);

  const totalActivityMinutes = todayLog.activities.reduce(
    (sum, item) => sum + item.durationMinutes,
    0
  );

  const features: Array<{
    id: SectionId;
    title: string;
    description: string;
    actionLabel: string;
    icon: typeof Stethoscope;
  }> = [
    {
      id: 'symptoms',
      title: 'Symptom Checker',
      description:
        'Select or enter current symptoms, answer quick follow-up questions, and review general self-care and safety guidance.',
      actionLabel: 'Check Symptoms',
      icon: Stethoscope,
    },
    {
      id: 'bmi',
      title: 'BMI Calculator',
      description:
        'Enter your weight in kilograms and height in centimeters to calculate your Body Mass Index and view standard screening categories.',
      actionLabel: 'Calculate BMI',
      icon: Calculator,
    },
    {
      id: 'wellness',
      title: 'Daily Wellness Tracker',
      description:
        'Log your daily water intake, sleeping hours, and physical activities to monitor personal habits against your goals.',
      actionLabel: 'Log Today’s Wellness',
      icon: Activity,
    },
    {
      id: 'tips',
      title: 'Health Tips',
      description:
        'Explore practical, everyday guidance on balanced nutrition, hydration, regular exercise, restorative sleep, and preventive care.',
      actionLabel: 'Read Health Tips',
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcoming Hero Split for Authenticated User */}
      <section className="overflow-hidden rounded-xl border border-[#DCE7E0] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#3E5C4E]">
                <span>Personal Health Monitoring System</span>
                <span aria-hidden="true">·</span>
                <span>Authenticated Session</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#0D3B2B] sm:text-3xl text-balance">
                  Welcome back, {displayName}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-[#385447] sm:text-base">
                  Monitor your daily hydration, rest, and movement, calculate your BMI, review general symptom safety information, and build steady everyday wellness habits.
                </p>
              </div>

              {/* Logged-in User Name, Email & Logout Action */}
              {user && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#DCE7E0] bg-[#F5FAF7] px-4 py-3">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0D3B2B]">
                      <UserCheck className="h-4 w-4 shrink-0 text-[#188055]" aria-hidden="true" />
                      <span className="truncate">{displayName}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center gap-2 text-xs text-[#4A6559]">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-[#5B776A]" aria-hidden="true" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={() => void logout()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6DAD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0D3B2B] transition-colors hover:bg-[#E8F5EE] disabled:opacity-60 whitespace-nowrap shrink-0"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{authBusy ? 'Signing out...' : 'Log Out'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[#E8F0EB]">
              <button
                type="button"
                onClick={() => onNavigate('wellness')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0D3B2B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14533C] whitespace-nowrap shrink-0"
              >
                <span>Open Wellness Tracker</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('symptoms')}
                className="inline-flex items-center gap-2 rounded-lg border border-[#C6DAD0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D3B2B] transition-colors hover:bg-[#EDF7F2] whitespace-nowrap shrink-0"
              >
                <span>Start Symptom Check</span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] lg:col-span-5 bg-[#E6F2EC]">
            {!imageFailed ? (
              <img
                src={WELLNESS_HERO_IMAGE}
                alt="Sunlit personal wellness space with indoor greenery and calm natural light"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover lg:absolute lg:inset-0"
              />
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center bg-gradient-to-br from-[#0D3B2B] to-[#1D6A4E] p-6 text-center text-white">
                <HeartPulse className="h-10 w-10 text-[#A7F3D0]" aria-hidden="true" />
                <p className="mt-2 font-display text-base font-semibold">HealthCheck Daily Space</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Today's Logged Snapshot (Real User-Entered State Only) */}
      <section aria-labelledby="today-snapshot-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3
            id="today-snapshot-heading"
            className="font-display text-lg font-semibold text-[#0D3B2B]"
          >
            Your Logged Health Snapshot
          </h3>
          <span className="text-xs text-[#4A6559]">
            Displays values you have recorded today · Starts empty until logged
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Water */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#4A6559]">
                <span>Water Intake</span>
                <Droplets className="h-4 w-4 text-[#188055]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-[#0D3B2B] tabular-nums">
                {todayLog.waterMl > 0 ? `${todayLog.waterMl} ml` : '0 ml'}
              </p>
              <p className="mt-1 text-xs text-[#4A6559] tabular-nums">
                {todayLog.waterMl > 0
                  ? `Goal: ${targets.waterMl} ml (${Math.min(100, Math.round((todayLog.waterMl / targets.waterMl) * 100))}%)`
                  : `Not logged yet · Goal ${targets.waterMl} ml`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('wellness')}
              className="mt-4 text-left text-xs font-semibold text-[#16734D] hover:text-[#0D3B2B]"
            >
              Update water log →
            </button>
          </div>

          {/* Sleep */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#4A6559]">
                <span>Sleeping Hours</span>
                <Moon className="h-4 w-4 text-[#188055]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-[#0D3B2B] tabular-nums">
                {todayLog.sleepHours !== null ? `${todayLog.sleepHours} hrs` : '—'}
              </p>
              <p className="mt-1 text-xs text-[#4A6559] tabular-nums">
                {todayLog.sleepHours !== null
                  ? `Quality: ${todayLog.sleepQuality ?? 'Recorded'} · Goal ${targets.sleepHours} hrs`
                  : `Not logged yet · Goal ${targets.sleepHours} hrs`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('wellness')}
              className="mt-4 text-left text-xs font-semibold text-[#16734D] hover:text-[#0D3B2B]"
            >
              Log sleep hours →
            </button>
          </div>

          {/* Activity */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#4A6559]">
                <span>Physical Activity</span>
                <Activity className="h-4 w-4 text-[#188055]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-[#0D3B2B] tabular-nums">
                {totalActivityMinutes > 0 ? `${totalActivityMinutes} min` : '0 min'}
              </p>
              <p className="mt-1 text-xs text-[#4A6559] tabular-nums">
                {todayLog.activities.length > 0
                  ? `${todayLog.activities.length} session${todayLog.activities.length === 1 ? '' : 's'} · Goal ${targets.activityMinutes} min`
                  : `No activities logged · Goal ${targets.activityMinutes} min`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('wellness')}
              className="mt-4 text-left text-xs font-semibold text-[#16734D] hover:text-[#0D3B2B]"
            >
              Add activity →
            </button>
          </div>

          {/* BMI */}
          <div className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#4A6559]">
                <span>Latest Saved BMI</span>
                <Scale className="h-4 w-4 text-[#188055]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-[#0D3B2B] tabular-nums">
                {latestBmi ? latestBmi.bmi.toFixed(1) : '—'}
              </p>
              <p className="mt-1 text-xs text-[#4A6559]">
                {latestBmi
                  ? `${latestBmi.category} · ${latestBmi.weightKg} kg / ${latestBmi.heightCm} cm`
                  : 'No BMI calculation saved yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bmi')}
              className="mt-4 text-left text-xs font-semibold text-[#16734D] hover:text-[#0D3B2B]"
            >
              Open BMI calculator →
            </button>
          </div>
        </div>
      </section>

      {/* Health Monitoring Features Directory */}
      <section aria-labelledby="features-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="features-heading" className="font-display text-lg font-semibold text-[#0D3B2B]">
            Health Monitoring Tools
          </h3>
          <span className="text-xs text-[#4A6559]">Select any module to get started</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-6 transition-colors hover:border-[#A8CBB8]"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F5EE] text-[#0D3B2B]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h4 className="font-display text-base font-semibold text-[#0D3B2B]">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-[#385447]">{feature.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#EDF3EF]">
                  <button
                    type="button"
                    onClick={() => onNavigate(feature.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#EDF7F2] px-4 py-2 text-sm font-semibold text-[#0D3B2B] transition-colors hover:bg-[#D7ECE0] whitespace-nowrap shrink-0"
                  >
                    <span>{feature.actionLabel}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MedicalDisclaimer
        body="HealthCheck is designed for personal wellness tracking and general health education. It does not diagnose medical conditions, prescribe treatments, or replace advice from a licensed healthcare professional. If you are experiencing severe or emergency symptoms, seek immediate medical care."
      />
    </div>
  );
}
