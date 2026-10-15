import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Unlock,
  Clock,
  Award,
  AlertTriangle,
  Download,
  Target,
  ArrowRight,
  CheckCircle,
  KeyRound,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';
import { parentService } from '../services/parentService';
import { progressService } from '../services/progressService';
import { soundService } from '../services/soundService';
import { useToastStore } from '../store/useToastStore';
import { ParentReport, ProgressReport as ProgressReportType } from '../types';
import { ProgressReportDocument } from '../components/common/ProgressReportDocument';

export const ParentDashboard: React.FC = () => {
  const { user, isParentUnlocked, unlockParent, lockParent, setParentPin } = useAuthStore();
  const { addToast } = useToastStore();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [report, setReport] = useState<ParentReport | null>(null);
  const [progressReport, setProgressReport] = useState<ProgressReportType | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number>(user?.daily_goal_minutes || 15);
  const [savedGoalToast, setSavedGoalToast] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Change PIN states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  useEffect(() => {
    if (isParentUnlocked) {
      parentService.getParentReport(user?.id || 1).then((data: ParentReport) => {
        setReport(data);
        setDailyGoal(data.daily_minutes_goal);
      });
      progressService.getProgress().then(setProgressReport);
    }
  }, [isParentUnlocked, user?.id]);

  const handlePinSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const success = unlockParent(pinInput);
    if (success) {
      soundService.playCorrect();
      setPinError(false);
      setPinInput('');
    } else {
      soundService.playIncorrect();
      setPinError(true);
      setPinInput('');
    }
  };

  const handleKeypadDigit = (digit: string) => {
    soundService.playClick();
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        setTimeout(() => {
          const success = unlockParent(next);
          if (success) {
            soundService.playCorrect();
            setPinError(false);
            setPinInput('');
          } else {
            soundService.playIncorrect();
            setPinError(true);
            setPinInput('');
          }
        }, 150);
      }
    }
  };

  const handleSaveGoal = async (minutes: number) => {
    soundService.playClick();
    setDailyGoal(minutes);
    await parentService.updateDailyGoal(user?.id || 1, minutes);
    setSavedGoalToast(true);
    setTimeout(() => setSavedGoalToast(false), 2000);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    setPinChangeError('');

    const storedCustomPin = localStorage.getItem('tamil_buddy_parent_pin');
    const effectivePin = storedCustomPin || user?.parent_pin || '1234';

    if (currentPinInput !== effectivePin) {
      soundService.playIncorrect();
      setPinChangeError('Current PIN is incorrect!');
      return;
    }

    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      soundService.playIncorrect();
      setPinChangeError('New PIN must be exactly 4 digits!');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      soundService.playIncorrect();
      setPinChangeError('New PIN and Confirm PIN do not match!');
      return;
    }

    // Save New PIN
    setParentPin(newPinInput);
    soundService.playCorrect();
    setPinChangeSuccess(true);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    addToast({
      type: 'success',
      title: 'PIN Changed! 🔒',
      message: `Your new Parent Zone PIN is active. Please use ${newPinInput} to unlock next time.`,
    });

    setTimeout(() => {
      setPinChangeSuccess(false);
    }, 3000);
  };

  // Download Progress & Mastery Report in PDF format
  const handleDownloadReport = async () => {
    soundService.playClick();
    const docElement = document.getElementById('printable-mastery-report');
    if (!docElement) return;

    try {
      setIsGeneratingPdf(true);
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(docElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const childName = (user?.name || report?.child_name || 'Student').replace(/\s+/g, '_');
      pdf.save(`${childName}_Tamil_Progress_and_Mastery_Report.pdf`);
      soundService.playCorrect();
      addToast({
        type: 'success',
        title: 'Report Downloaded! 📄',
        message: 'Progress & Mastery Report saved successfully as PDF.',
      });
    } catch (err) {
      console.error('Error generating PDF report', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 1. PIN LOCK SCREEN - Styled in Cozy Premium Purple and White
  if (!isParentUnlocked) {
    const storedCustomPin = localStorage.getItem('tamil_buddy_parent_pin');
    const isCustomPinActive = !!storedCustomPin;

    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-4xl p-6 sm:p-8 text-center shadow-2xl border-4 border-purple-300"
        >
          {/* Purple Icon Header */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-purple-200">
            <Lock size={36} />
          </div>

          <h2 className="text-3xl font-black text-purple-950 tracking-tight">Parent Zone 🛡️</h2>
          <p className="text-sm font-tamil text-purple-700 font-bold mt-0.5">பெற்றோர் கூடம்</p>
          <p className="text-xs text-slate-500 font-medium mt-1 mb-6">
            Enter your 4-digit PIN to access learning insights and manage goals.
          </p>

          {/* PIN circles visual */}
          <div className="flex justify-center gap-3.5 mb-6">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pinInput.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                    pinError
                      ? 'border-2 border-rose-500 bg-rose-50 text-rose-600 animate-shake'
                      : isFilled
                      ? 'bg-purple-700 text-white border-2 border-purple-800 shadow-md scale-105'
                      : 'border-2 border-purple-200 bg-purple-50/50 text-slate-400'
                  }`}
                >
                  {isFilled ? '●' : ''}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {pinError && (
            <p className="text-xs font-black text-rose-600 mb-4 bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-xl inline-block">
              ⚠️ Incorrect PIN! Please try again.
            </p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => {
              if (key === 'C') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setPinInput('');
                      setPinError(false);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm active:scale-95 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                );
              }
              if (key === '✓') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePinSubmit()}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Enter
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadDigit(key)}
                  className="p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-100/90 text-purple-950 font-black text-lg border border-purple-200 active:scale-95 transition-all cursor-pointer"
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Hint */}
          <p className="text-[11px] font-semibold text-slate-400">
            {isCustomPinActive ? '🔑 Custom PIN is active' : '💡 Default PIN: 1234 (You can change it inside)'}
          </p>
        </motion.div>
      </div>
    );
  }

  // 2. UNLOCKED PARENT ZONE - Cozy & Premium Purple and White
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-16 px-2 sm:px-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white rounded-4xl p-6 sm:p-8 shadow-xl border-4 border-purple-300 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-purple-100 text-3xl shadow-inner border border-white/20">
            🛡️
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Parent Zone (பெற்றோர் கூடம்)</h1>
            <p className="text-xs sm:text-sm text-purple-200 font-semibold mt-0.5">
              Child: <strong className="text-white">{report?.child_name || user?.name || 'Explorer'}</strong> • Age {user?.age || 8} • Level {user?.level || 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Download Progress & Mastery Report PDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
            icon={<Download size={16} />}
            className="bg-white text-purple-900 font-black hover:bg-purple-50 shadow-md border-0"
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Download Progress Report (PDF) 📄'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={lockParent}
            icon={<Lock size={16} />}
            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
          >
            Lock Zone
          </Button>
        </div>
      </div>

      {/* Weekly Summary 4-Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black text-purple-800 uppercase tracking-wider flex items-center gap-1">
            <Clock size={16} className="text-purple-600" /> Time Spent
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {report?.weekly_summary.total_minutes || 84.5} mins
          </span>
          <span className="text-xs font-bold text-teal-600 mt-1">This week</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black text-purple-800 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle size={16} className="text-emerald-600" /> Lessons
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {report?.weekly_summary.lessons_completed || 6} Completed
          </span>
          <span className="text-xs font-bold text-emerald-600 mt-1">100% on track</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black text-purple-800 uppercase tracking-wider flex items-center gap-1">
            <Award size={16} className="text-amber-500" /> XP Earned
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {report?.weekly_summary.total_xp || 380} XP
          </span>
          <span className="text-xs font-bold text-amber-600 mt-1">Level {user?.level || 1}</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-black text-purple-800 uppercase tracking-wider flex items-center gap-1">
            <Target size={16} className="text-rose-500" /> Streak
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {report?.weekly_summary.streak ?? user?.streak_current ?? 5} Days
          </span>
          <span className="text-xs font-bold text-orange-600 mt-1">Active Flame 🔥</span>
        </div>
      </div>

      {/* Main Content Grid: Goal Setter + Change PIN + Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Change Parent Zone PIN */}
        <div className="bg-white rounded-3xl p-6 border-3 border-purple-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-2xl bg-purple-100 text-purple-800 text-xl">🔑</span>
              <div>
                <h3 className="text-lg font-black text-purple-950">Change Parent Zone PIN</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Update your 4-digit PIN so the old default PIN (1234) is replaced.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Current PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Enter current 4-digit PIN"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-purple-200 focus:border-purple-600 outline-none font-bold text-sm bg-purple-50/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    New PIN (4 Digits)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    placeholder="e.g. 5678"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-purple-200 focus:border-purple-600 outline-none font-bold text-sm bg-purple-50/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    placeholder="Repeat new PIN"
                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-purple-200 focus:border-purple-600 outline-none font-bold text-sm bg-purple-50/30"
                    required
                  />
                </div>
              </div>

              {pinChangeError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl">
                  ⚠️ {pinChangeError}
                </p>
              )}

              {pinChangeSuccess && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl flex items-center gap-1.5">
                  <Check size={16} /> New PIN saved! The old PIN (1234) is no longer valid.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 text-white font-black py-2.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <KeyRound size={16} />
                <span>Save New PIN 🔒</span>
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Set Daily Goal Slider */}
        <div className="bg-white rounded-3xl p-6 border-3 border-purple-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-2xl bg-teal-100 text-teal-800 text-xl">🎯</span>
              <div>
                <h3 className="text-lg font-black text-purple-950">Daily Learning Target</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Adjust target study time per day for diaspora learning routine.
                </p>
              </div>
            </div>

            <div className="my-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase text-slate-400">Target Time</span>
                <span className="text-2xl font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-2xl">
                  {dailyGoal} mins / day
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="5"
                value={dailyGoal}
                onChange={(e) => handleSaveGoal(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                <span>5 mins</span>
                <span>15 mins (Recommended)</span>
                <span>45 mins</span>
              </div>
            </div>

            {savedGoalToast && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                <Check size={14} /> Goal updated to {dailyGoal} mins!
              </span>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-purple-900 font-semibold">
            💡 Short, frequent 15-minute daily sessions provide 3x better phonetic retention than long weekend sessions!
          </div>
        </div>
      </div>

      {/* Hidden Off-Screen Printable Progress & Mastery Report for PDF Capture */}
      <div className="overflow-hidden h-0 w-0 pointer-events-none opacity-0">
        <ProgressReportDocument
          report={progressReport}
          childName={report?.child_name || user?.name || 'Explorer'}
          age={user?.age || 8}
          level={user?.level || 1}
        />
      </div>
    </div>
  );
};
