import { useState } from 'react';
import {
  Activity,
  Droplets,
  Minus,
  Moon,
  Plus,
  Settings2,
  Trash2,
} from 'lucide-react';
import { getTodayDateString } from '../hooks/useHealthStore';
import {
  ActivityEntry,
  DailyWellnessLog,
  SleepQuality,
  WellnessTargets,
} from '../types/health';

interface WellnessTrackerProps {
  targets: WellnessTargets;
  recentLoggedDays: DailyWellnessLog[];
  getLogForDate: (date: string) => DailyWellnessLog;
  onAdjustWater: (date: string, deltaMl: number) => void;
  onSetWaterExact: (date: string, ml: number) => void;
  onLogSleep: (date: string, hours: number, quality: SleepQuality) => void;
  onAddActivity: (
    date: string,
    type: string,
    durationMinutes: number,
    intensity: ActivityEntry['intensity']
  ) => void;
  onRemoveActivity: (date: string, activityId: string) => void;
  onUpdateTargets: (next: Partial<WellnessTargets>) => void;
}

const ACTIVITY_TYPES = [
  'Brisk Walking',
  'Running / Jogging',
  'Cycling',
  'Strength Training',
  'Yoga / Stretching',
  'Swimming',
  'Sports / Cardio',
  'Household Movement',
];

export function WellnessTracker({
  targets,
  recentLoggedDays,
  getLogForDate,
  onAdjustWater,
  onSetWaterExact,
  onLogSleep,
  onAddActivity,
  onRemoveActivity,
  onUpdateTargets,
}: WellnessTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const log = getLogForDate(selectedDate);

  // Water custom input
  const [customWaterMl, setCustomWaterMl] = useState('250');

  // Sleep form state
  const [sleepHoursInput, setSleepHoursInput] = useState<string>(
    log.sleepHours !== null ? String(log.sleepHours) : '7.5'
  );
  const [sleepQualityInput, setSleepQualityInput] = useState<SleepQuality>(
    log.sleepQuality ?? 'Rested'
  );

  // Activity form state
  const [activityType, setActivityType] = useState(ACTIVITY_TYPES[0]);
  const [activityMinutes, setActivityMinutes] = useState('30');
  const [activityIntensity, setActivityIntensity] =
    useState<ActivityEntry['intensity']>('Moderate');

  // Target settings toggle
  const [showTargetsForm, setShowTargetsForm] = useState(false);
  const [targetWater, setTargetWater] = useState(String(targets.waterMl));
  const [targetSleep, setTargetSleep] = useState(String(targets.sleepHours));
  const [targetActivity, setTargetActivity] = useState(String(targets.activityMinutes));

  const totalActivityMinutes = log.activities.reduce(
    (sum, item) => sum + item.durationMinutes,
    0
  );

  const waterProgressPct = Math.min(100, Math.round((log.waterMl / targets.waterMl) * 100));
  const sleepProgressPct =
    log.sleepHours !== null
      ? Math.min(100, Math.round((log.sleepHours / targets.sleepHours) * 100))
      : 0;
  const activityProgressPct = Math.min(
    100,
    Math.round((totalActivityMinutes / targets.activityMinutes) * 100)
  );

  const handleDateChange = (nextDate: string) => {
    setSelectedDate(nextDate);
    const nextLog = getLogForDate(nextDate);
    setSleepHoursInput(nextLog.sleepHours !== null ? String(nextLog.sleepHours) : '7.5');
    setSleepQualityInput(nextLog.sleepQuality ?? 'Rested');
  };

  const handleAddCustomWater = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customWaterMl, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      onAdjustWater(selectedDate, parsed);
    }
  };

  const handleSleepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(sleepHoursInput);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 24) return;
    onLogSleep(selectedDate, parsed, sleepQualityInput);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(activityMinutes, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onAddActivity(selectedDate, activityType, parsed, activityIntensity);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTargets({
      waterMl: parseInt(targetWater, 10) || targets.waterMl,
      sleepHours: parseFloat(targetSleep) || targets.sleepHours,
      activityMinutes: parseInt(targetActivity, 10) || targets.activityMinutes,
    });
    setShowTargetsForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Date + Goal Customization */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DCE7E0] bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="wellness-date" className="text-sm font-semibold text-[#0D3B2B]">
            Tracking Date
          </label>
          <input
            id="wellness-date"
            type="date"
            max={getTodayDateString()}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 font-mono text-sm text-[#0D3B2B] focus:border-[#188055] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowTargetsForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#CFE0D6] bg-[#F5FAF7] px-3.5 py-2 text-sm font-medium text-[#0D3B2B] hover:bg-[#E4F2EA] whitespace-nowrap shrink-0"
        >
          <Settings2 className="h-4 w-4 text-[#188055]" aria-hidden="true" />
          <span>{showTargetsForm ? 'Close Daily Goals' : 'Customize Daily Goals'}</span>
        </button>
      </section>

      {showTargetsForm && (
        <form
          onSubmit={handleSaveTargets}
          className="rounded-xl border border-[#CFE0D6] bg-[#F5FAF7] p-5 space-y-4"
        >
          <p className="font-display text-sm font-semibold text-[#0D3B2B]">
            Personal Daily Wellness Targets
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="goal-water" className="block text-xs font-medium text-[#385447]">
                Daily Water Goal (ml)
              </label>
              <input
                id="goal-water"
                type="number"
                min={500}
                max={6000}
                step={100}
                value={targetWater}
                onChange={(e) => setTargetWater(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 font-mono text-sm text-[#0D3B2B]"
              />
            </div>
            <div>
              <label htmlFor="goal-sleep" className="block text-xs font-medium text-[#385447]">
                Daily Sleep Goal (hours)
              </label>
              <input
                id="goal-sleep"
                type="number"
                min={4}
                max={12}
                step={0.5}
                value={targetSleep}
                onChange={(e) => setTargetSleep(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 font-mono text-sm text-[#0D3B2B]"
              />
            </div>
            <div>
              <label htmlFor="goal-activity" className="block text-xs font-medium text-[#385447]">
                Daily Activity Goal (minutes)
              </label>
              <input
                id="goal-activity"
                type="number"
                min={10}
                max={240}
                step={5}
                value={targetActivity}
                onChange={(e) => setTargetActivity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 font-mono text-sm text-[#0D3B2B]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#0D3B2B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14533C]"
            >
              Save Daily Targets
            </button>
          </div>
        </form>
      )}

      {/* Daily Progress Overview Bar */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#DCE7E0] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A6559]">Hydration Progress</span>
            <span className="font-mono text-xs font-semibold text-[#0D3B2B] tabular-nums">
              {waterProgressPct}%
            </span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#0D3B2B] tabular-nums">
            {log.waterMl} <span className="text-sm font-normal text-[#4A6559]">/ {targets.waterMl} ml</span>
          </p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E6EFEA]">
            <div
              className="h-full rounded-full bg-[#188055] transition-all"
              style={{ width: `${waterProgressPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#DCE7E0] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A6559]">Sleep Progress</span>
            <span className="font-mono text-xs font-semibold text-[#0D3B2B] tabular-nums">
              {log.sleepHours !== null ? `${sleepProgressPct}%` : 'Not logged'}
            </span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#0D3B2B] tabular-nums">
            {log.sleepHours !== null ? log.sleepHours : '—'}{' '}
            <span className="text-sm font-normal text-[#4A6559]">/ {targets.sleepHours} hrs</span>
          </p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E6EFEA]">
            <div
              className="h-full rounded-full bg-[#0D3B2B] transition-all"
              style={{ width: `${sleepProgressPct}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#DCE7E0] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A6559]">Activity Progress</span>
            <span className="font-mono text-xs font-semibold text-[#0D3B2B] tabular-nums">
              {activityProgressPct}%
            </span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#0D3B2B] tabular-nums">
            {totalActivityMinutes}{' '}
            <span className="text-sm font-normal text-[#4A6559]">/ {targets.activityMinutes} min</span>
          </p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E6EFEA]">
            <div
              className="h-full rounded-full bg-[#259B68] transition-all"
              style={{ width: `${activityProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Three Functional Logging Modules */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Water Intake */}
        <section className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF7F2] text-[#0D3B2B]">
                <Droplets className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
                  Water Intake
                </h3>
                <p className="text-xs text-[#4A6559]">
                  {Math.round((log.waterMl / 250) * 10) / 10} standard 250 ml glasses
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onAdjustWater(selectedDate, -250)}
                disabled={log.waterMl <= 0}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#DCE7E0] px-2.5 py-2 text-xs font-semibold text-[#2F4E3F] hover:bg-[#F3F8F5] disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>250 ml</span>
              </button>
              <button
                type="button"
                onClick={() => onAdjustWater(selectedDate, 250)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0D3B2B] px-2.5 py-2 text-xs font-semibold text-white hover:bg-[#14533C]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>250 ml</span>
              </button>
              <button
                type="button"
                onClick={() => onAdjustWater(selectedDate, 500)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#EDF7F2] px-2.5 py-2 text-xs font-semibold text-[#0D3B2B] hover:bg-[#D7ECE0]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>500 ml</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomWater} className="space-y-2">
              <label htmlFor="custom-water-input" className="block text-xs font-medium text-[#385447]">
                Add custom amount (ml)
              </label>
              <div className="flex gap-2">
                <input
                  id="custom-water-input"
                  type="number"
                  min={50}
                  max={3000}
                  step={50}
                  value={customWaterMl}
                  onChange={(e) => setCustomWaterMl(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-[#CFE0D6] px-3 py-2 font-mono text-sm text-[#0D3B2B]"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-[#0D3B2B] px-3.5 py-2 text-xs font-semibold text-[#0D3B2B] hover:bg-[#EDF7F2] whitespace-nowrap shrink-0"
                >
                  Add ml
                </button>
              </div>
            </form>
          </div>

          {log.waterMl > 0 && (
            <button
              type="button"
              onClick={() => onSetWaterExact(selectedDate, 0)}
              className="text-left text-xs font-medium text-[#5B776A] hover:text-red-700"
            >
              Reset water for this date
            </button>
          )}
        </section>

        {/* 2. Sleeping Hours */}
        <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF7F2] text-[#0D3B2B]">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
                Sleeping Hours
              </h3>
              <p className="text-xs text-[#4A6559]">
                {log.sleepHours !== null
                  ? `Logged: ${log.sleepHours} hrs (${log.sleepQuality})`
                  : 'Not recorded for this date'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSleepSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="sleep-hours-input" className="text-xs font-medium text-[#385447]">
                  Hours Slept
                </label>
                <span className="font-mono text-xs font-semibold text-[#0D3B2B] tabular-nums">
                  {sleepHoursInput} hrs
                </span>
              </div>
              <input
                id="sleep-hours-input"
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={sleepHoursInput}
                onChange={(e) => setSleepHoursInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#CFE0D6] px-3 py-2 font-mono text-sm text-[#0D3B2B]"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-[#385447]">Sleep Quality</span>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(['Rested', 'Fair', 'Restless'] as const).map((quality) => (
                  <button
                    key={quality}
                    type="button"
                    onClick={() => setSleepQualityInput(quality)}
                    className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                      sleepQualityInput === quality
                        ? 'border-[#0D3B2B] bg-[#0D3B2B] text-white'
                        : 'border-[#DCE7E0] bg-white text-[#2F4E3F] hover:bg-[#F3F8F5]'
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#0D3B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14533C]"
            >
              Save Sleep Log
            </button>
          </form>
        </section>

        {/* 3. Physical Activities */}
        <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EDF7F2] text-[#0D3B2B]">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
                Physical Activities
              </h3>
              <p className="text-xs text-[#4A6559]">
                {log.activities.length} session{log.activities.length === 1 ? '' : 's'} logged today
              </p>
            </div>
          </div>

          <form onSubmit={handleActivitySubmit} className="space-y-3">
            <div>
              <label htmlFor="activity-type" className="block text-xs font-medium text-[#385447]">
                Activity Type
              </label>
              <select
                id="activity-type"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 text-sm text-[#0D3B2B]"
              >
                {ACTIVITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="activity-duration" className="block text-xs font-medium text-[#385447]">
                  Duration (min)
                </label>
                <input
                  id="activity-duration"
                  type="number"
                  min={1}
                  max={600}
                  value={activityMinutes}
                  onChange={(e) => setActivityMinutes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#CFE0D6] px-3 py-2 font-mono text-sm text-[#0D3B2B]"
                />
              </div>

              <div>
                <label htmlFor="activity-intensity" className="block text-xs font-medium text-[#385447]">
                  Intensity
                </label>
                <select
                  id="activity-intensity"
                  value={activityIntensity}
                  onChange={(e) =>
                    setActivityIntensity(e.target.value as ActivityEntry['intensity'])
                  }
                  className="mt-1 w-full rounded-lg border border-[#CFE0D6] bg-white px-3 py-2 text-sm text-[#0D3B2B]"
                >
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Vigorous">Vigorous</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#0D3B2B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14533C]"
            >
              Add Activity
            </button>
          </form>

          {log.activities.length > 0 && (
            <div className="border-t border-[#E8F0EB] pt-3 space-y-2">
              {log.activities.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[#E6EFEA] bg-[#F8FCF9] px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0D3B2B] truncate">{entry.type}</p>
                    <p className="text-[#4A6559] font-mono tabular-nums">
                      {entry.durationMinutes} min · {entry.intensity}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveActivity(selectedDate, entry.id)}
                    aria-label={`Remove ${entry.type}`}
                    className="rounded p-1 text-[#5B776A] hover:bg-red-50 hover:text-red-700 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent Logged Days Table */}
      <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
            Recent Logged Days
          </h3>
          <span className="text-xs text-[#4A6559]">
            Only dates where you recorded wellness entries appear here
          </span>
        </div>

        {recentLoggedDays.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#CFE0D6] bg-[#F8FCF9] p-6 text-center text-sm text-[#4A6559]">
            No daily wellness entries recorded yet. Log water, sleep, or physical activity above to see your history.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4EDE8] text-xs font-semibold text-[#4A6559]">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 pr-4 text-right">Water</th>
                  <th className="py-2.5 pr-4 text-right">Sleep</th>
                  <th className="py-2.5 pr-4">Quality</th>
                  <th className="py-2.5 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFF5F1]">
                {recentLoggedDays.map((day) => {
                  const mins = day.activities.reduce((s, a) => s + a.durationMinutes, 0);
                  return (
                    <tr
                      key={day.date}
                      onClick={() => handleDateChange(day.date)}
                      className="cursor-pointer hover:bg-[#F5FAF7]"
                    >
                      <td className="py-3 pr-4 font-mono text-xs font-medium text-[#0D3B2B]">
                        {day.date}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-[#0D3B2B] tabular-nums">
                        {day.waterMl} ml
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-[#0D3B2B] tabular-nums">
                        {day.sleepHours !== null ? `${day.sleepHours} hrs` : '—'}
                      </td>
                      <td className="py-3 pr-4 text-xs text-[#385447]">
                        {day.sleepQuality ?? '—'}
                      </td>
                      <td className="py-3 text-right font-mono text-[#0D3B2B] tabular-nums">
                        {mins} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
