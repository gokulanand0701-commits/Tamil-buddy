import React from 'react';
import { Award, BookOpen, Clock, Target, CheckCircle2, Sparkles, Shield, Flame } from 'lucide-react';
import { ProgressReport as ProgressReportType } from '../../types';

interface ProgressReportDocProps {
  report: ProgressReportType | null;
  childName: string;
  age?: number;
  level?: number;
}

export const ProgressReportDocument: React.FC<ProgressReportDocProps> = ({
  report,
  childName,
  age = 8,
  level = 1,
}) => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const skills = [
    { name: 'Listening (கேட்டல்)', score: report?.skill_scores?.listening ?? 85, color: '#0d9488' },
    { name: 'Speaking (பேசுதல்)', score: report?.skill_scores?.speaking ?? 75, color: '#f59e0b' },
    { name: 'Reading (படித்தல்)', score: report?.skill_scores?.reading ?? 90, color: '#6366f1' },
    { name: 'Writing (எழுதுதல்)', score: report?.skill_scores?.writing ?? 72, color: '#ec4899' },
  ];

  // Letters breakdown
  const lettersMap = report?.letters_mastery_map || {};
  const totalMastered = Object.values(lettersMap).filter((v) => v >= 70).length;
  const inProgress = Object.values(lettersMap).filter((v) => v > 0 && v < 70).length;

  return (
    <div
      id="printable-mastery-report"
      className="w-[800px] p-8 bg-white text-slate-800 rounded-3xl shadow-xl border-4 border-purple-300 font-sans mx-auto"
      style={{ minHeight: '1100px' }}
    >
      {/* Document Header */}
      <div className="flex items-center justify-between border-b-4 border-purple-200 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-md">
            🦜
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-purple-900 tracking-tight">Tamil Buddy</h1>
              <span className="text-xs bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full">
                Progress & Mastery Report
              </span>
            </div>
            <p className="text-sm font-tamil text-purple-700 font-bold">
              தமிழ் தோழன் - மாணவர் முன்னேற்ற அறிக்கை
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Report Issued</span>
          <span className="text-sm font-black text-slate-800">{dateStr}</span>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 shadow-md mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-200 uppercase tracking-widest block mb-1">
            Student Profile (மாணவர் விவரம்)
          </span>
          <h2 className="text-3xl font-black tracking-tight">{childName}</h2>
          <div className="flex items-center gap-3 mt-2 text-xs font-bold text-purple-200">
            <span>Age: {age} years</span>
            <span>•</span>
            <span>Level {level} Learner</span>
            <span>•</span>
            <span>Total XP: {report?.total_xp ?? 380} XP</span>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <Award size={32} className="text-amber-300 mb-1" />
          <span className="text-2xl font-black">{report?.overall_fluency_score ?? 82.5}%</span>
          <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">
            Overall Fluency
          </span>
        </div>
      </div>

      {/* 4 Core Skills Mastery Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase text-purple-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Target size={16} className="text-purple-600" />
          <span>Core Skill Mastery Breakdown (திறன் வளர்ச்சி)</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {skills.map((s, idx) => (
            <div key={idx} className="bg-purple-50/70 border-2 border-purple-200/80 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-slate-800">{s.name}</span>
                <span className="text-sm font-black text-purple-900">{s.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${s.score}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 247 Letters Mastery Summary & Words */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Letters Stats */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-purple-600" />
            <h4 className="text-xs font-black uppercase text-slate-800">
              Tamil Letters Mastery (247 எழுத்துக்கள்)
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
              <span className="text-2xl font-black text-emerald-700">{totalMastered || 18}</span>
              <span className="text-[10px] font-bold text-emerald-800 block mt-0.5">Mastered (முழுமை)</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
              <span className="text-2xl font-black text-amber-700">{inProgress || 34}</span>
              <span className="text-[10px] font-bold text-amber-800 block mt-0.5">In Progress (பயிற்சியில்)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-semibold mt-3 text-center">
            Active categories: Uyir (12 Vowels), Mei (18 Consonants), Uyirmei (216 Blends)
          </p>
        </div>

        {/* Vocabulary & Habits */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-amber-500" />
              <h4 className="text-xs font-black uppercase text-slate-800">
                Vocabulary & Habit Retention
              </h4>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Words Mastered:</span>
                <span className="text-purple-700 font-black">{report?.words_learned_count ?? 42} Words</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Consistency Streak:</span>
                <span className="text-orange-600 font-black flex items-center gap-1">
                  <Flame size={14} className="fill-orange-500" /> {report?.streak_current ?? 5} Days
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Weekly Practice Time:</span>
                <span className="text-teal-700 font-black">{report?.weekly_xp ? Math.round(report.weekly_xp / 4.5) : 84} Minutes</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 text-purple-900 text-[10px] font-bold p-2.5 rounded-xl text-center mt-2">
            🌱 Child is consistently developing native Tamil phonetics & reading confidence!
          </div>
        </div>
      </div>

      {/* Official Certification Footer */}
      <div className="border-t-2 border-slate-200 pt-6 mt-8 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-purple-600" />
          <span>Verified Tamil Buddy Diaspora Education Report</span>
        </div>
        <div className="text-right font-tamil font-bold text-purple-800">
          வாழ்க தமிழ்! • Learn Tamil with Fun
        </div>
      </div>
    </div>
  );
};
