import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Info,
  Plus,
  RotateCcw,
  Search,
  Stethoscope,
  X,
} from 'lucide-react';
import { SYMPTOM_CATALOG } from '../data/healthData';
import { SymptomCategory, SymptomItem } from '../types/health';
import { MedicalDisclaimer } from './MedicalDisclaimer';

const CATEGORIES: Array<'All' | SymptomCategory> = [
  'All',
  'General & Systemic',
  'Respiratory',
  'Neurological',
  'Digestive',
  'Musculoskeletal',
  'Skin',
];

type DurationOption = 'under_24h' | '1_3_days' | '4_7_days' | 'over_week';
type SeverityOption = 'mild' | 'moderate' | 'severe';
type FeverOption = 'no' | 'unsure' | 'yes';

const URGENT_WARNING_SIGNS = [
  'Difficulty breathing or shortness of breath at rest',
  'Chest pain, tightness, or pressure',
  'Confusion, slurred speech, or sudden fainting',
  'Unable to keep fluids down for 24 hours',
];

export function SymptomChecker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SymptomCategory>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Follow-up answers
  const [duration, setDuration] = useState<DurationOption>('1_3_days');
  const [severity, setSeverity] = useState<SeverityOption>('mild');
  const [fever, setFever] = useState<FeverOption>('no');
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>([]);
  const [specificNotes, setSpecificNotes] = useState<Record<string, string>>({});
  const [showGuidance, setShowGuidance] = useState(false);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SYMPTOM_CATALOG.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const selectedItems: SymptomItem[] = useMemo(() => {
    return SYMPTOM_CATALOG.filter((item) => selectedIds.includes(item.id));
  }, [selectedIds]);

  const totalSelectedCount = selectedItems.length + customSymptoms.length;

  const toggleSymptom = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setShowGuidance(false);
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customInput.trim();
    if (!cleaned) return;
    const match = SYMPTOM_CATALOG.find(
      (item) => item.name.toLowerCase() === cleaned.toLowerCase()
    );
    if (match) {
      if (!selectedIds.includes(match.id)) {
        setSelectedIds((prev) => [...prev, match.id]);
      }
    } else if (!customSymptoms.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      setCustomSymptoms((prev) => [...prev, cleaned]);
    }
    setCustomInput('');
    setShowGuidance(false);
  };

  const removeCustomSymptom = (symptom: string) => {
    setCustomSymptoms((prev) => prev.filter((item) => item !== symptom));
    setShowGuidance(false);
  };

  const toggleWarning = (warning: string) => {
    setSelectedWarnings((prev) =>
      prev.includes(warning) ? prev.filter((w) => w !== warning) : [...prev, warning]
    );
  };

  const handleReset = () => {
    setSelectedIds([]);
    setCustomSymptoms([]);
    setCustomInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setDuration('1_3_days');
    setSeverity('mild');
    setFever('no');
    setSelectedWarnings([]);
    setSpecificNotes({});
    setShowGuidance(false);
  };

  const hasRedFlagSymptom = selectedItems.some((item) => item.isRedFlag);
  const hasUrgentWarning = selectedWarnings.length > 0 || hasRedFlagSymptom;
  const needsClinicianVisit =
    hasUrgentWarning ||
    severity === 'severe' ||
    fever === 'yes' ||
    duration === 'over_week' ||
    duration === '4_7_days';

  return (
    <div className="space-y-6">
      <MedicalDisclaimer
        title="Educational Symptom Guidance — Not a Medical Diagnosis"
        body="This Symptom Checker provides general health information and safety guidance based on the symptoms you select. It never diagnoses diseases or replaces an in-person clinical evaluation by a licensed healthcare professional."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Step 1: Select or Type Symptoms */}
        <section className="space-y-5 rounded-xl border border-[#DCE7E0] bg-white p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#0D3B2B]">
                1. Select or Enter Current Symptoms
              </h2>
              <p className="text-sm text-[#4A6559]">
                Choose one or more symptoms below, or type your own symptom.
              </p>
            </div>
            {totalSelectedCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE7E0] px-3 py-1.5 text-xs font-medium text-[#385447] hover:bg-[#F3F8F5] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Search + Custom Input */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B776A]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter symptoms list..."
                aria-label="Filter symptoms list"
                className="w-full rounded-lg border border-[#CFE0D6] bg-white py-2.5 pl-9 pr-3 text-sm text-[#10261D] placeholder:text-[#789286] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
              />
            </div>

            <form onSubmit={handleAddCustomSymptom} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type another symptom..."
                aria-label="Type another symptom"
                maxLength={80}
                className="min-w-0 flex-1 rounded-lg border border-[#CFE0D6] bg-white px-3 py-2.5 text-sm text-[#10261D] placeholder:text-[#789286] focus:border-[#188055] focus:outline-none focus:ring-2 focus:ring-[#188055]/20"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-[#0D3B2B] px-3.5 py-2.5 text-sm font-medium text-white hover:bg-[#14533C] whitespace-nowrap shrink-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Symptom categories">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#0D3B2B] text-white'
                      : 'bg-[#F0F7F3] text-[#2F4E3F] hover:bg-[#DFEFE6]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Selected Summary */}
          {totalSelectedCount > 0 && (
            <div className="rounded-lg border border-[#CFE0D6] bg-[#F5FAF7] p-3.5">
              <p className="text-xs font-semibold text-[#0D3B2B]">
                Selected Symptoms ({totalSelectedCount})
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSymptom(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#A8CBB8] bg-white px-2.5 py-1 text-xs font-medium text-[#0D3B2B] hover:bg-[#EDF7F2]"
                  >
                    <span>{item.name}</span>
                    <X className="h-3.5 w-3.5 text-[#4A6559]" aria-hidden="true" />
                  </button>
                ))}
                {customSymptoms.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => removeCustomSymptom(sym)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#A8CBB8] bg-white px-2.5 py-1 text-xs font-medium text-[#0D3B2B] hover:bg-[#EDF7F2]"
                  >
                    <span>{sym} (Custom)</span>
                    <X className="h-3.5 w-3.5 text-[#4A6559]" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptom Grid */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {filteredCatalog.map((symptom) => {
                const isSelected = selectedIds.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    aria-pressed={isSelected}
                    className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                      isSelected
                        ? 'border-[#188055] bg-[#EDF7F2]'
                        : 'border-[#DCE7E0] bg-white hover:border-[#A8CBB8] hover:bg-[#F8FCF9]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0D3B2B]">{symptom.name}</p>
                      <p className="mt-0.5 text-xs text-[#4A6559]">
                        {symptom.category}
                        {symptom.isRedFlag ? ' · Urgent check recommended' : ''}
                      </p>
                    </div>
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? 'border-[#0D3B2B] bg-[#0D3B2B] text-white'
                          : 'border-[#B9CFC3] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-[#DCE7E0] bg-[#F8FCF9] p-6 text-center">
              <p className="text-sm text-[#385447]">
                No catalog symptom matched "{searchQuery}". You can add it directly using the "Type another symptom" input above.
              </p>
            </div>
          )}
        </section>

        {/* Step 2: Basic Follow-Up Questions */}
        <section className="space-y-5 rounded-xl border border-[#DCE7E0] bg-white p-5 sm:p-6 lg:col-span-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0D3B2B]">
              2. Follow-Up Questions
            </h2>
            <p className="text-sm text-[#4A6559]">
              Answer a few brief context questions to review appropriate safety guidance.
            </p>
          </div>

          <div className="space-y-4">
            {/* Duration */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-[#0D3B2B]">
                How long have these symptoms been present?
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'under_24h', label: 'Under 24 hours' },
                    { id: '1_3_days', label: '1 – 3 days' },
                    { id: '4_7_days', label: '4 – 7 days' },
                    { id: 'over_week', label: 'Over 1 week' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDuration(opt.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors ${
                      duration === opt.id
                        ? 'border-[#0D3B2B] bg-[#0D3B2B] text-white'
                        : 'border-[#DCE7E0] bg-white text-[#2F4E3F] hover:bg-[#F3F8F5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Severity */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-[#0D3B2B]">
                How would you describe overall discomfort?
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'mild', label: 'Mild' },
                    { id: 'moderate', label: 'Moderate' },
                    { id: 'severe', label: 'Severe' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSeverity(opt.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium text-center transition-colors ${
                      severity === opt.id
                        ? 'border-[#0D3B2B] bg-[#0D3B2B] text-white'
                        : 'border-[#DCE7E0] bg-white text-[#2F4E3F] hover:bg-[#F3F8F5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Fever */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-[#0D3B2B]">
                Do you have a measured fever (38.0°C / 100.4°F or higher)?
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'no', label: 'No fever' },
                    { id: 'unsure', label: 'Unsure' },
                    { id: 'yes', label: 'Yes, fever' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFever(opt.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium text-center transition-colors ${
                      fever === opt.id
                        ? 'border-[#0D3B2B] bg-[#0D3B2B] text-white'
                        : 'border-[#DCE7E0] bg-white text-[#2F4E3F] hover:bg-[#F3F8F5]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Urgent Safety Check */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-[#0D3B2B]">
                Are any of these urgent warning signs present?
              </legend>
              <div className="space-y-2">
                {URGENT_WARNING_SIGNS.map((warning) => {
                  const checked = selectedWarnings.includes(warning);
                  return (
                    <label
                      key={warning}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${
                        checked
                          ? 'border-red-300 bg-red-50 text-red-950'
                          : 'border-[#DCE7E0] bg-white text-[#2F4E3F] hover:bg-[#F8FCF9]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleWarning(warning)}
                        className="mt-0.5 h-4 w-4 rounded border-[#B9CFC3] text-[#0D3B2B] focus:ring-[#188055]"
                      />
                      <span>{warning}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Symptom-specific follow-up reflection prompts */}
            {selectedItems.length > 0 && (
              <div className="space-y-3 rounded-lg border border-[#DCE7E0] bg-[#F8FCF9] p-3.5">
                <p className="text-xs font-semibold text-[#0D3B2B]">
                  Specific Follow-Up Notes (Optional — helpful for doctor visits)
                </p>
                {selectedItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="space-y-1.5">
                    <p className="text-xs font-medium text-[#2F4E3F]">
                      {item.name}: {item.followUpQuestions[0]}
                    </p>
                    <input
                      type="text"
                      value={specificNotes[item.id] ?? ''}
                      onChange={(e) =>
                        setSpecificNotes((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Optional note for your personal log..."
                      className="w-full rounded-md border border-[#CFE0D6] bg-white px-2.5 py-1.5 text-xs text-[#10261D] focus:border-[#188055] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={totalSelectedCount === 0}
              onClick={() => setShowGuidance(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0D3B2B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14533C] disabled:cursor-not-allowed disabled:bg-[#A6BFB3]"
            >
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              <span>
                {totalSelectedCount === 0
                  ? 'Select at least 1 symptom first'
                  : 'Review General Health Guidance'}
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Step 3: Output Guidance */}
      {showGuidance && totalSelectedCount > 0 && (
        <section
          aria-live="polite"
          className="space-y-6 rounded-xl border border-[#DCE7E0] bg-white p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E8F0EB] pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0D3B2B]">
                3. General Health Information & Safety Guidance
              </h2>
              <p className="mt-1 text-sm text-[#4A6559]">
                Based on {totalSelectedCount} selected symptom{totalSelectedCount === 1 ? '' : 's'} ·{' '}
                Severity: <span className="font-medium capitalize">{severity}</span>
              </p>
            </div>
            <span className="rounded-lg border border-[#CFE0D6] bg-[#EDF7F2] px-3 py-1.5 text-xs font-semibold text-[#0D3B2B]">
              Non-Diagnostic Educational Summary
            </span>
          </div>

          {hasUrgentWarning ? (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 p-5 text-red-950"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-700" aria-hidden="true" />
                <div className="space-y-2">
                  <h3 className="font-display text-base font-bold text-red-900">
                    Urgent Medical Attention Recommended
                  </h3>
                  <p className="text-sm leading-relaxed text-red-900">
                    Because you indicated an urgent warning sign or high-priority symptom (such as shortness of breath or chest discomfort), please seek prompt in-person evaluation at an urgent care clinic or emergency department, or contact local emergency services right away.
                  </p>
                </div>
              </div>
            </div>
          ) : needsClinicianVisit ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-semibold text-amber-950">
                    Consult a Healthcare Professional Recommended
                  </h3>
                  <p className="text-sm leading-relaxed text-amber-900">
                    Based on the duration, reported fever, or severity of your symptoms, scheduling an appointment with a doctor, nurse practitioner, or local clinic is strongly recommended for proper clinical assessment.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#CFE0D6] bg-[#EDF7F2] p-5 text-[#10261D]">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#188055]" aria-hidden="true" />
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-semibold text-[#0D3B2B]">
                    General Self-Care & Symptom Observation
                  </h3>
                  <p className="text-sm leading-relaxed text-[#2F4E3F]">
                    For mild, short-duration symptoms without urgent warning signs, supportive rest, steady hydration, and monitoring how symptoms change over the next 24–48 hours are commonly helpful. Contact a healthcare professional if symptoms worsen, fail to improve, or new warning signs appear.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Per-symptom information cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#DCE7E0] bg-[#F9FCFA] p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[#4A6559]">{item.category}</p>
                    <h4 className="font-display text-base font-bold text-[#0D3B2B]">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-[#2F4E3F]">{item.generalInfo}</p>

                  <div>
                    <p className="text-xs font-semibold text-[#0D3B2B]">
                      General Supportive Comfort Measures
                    </p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#385447]">
                      {item.selfCareGuidance.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#0D3B2B]">
                      When to Consult a Healthcare Professional
                    </p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#385447]">
                      {item.whenToSeekCare.map((rule) => (
                        <li key={rule}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {specificNotes[item.id]?.trim() && (
                  <div className="border-t border-[#DCE7E0] pt-3 text-xs text-[#385447]">
                    <span className="font-semibold text-[#0D3B2B]">Your note: </span>
                    {specificNotes[item.id]}
                  </div>
                )}
              </div>
            ))}

            {customSymptoms.map((custom) => (
              <div
                key={custom}
                className="rounded-xl border border-[#DCE7E0] bg-[#F9FCFA] p-5 space-y-3"
              >
                <div>
                  <p className="text-xs font-medium text-[#4A6559]">Custom Entered Symptom</p>
                  <h4 className="font-display text-base font-bold text-[#0D3B2B]">{custom}</h4>
                </div>
                <p className="text-sm leading-relaxed text-[#2F4E3F]">
                  Because custom symptoms vary widely, HealthCheck cannot provide tailored condition details for "{custom}". Track when it started, what makes it better or worse, and share those observations with a qualified healthcare provider.
                </p>
                <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#385447]">
                  <li>Rest, stay hydrated, and avoid strenuous exertion until evaluated.</li>
                  <li>
                    Seek prompt medical care if "{custom}" becomes severe, lasts more than a few days, or occurs with fever, chest pain, or breathing difficulty.
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <MedicalDisclaimer
            title="Reminder to Consult a Healthcare Professional"
            body="Only a licensed physician, nurse practitioner, or qualified clinician can examine you, order diagnostic tests, and confirm a diagnosis. Never delay seeking medical advice because of general information read online."
          />
        </section>
      )}
    </div>
  );
}
