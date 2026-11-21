import { useEffect, useState } from 'react';
import {
  ActivityEntry,
  BmiRecord,
  DailyWellnessLog,
  SleepQuality,
  WellnessTargets,
} from '../types/health';

const BASE_STORAGE_KEY = 'healthcheck_wellness_store_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface PersistedHealthState {
  logsByDate: Record<string, DailyWellnessLog>;
  bmiHistory: BmiRecord[];
  targets: WellnessTargets;
}

const DEFAULT_TARGETS: WellnessTargets = {
  waterMl: 2000,
  sleepHours: 8,
  activityMinutes: 30,
};

const INITIAL_STATE: PersistedHealthState = {
  logsByDate: {},
  bmiHistory: [],
  targets: DEFAULT_TARGETS,
};

function getStorageKey(userId?: string | null): string {
  return userId ? `${BASE_STORAGE_KEY}_${userId}` : `${BASE_STORAGE_KEY}_guest`;
}

function loadInitialState(storageKey: string): PersistedHealthState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedHealthState>;
    return {
      logsByDate: parsed.logsByDate ?? {},
      bmiHistory: Array.isArray(parsed.bmiHistory) ? parsed.bmiHistory : [],
      targets: {
        waterMl: parsed.targets?.waterMl ?? DEFAULT_TARGETS.waterMl,
        sleepHours: parsed.targets?.sleepHours ?? DEFAULT_TARGETS.sleepHours,
        activityMinutes: parsed.targets?.activityMinutes ?? DEFAULT_TARGETS.activityMinutes,
      },
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function useHealthStore(userId?: string | null) {
  const storageKey = getStorageKey(userId);
  const [state, setState] = useState<PersistedHealthState>(() => loadInitialState(storageKey));

  useEffect(() => {
    setState(loadInitialState(storageKey));
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [storageKey, state]);

  const getLogForDate = (date: string): DailyWellnessLog => {
    return (
      state.logsByDate[date] ?? {
        date,
        waterMl: 0,
        sleepHours: null,
        sleepQuality: null,
        activities: [],
      }
    );
  };

  const adjustWater = (date: string, deltaMl: number) => {
    setState((prev) => {
      const existing = prev.logsByDate[date] ?? {
        date,
        waterMl: 0,
        sleepHours: null,
        sleepQuality: null,
        activities: [],
      };
      const nextWater = Math.max(0, Math.min(10000, existing.waterMl + deltaMl));
      return {
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...existing,
            waterMl: nextWater,
          },
        },
      };
    });
  };

  const setWaterExact = (date: string, ml: number) => {
    const clamped = Math.max(0, Math.min(10000, Math.round(ml)));
    setState((prev) => {
      const existing = prev.logsByDate[date] ?? {
        date,
        waterMl: 0,
        sleepHours: null,
        sleepQuality: null,
        activities: [],
      };
      return {
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...existing,
            waterMl: clamped,
          },
        },
      };
    });
  };

  const logSleep = (date: string, hours: number, quality: SleepQuality) => {
    const clamped = Math.max(0, Math.min(24, Math.round(hours * 2) / 2));
    setState((prev) => {
      const existing = prev.logsByDate[date] ?? {
        date,
        waterMl: 0,
        sleepHours: null,
        sleepQuality: null,
        activities: [],
      };
      return {
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...existing,
            sleepHours: clamped,
            sleepQuality: quality,
          },
        },
      };
    });
  };

  const addActivity = (
    date: string,
    type: string,
    durationMinutes: number,
    intensity: ActivityEntry['intensity']
  ) => {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: type.trim() || 'Physical Activity',
      durationMinutes: Math.max(1, Math.min(600, Math.round(durationMinutes))),
      intensity,
      loggedAt: new Date().toISOString(),
    };
    setState((prev) => {
      const existing = prev.logsByDate[date] ?? {
        date,
        waterMl: 0,
        sleepHours: null,
        sleepQuality: null,
        activities: [],
      };
      return {
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...existing,
            activities: [entry, ...existing.activities],
          },
        },
      };
    });
  };

  const removeActivity = (date: string, activityId: string) => {
    setState((prev) => {
      const existing = prev.logsByDate[date];
      if (!existing) return prev;
      return {
        ...prev,
        logsByDate: {
          ...prev.logsByDate,
          [date]: {
            ...existing,
            activities: existing.activities.filter((a) => a.id !== activityId),
          },
        },
      };
    });
  };

  const updateTargets = (nextTargets: Partial<WellnessTargets>) => {
    setState((prev) => ({
      ...prev,
      targets: {
        waterMl: Math.max(500, Math.min(6000, nextTargets.waterMl ?? prev.targets.waterMl)),
        sleepHours: Math.max(4, Math.min(12, nextTargets.sleepHours ?? prev.targets.sleepHours)),
        activityMinutes: Math.max(
          10,
          Math.min(240, nextTargets.activityMinutes ?? prev.targets.activityMinutes)
        ),
      },
    }));
  };

  const saveBmiRecord = (record: Omit<BmiRecord, 'id' | 'recordedAt'>) => {
    const fullRecord: BmiRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      recordedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      bmiHistory: [fullRecord, ...prev.bmiHistory].slice(0, 20),
    }));
  };

  const deleteBmiRecord = (id: string) => {
    setState((prev) => ({
      ...prev,
      bmiHistory: prev.bmiHistory.filter((item) => item.id !== id),
    }));
  };

  const recentLoggedDays = Object.values(state.logsByDate)
    .filter(
      (log) => log.waterMl > 0 || log.sleepHours !== null || log.activities.length > 0
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return {
    targets: state.targets,
    bmiHistory: state.bmiHistory,
    recentLoggedDays,
    getLogForDate,
    adjustWater,
    setWaterExact,
    logSleep,
    addActivity,
    removeActivity,
    updateTargets,
    saveBmiRecord,
    deleteBmiRecord,
  };
}
