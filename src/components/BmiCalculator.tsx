import { useMemo, useState } from 'react';
import { BookmarkPlus, CheckCircle2, Info, Scale, Trash2 } from 'lucide-react';
import { BmiRecord } from '../types/health';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface BmiCalculatorProps {
  bmiHistory: BmiRecord[];
  onSaveRecord: (record: Omit<BmiRecord, 'id' | 'recordedAt'>) => void;
  onDeleteRecord: (id: string) => void;
}

function classifyBmi(bmi: number): BmiRecord['category'] {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

const CATEGORY_DETAILS: Record<
  BmiRecord['category'],
  {
    range: string;
    note: string;
    badgeClasses: string;
  }
> = {
  Underweight: {
    range: 'Below 18.5',
    note: 'BMI falls below the standard adult reference range. Consider reviewing nutrition and health history with a clinician.',
    badgeClasses: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  'Normal weight': {
    range: '18.5 – 24.9',
    note: 'BMI falls within the standard adult reference range associated with lower population-level weight-related risks.',
    badgeClasses: 'border-[#A7F3D0] bg-[#EDF7F2] text-[#0D3B2B]',
  },
  Overweight: {
    range: '25.0 – 29.9',
    note: 'BMI falls above the standard adult reference range. Muscle mass, frame size, and waist circumference provide important additional context.',
    badgeClasses: 'border-amber-300 bg-amber-50 text-amber-900',
  },
  Obesity: {
    range: '30.0 and above',
    note: 'BMI falls in the elevated screening category. A healthcare professional can evaluate overall metabolic health, body composition, and personalized goals.',
    badgeClasses: 'border-orange-300 bg-orange-50 text-orange-950',
  },
};

export function BmiCalculator({
  bmiHistory,
  onSaveRecord,
  onDeleteRecord,
}: BmiCalculatorProps) {
  const [weightInput, setWeightInput] = useState<string>('68');
  const [heightInput, setHeightInput] = useState<string>('170');
  const [savedNotice, setSavedNotice] = useState(false);

  const calculation = useMemo(() => {
    const weightKg = parseFloat(weightInput);
    const heightCm = parseFloat(heightInput);

    if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) {
      return { valid: false as const, error: 'Enter numeric values for weight and height.' };
    }
    if (weightKg < 20 || weightKg > 350) {
      return {
        valid: false as const,
        error: 'Please enter a realistic weight between 20 kg and 350 kg.',
      };
    }
    if (heightCm < 80 || heightCm > 250) {
      return {
        valid: false as const,
        error: 'Please enter a realistic height between 80 cm and 250 cm.',
      };
    }

    const heightM = heightCm / 100;
    const rawBmi = weightKg / (heightM * heightM);
    const bmi = Math.round(rawBmi * 10) / 10;
    const category = classifyBmi(bmi);

    // Marker position across scale 14 -> 38
    const clampedForScale = Math.max(14, Math.min(38, bmi));
    const markerPercent = ((clampedForScale - 14) / (38 - 14)) * 100;

    return {
      valid: true as const,
      weightKg,
      heightCm,
      bmi,
      category,
      markerPercent,
    };
  }, [weightInput, heightInput]);

  const handleSave = () => {
    if (!calculation.valid) return;
    onSaveRecord({
      weightKg: calculation.weightKg,
      heightCm: calculation.heightCm,
      bmi: calculation.bmi,
      category: calculation.category,
    });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Form */}
        <section className="space-y-5 rounded-xl border border-[#DCE7E0] bg-white p-6 lg:col-span-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0D3B2B]">
              Enter Measurements
            </h2>
            <p className="mt-1 text-sm text-[#4A6559]">
              BMI updates automatically as you enter your weight in kilograms and height in centimeters.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="bmi-weight" className="text-sm font-semibold text-[#0D3B2B]">
                  Weight (kg)
                </label>
                <span className="font-mono text-xs text-[#4A6559] tabular-nums">
                  {weightInput || '0'} kg
                </span>
              </div>
              <input
                id="bmi-weight"
                type="number"
                min={20}
                max={350}
                step="0.5"
                value={weightInput}
                onChange={(e) => {
                  setWeightInput(e.target.value);
                  setSavedNotice(false);
                }}
                className="mt-1.5 w-full rounded-lg border border-[#CFE0D6] bg-white px-3.5 py-2.5 font-mono text-base text-[#0D3B2B] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
              />
              <input
                type="range"
                min={30}
                max={180}
                step={0.5}
                aria-label="Adjust weight in kilograms"
                value={Number.isFinite(parseFloat(weightInput)) ? Math.min(180, Math.max(30, parseFloat(weightInput))) : 68}
                onChange={(e) => {
                  setWeightInput(e.target.value);
                  setSavedNotice(false);
                }}
                className="mt-2.5 w-full accent-[#0D3B2B]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="bmi-height" className="text-sm font-semibold text-[#0D3B2B]">
                  Height (cm)
                </label>
                <span className="font-mono text-xs text-[#4A6559] tabular-nums">
                  {heightInput || '0'} cm
                </span>
              </div>
              <input
                id="bmi-height"
                type="number"
                min={80}
                max={250}
                step="0.5"
                value={heightInput}
                onChange={(e) => {
                  setHeightInput(e.target.value);
                  setSavedNotice(false);
                }}
                className="mt-1.5 w-full rounded-lg border border-[#CFE0D6] bg-white px-3.5 py-2.5 font-mono text-base text-[#0D3B2B] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
              />
              <input
                type="range"
                min={120}
                max={220}
                step={0.5}
                aria-label="Adjust height in centimeters"
                value={Number.isFinite(parseFloat(heightInput)) ? Math.min(220, Math.max(120, parseFloat(heightInput))) : 170}
                onChange={(e) => {
                  setHeightInput(e.target.value);
                  setSavedNotice(false);
                }}
                className="mt-2.5 w-full accent-[#0D3B2B]"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={!calculation.valid}
                onClick={handleSave}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D3B2B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#14533C] disabled:cursor-not-allowed disabled:bg-[#A6BFB3]"
              >
                {savedNotice ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Saved to Measurement Log</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                    <span>Save Measurement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Automatic Result & Visual Scale */}
        <section className="space-y-6 rounded-xl border border-[#DCE7E0] bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[#0D3B2B]">
              BMI Result & Screening Category
            </h2>
            <Scale className="h-5 w-5 text-[#188055]" aria-hidden="true" />
          </div>

          {calculation.valid ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DCE7E0] bg-[#F7FBF9] p-5">
                <div>
                  <p className="text-xs font-medium text-[#4A6559]">Calculated Body Mass Index</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-bold text-[#0D3B2B] tabular-nums">
                      {calculation.bmi.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-[#4A6559]">kg/m²</span>
                  </div>
                </div>

                <div
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                    CATEGORY_DETAILS[calculation.category].badgeClasses
                  }`}
                >
                  {calculation.category} ({CATEGORY_DETAILS[calculation.category].range})
                </div>
              </div>

              {/* Scale visualization */}
              <div className="space-y-2">
                <div className="relative h-3 w-full overflow-hidden rounded-md bg-[#E6EFEA] flex">
                  <div className="h-full bg-amber-300" style={{ width: '18.75%' }} title="Underweight (<18.5)" />
                  <div className="h-full bg-[#188055]" style={{ width: '27.08%' }} title="Normal weight (18.5–24.9)" />
                  <div className="h-full bg-amber-400" style={{ width: '20.83%' }} title="Overweight (25.0–29.9)" />
                  <div className="h-full bg-orange-400" style={{ width: '33.34%' }} title="Obesity (30.0+)" />
                </div>
                <div className="relative h-4">
                  <div
                    className="absolute -top-5 -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${calculation.markerPercent}%` }}
                  >
                    <div className="h-5 w-1 rounded bg-[#0D3B2B]" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] font-medium text-[#4A6559] tabular-nums">
                  <div>Underweight &lt;18.5</div>
                  <div>Normal 18.5–24.9</div>
                  <div>Overweight 25–29.9</div>
                  <div className="text-right">Obesity ≥30</div>
                </div>
              </div>

              <div className="rounded-lg border border-[#E2ECE6] bg-white p-4 text-sm leading-relaxed text-[#2F4E3F]">
                <div className="flex items-start gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#188055]" aria-hidden="true" />
                  <p>{CATEGORY_DETAILS[calculation.category].note}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {calculation.error}
            </div>
          )}
        </section>
      </div>

      {/* Saved BMI History */}
      <section className="rounded-xl border border-[#DCE7E0] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
            Saved BMI Measurements
          </h3>
          <span className="text-xs text-[#4A6559]">Stored locally in your browser</span>
        </div>

        {bmiHistory.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#CFE0D6] bg-[#F8FCF9] p-6 text-center text-sm text-[#4A6559]">
            No BMI measurements saved yet. Click "Save Measurement" above to keep a personal record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E4EDE8] text-xs font-semibold text-[#4A6559]">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 pr-4 text-right">Weight</th>
                  <th className="py-2.5 pr-4 text-right">Height</th>
                  <th className="py-2.5 pr-4 text-right">BMI</th>
                  <th className="py-2.5 pr-4">Category</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFF5F1]">
                {bmiHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FCF9]">
                    <td className="py-3 pr-4 text-xs text-[#385447] whitespace-nowrap">
                      {new Date(item.recordedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[#0D3B2B] tabular-nums">
                      {item.weightKg} kg
                    </td>
                    <td className="py-3 pr-4 text-right font-mono text-[#0D3B2B] tabular-nums">
                      {item.heightCm} cm
                    </td>
                    <td className="py-3 pr-4 text-right font-mono font-semibold text-[#0D3B2B] tabular-nums">
                      {item.bmi.toFixed(1)}
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium text-[#2F4E3F]">
                      {item.category}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(item.id)}
                        aria-label={`Delete BMI record from ${item.recordedAt}`}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-[#5B776A] hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <MedicalDisclaimer
        title="Educational Screening Disclaimer"
        body="Body Mass Index (BMI) is a simple height-to-weight screening calculation for adults (ages 20+) and is not a diagnostic measure of body fatness or overall health. It does not distinguish between muscle mass and fat mass, nor does it account for age, sex, ethnicity, pregnancy, or individual clinical factors. Discuss your measurements with a qualified healthcare professional."
      />
    </div>
  );
}
