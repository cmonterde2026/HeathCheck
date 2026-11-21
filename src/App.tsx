import { useState } from 'react';
import { AccountView } from './components/AccountView';
import { BmiCalculator } from './components/BmiCalculator';
import { HealthTips } from './components/HealthTips';
import { HomeDashboard } from './components/HomeDashboard';
import { ProtectedDashboardGate } from './components/ProtectedDashboardGate';
import { Sidebar } from './components/Sidebar';
import { SymptomChecker } from './components/SymptomChecker';
import { TopBar } from './components/TopBar';
import { WellnessTracker } from './components/WellnessTracker';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getTodayDateString, useHealthStore } from './hooks/useHealthStore';
import { SectionId } from './types/health';

function HealthCheckShell() {
  const { user, authReady } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    targets,
    bmiHistory,
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
  } = useHealthStore(user?.uid);

  const todayLog = getLogForDate(getTodayDateString());
  const latestBmi = bmiHistory.length > 0 ? bmiHistory[0] : null;

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-[#F6FAF7] text-[#10261D]">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          activeSection={activeSection}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateAccount={() => handleNavigate('account')}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {activeSection === 'dashboard' && (
            !authReady ? (
              <div className="rounded-xl border border-[#DCE7E0] bg-white p-10 text-center text-sm text-[#4A6559]">
                Restoring authentication session...
              </div>
            ) : user ? (
              <HomeDashboard
                todayLog={todayLog}
                targets={targets}
                latestBmi={latestBmi}
                onNavigate={handleNavigate}
              />
            ) : (
              <ProtectedDashboardGate onNavigate={handleNavigate} />
            )
          )}

          {activeSection === 'symptoms' && <SymptomChecker />}

          {activeSection === 'bmi' && (
            <BmiCalculator
              bmiHistory={bmiHistory}
              onSaveRecord={saveBmiRecord}
              onDeleteRecord={deleteBmiRecord}
            />
          )}

          {activeSection === 'wellness' && (
            <WellnessTracker
              targets={targets}
              recentLoggedDays={recentLoggedDays}
              getLogForDate={getLogForDate}
              onAdjustWater={adjustWater}
              onSetWaterExact={setWaterExact}
              onLogSleep={logSleep}
              onAddActivity={addActivity}
              onRemoveActivity={removeActivity}
              onUpdateTargets={updateTargets}
            />
          )}

          {activeSection === 'tips' && <HealthTips />}

          {activeSection === 'account' && <AccountView />}
        </main>

        <footer className="border-t border-[#DCE7E0] bg-white px-4 py-4 text-xs text-[#4A6559] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>HealthCheck – Personal Health Monitoring System</span>
            <span>Educational self-monitoring only · Not a substitute for professional medical care</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HealthCheckShell />
    </AuthProvider>
  );
}
