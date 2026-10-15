import React, { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Award, BookOpen, Flame, Volume2, Search, CheckCircle, Sparkles, FileText, Loader2, Download } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { useAuthStore } from '../store/useAuthStore';
import { progressService } from '../services/progressService';
import { generate247Letters, FullTamilLetter } from '../utils/tamilPhonetics';
import { MOCK_WEEKLY_XP } from '../mocks/mockProgress';
import { MOCK_WORDS } from '../mocks/mockWords';
import { soundService } from '../services/soundService';
import { ProgressReport as ProgressReportType, WordItem } from '../types';
import { ProgressReportDocument } from '../components/common/ProgressReportDocument';

export const ProgressReport: React.FC = () => {
  const { user } = useAuthStore();
  const [report, setReport] = useState<ProgressReportType | null>(null);
  const [activeLetterFilter, setActiveLetterFilter] = useState<'all' | 'uyir' | 'mei' | 'uyirmei'>('uyir');
  const [wordCategoryFilter, setWordCategoryFilter] = useState<string>('all');
  const [selectedLetterModal, setSelectedLetterModal] = useState<FullTamilLetter | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Generate 247 letters
  const all247Letters = React.useMemo(() => generate247Letters(), []);

  useEffect(() => {
    progressService.getProgress().then(setReport);
  }, []);

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
      const childName = (user?.name || 'Explorer').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`${childName}_Tamil_Progress_and_Mastery_Report.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const skillData = report
    ? [
        { skill: 'Listening (கேட்டல்)', score: report.skill_scores.listening, fullMark: 100 },
        { skill: 'Speaking (பேசுதல்)', score: report.skill_scores.speaking, fullMark: 100 },
        { skill: 'Reading (படித்தல்)', score: report.skill_scores.reading, fullMark: 100 },
        { skill: 'Writing (எழுதுதல்)', score: report.skill_scores.writing, fullMark: 100 },
      ]
    : [];

  const filteredLetters = all247Letters.filter((l) => {
    if (activeLetterFilter === 'all') return true;
    return l.category === activeLetterFilter;
  });

  const filteredWords = MOCK_WORDS.filter((w: WordItem) => {
    if (wordCategoryFilter === 'all') return true;
    return w.category === wordCategoryFilter;
  });

  const getMasteryColor = (char: string) => {
    const mastery = report?.letters_mastery_map[char] ?? 0;
    if (mastery >= 90) return 'bg-emerald-500 text-white border-emerald-600';
    if (mastery >= 65) return 'bg-teal-400 text-slate-900 border-teal-600';
    if (mastery >= 30) return 'bg-amber-300 text-amber-950 border-amber-400';
    return 'bg-slate-100 text-slate-400 border-slate-200';
  };

  const handleLetterClick = (letter: FullTamilLetter) => {
    soundService.playClick();
    soundService.speakTamil(letter.char);
    setSelectedLetterModal(letter);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16">
      {/* Page Title */}
      <div className="text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Progress & Mastery Report 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            Tracking your Tamil growth across listening, speaking, reading, and writing!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download Report (PDF) 📄</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 px-4 py-2 rounded-2xl">
            <Award size={28} className="text-amber-500" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-amber-800 block">
                Overall Fluency
              </span>
              <span className="text-xl font-black text-slate-900">
                {report?.overall_fluency_score || 80.5}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Charts: Skill Radar & Weekly XP Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Skill Radar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-base text-slate-800">4-Skill Balance Radar</h3>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              Balanced Growth
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Fluency is weighted evenly across all 4 language skills.
          </p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#0d9488"
                  fill="#14b8a6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weekly XP Progress */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-base text-slate-800">Weekly XP Momentum</h3>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              380 XP Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Points earned each day this week through exercises.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_WEEKLY_XP}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 12, border: '2px solid #e2e8f0', fontWeight: 'bold' }}
                />
                <Bar dataKey="xp" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Streak Calendar Heatmap */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500 fill-orange-500" />
            <h3 className="font-extrabold text-base text-slate-800">Daily Streak Heatmap</h3>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
            Active: 5 Day Streak 🔥
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Each tile represents a day of consistent Tamil practice.
        </p>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-2 max-w-md mx-auto text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day} className="text-[10px] font-extrabold text-slate-400 uppercase">
              {day}
            </span>
          ))}

          {/* 28-day calendar representation */}
          {Array.from({ length: 28 }).map((_, idx) => {
            const isActive = idx >= 18 && idx <= 22; // current 5-day streak
            const isFreeze = idx === 17;
            const isPast = idx < 17 && idx % 3 === 0;

            return (
              <div
                key={idx}
                className={`h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                  isActive
                    ? 'bg-orange-500 border-orange-600 text-white shadow-xs'
                    : isFreeze
                    ? 'bg-sky-200 border-sky-400 text-sky-800'
                    : isPast
                    ? 'bg-amber-200 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-300'
                }`}
                title={`Day ${idx + 1}`}
              >
                {isActive ? '🔥' : isFreeze ? '❄️' : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* 247 Letters Mastered Grid (Key Requirement!) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <span>Full 247 Tamil Letters Grid (தமிழ் எழுத்துக்கள்)</span>
              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                {all247Letters.length} Letters
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tap any letter to hear its sound, transliteration, and see example words!
            </p>
          </div>

          {/* Category Tabs: Uyir (12) / Mei (18) / Uyirmei (216) / All */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
            {[
              { id: 'uyir', label: 'Uyir (12)' },
              { id: 'mei', label: 'Mei (18)' },
              { id: 'uyirmei', label: 'Uyirmei (216)' },
              { id: 'all', label: 'All (247)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundService.playClick();
                  setActiveLetterFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeLetterFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold mb-4 text-slate-600">
          <span className="text-[11px] font-extrabold uppercase text-slate-400">Mastery:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Mastered (90%+)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-teal-400" /> Strong (65-89%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-300" /> Learning (30-64%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-slate-200" /> Unlocked / Due
          </span>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2 max-h-96 overflow-y-auto p-1 scrollbar-thin">
          {filteredLetters.map((l, i) => (
            <button
              key={i}
              onClick={() => handleLetterClick(l)}
              className={`h-11 rounded-2xl flex flex-col items-center justify-center font-tamil text-lg font-black border-2 transition-transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer ${getMasteryColor(
                l.char
              )}`}
              title={`${l.char} (${l.translit})`}
            >
              <span>{l.char}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Words Learned Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800">
              Words Learned ({filteredWords.length} words)
            </h3>
            <p className="text-xs text-slate-500">Everyday vocabulary with 3-layer translation.</p>
          </div>

          {/* Word Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'family', 'food', 'animals', 'colors'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundService.playClick();
                  setWordCategoryFilter(cat);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  wordCategoryFilter === cat
                    ? 'bg-amber-400 text-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Words Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredWords.map((w: WordItem) => (
            <div
              key={w.id}
              className="p-3.5 rounded-2xl border-2 border-slate-100 hover:border-amber-300 bg-slate-50/50 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{w.image_url || '📝'}</span>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-tamil text-xl font-black text-slate-900">{w.tamil}</span>
                    <span className="text-xs font-bold text-teal-600">({w.transliteration})</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">"{w.meaning}"</span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundService.playClick();
                  soundService.speakTamil(w.tamil);
                }}
                className="p-2 text-teal-600 hover:bg-teal-50 rounded-full shrink-0"
              >
                <Volume2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Letter Modal */}
      {selectedLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl border-4 border-amber-300 relative">
            <span className="text-xs font-extrabold uppercase text-amber-700 block mb-1">
              Letter Details ({selectedLetterModal.category})
            </span>
            <span className="font-tamil text-6xl font-black text-slate-900 block my-2">
              {selectedLetterModal.char}
            </span>
            <span className="text-base font-bold text-teal-700 block">
              Sound: "{selectedLetterModal.translit}"
            </span>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => soundService.speakTamil(selectedLetterModal.char)}
                className="flex-1 bg-amber-400 hover:bg-amber-300 font-extrabold text-slate-900 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1 shadow-sm"
              >
                <Volume2 size={16} /> Replay Sound
              </button>
              <button
                onClick={() => setSelectedLetterModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 py-2.5 rounded-2xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Off-Screen Printable Document for high-res PDF generation */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', zIndex: -100 }}>
        <ProgressReportDocument
          report={report}
          childName={user?.name || 'Explorer'}
          age={user?.age || 8}
          level={user?.level || 1}
        />
      </div>
    </div>
  );
};
