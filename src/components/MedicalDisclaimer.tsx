import { AlertCircle } from 'lucide-react';

interface MedicalDisclaimerProps {
  title?: string;
  body: string;
  variant?: 'standard' | 'urgent';
}

export function MedicalDisclaimer({
  title = 'Medical & Educational Disclaimer',
  body,
  variant = 'standard',
}: MedicalDisclaimerProps) {
  const isUrgent = variant === 'urgent';

  return (
    <div
      role="note"
      className={`rounded-xl border p-4 sm:p-5 ${
        isUrgent
          ? 'border-red-200 bg-red-50 text-red-950'
          : 'border-[#CFE0D6] bg-[#EDF7F2] text-[#143528]'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isUrgent ? 'text-red-700' : 'text-[#188055]'
          }`}
          aria-hidden="true"
        />
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="font-semibold">{title}</p>
          <p className={isUrgent ? 'text-red-900' : 'text-[#2C4E3F]'}>{body}</p>
        </div>
      </div>
    </div>
  );
}
