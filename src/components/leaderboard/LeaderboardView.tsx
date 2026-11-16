import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Sparkles, 
  GraduationCap, 
  FolderGit2, 
  Briefcase, 
  Filter, 
  Info, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { calculateStudentScore } from '../../utils/scoring';
import { Student } from '../../types';

export const LeaderboardView: React.FC = () => {
  const { students, currentUser, navigateToProfile } = useApp();

  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);
  const [visibleLimit, setVisibleLimit] = useState<number>(30);

  // Filter students
  const filteredStudents = students.filter(s => {
    if (s.status === 'suspended') return false;
    if (selectedBranch !== 'All' && !s.branch.includes(selectedBranch)) return false;
    if (selectedYear !== 'All' && s.year !== selectedYear) return false;
    return true;
  });

  // Re-rank filtered view
  const rankedStudents = [...filteredStudents].sort((a, b) => b.leaderboardScore - a.leaderboardScore);

  const top1 = rankedStudents[0];
  const top2 = rankedStudents[1];
  const top3 = rankedStudents[2];
  const restStudents = rankedStudents.slice(3);

  // Find current user's relative position in this filtered ranking
  const userFilteredRank = currentUser 
    ? rankedStudents.findIndex(s => s.id === currentUser.id) + 1 
    : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
              Campus Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            See where you stand among your campus peers based on verified academic & practical excellence.
          </p>
        </div>

        {/* Current User Rank Strip */}
        {currentUser && userFilteredRank > 0 && (
          <div className="p-3 sm:px-4 rounded-xl bg-gradient-to-r from-sky-500/15 via-[#0F131C] to-teal-500/15 border border-sky-500/30 flex items-center gap-4 self-start sm:self-auto">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-400">Your Campus Rank</div>
              <div className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
                <span>#{userFilteredRank}</span>
                <span className="text-xs font-normal text-slate-400">
                  (Score: <strong className="text-sky-400">{currentUser.leaderboardScore}</strong>)
                </span>
              </div>
            </div>
            <button
              onClick={() => navigateToProfile(currentUser.id)}
              className="px-3 py-1.5 bg-sky-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-sky-400 transition-all shadow"
            >
              My Profile
            </button>
          </div>
        )}
      </div>

      {/* Formula Transparency Card */}
      <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            Automated Scoring Weights (100% Formulaic)
          </span>
          <span className="text-slate-500 hidden sm:inline">Zero manual admin adjustments permitted</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-xl bg-[#141923] border border-[#1E293B]">
            <div className="text-slate-400 text-[11px]">Academic CGPA</div>
            <div className="font-mono font-bold text-sky-400">40% weight</div>
          </div>
          <div className="p-2 rounded-xl bg-[#141923] border border-[#1E293B]">
            <div className="text-slate-400 text-[11px]">Projects</div>
            <div className="font-mono font-bold text-teal-400">20% weight</div>
          </div>
          <div className="p-2 rounded-xl bg-[#141923] border border-[#1E293B]">
            <div className="text-slate-400 text-[11px]">Internships</div>
            <div className="font-mono font-bold text-emerald-400">20% weight</div>
          </div>
          <div className="p-2 rounded-xl bg-[#141923] border border-[#1E293B]">
            <div className="text-slate-400 text-[11px]">Skills & Certs</div>
            <div className="font-mono font-bold text-purple-400">10% weight</div>
          </div>
          <div className="p-2 rounded-xl bg-[#141923] border border-[#1E293B]">
            <div className="text-slate-400 text-[11px]">Comp. Programming</div>
            <div className="font-mono font-bold text-amber-400">10% weight</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#0F131C] border border-[#1E293B]">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['All', 'CSE', 'AI', 'IT', 'ECE', 'Data Science', 'Mechanical', 'Civil', 'Electrical'].map(br => (
            <button
              key={br}
              onClick={() => {
                setSelectedBranch(br);
                setVisibleLimit(30);
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-medium whitespace-nowrap ${
                selectedBranch === br
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#141923]'
              }`}
            >
              {br === 'All' ? 'All Branches' : br}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#1E293B] hidden sm:block" />

        {/* Year Filter */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['All', '1st Year', '2nd Year', '3rd Year', '4th Year'].map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                selectedYear === yr
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#141923]'
              }`}
            >
              {yr === 'All' ? 'All Years' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {rankedStudents.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 (Silver) */}
          {top2 && (
            <div 
              onClick={() => navigateToProfile(top2.id)}
              className="order-2 md:order-1 p-5 rounded-2xl bg-[#0F131C] border border-slate-400/30 hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-3 right-3 text-2xl font-mono font-extrabold text-slate-400/40">
                #2
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={top2.profilePhoto}
                    alt={top2.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                    🥈
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                    {top2.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {top2.branch.split(' ')[0]} · {top2.year}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    CGPA {top2.cgpa.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">MediConnect Score</div>
                  <div className="text-lg font-extrabold text-slate-200 font-mono">{top2.leaderboardScore} pts</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectStudent(top2);
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Breakdown
                </button>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold) */}
          {top1 && (
            <div 
              onClick={() => navigateToProfile(top1.id)}
              className="order-1 md:order-2 p-5 rounded-2xl bg-gradient-to-b from-[#181D2A] to-[#0F131C] border border-amber-500/50 hover:border-amber-400 shadow-xl shadow-amber-500/10 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group md:-translate-y-2"
            >
              <div className="absolute top-3 right-3 text-3xl font-mono font-extrabold text-amber-500/30">
                #1
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={top1.profilePhoto}
                    alt={top1.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                    🥇
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-0.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Campus Leader</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                    {top1.name}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {top1.branch.split(' ')[0]} · {top1.year}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    CGPA {top1.cgpa.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-400 uppercase font-semibold">MediConnect Score</div>
                  <div className="text-xl font-extrabold text-white font-mono">{top1.leaderboardScore} pts</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectStudent(top1);
                  }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Breakdown
                </button>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3 && (
            <div 
              onClick={() => navigateToProfile(top3.id)}
              className="order-3 p-5 rounded-2xl bg-[#0F131C] border border-amber-700/40 hover:border-amber-600 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
            >
              <div className="absolute top-3 right-3 text-2xl font-mono font-extrabold text-amber-700/30">
                #3
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={top3.profilePhoto}
                    alt={top3.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-700"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow">
                    🥉
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                    {top3.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {top3.branch.split(' ')[0]} · {top3.year}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    CGPA {top3.cgpa.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E293B] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">MediConnect Score</div>
                  <div className="text-lg font-extrabold text-slate-200 font-mono">{top3.leaderboardScore} pts</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectStudent(top3);
                  }}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Breakdown
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden">
        <div className="p-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Student Rankings Directory
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {rankedStudents.length} Students Listed
          </span>
        </div>

        <div className="divide-y divide-[#1E293B] overflow-x-auto">
          {rankedStudents.slice(0, visibleLimit).map((st, index) => {
            const isCurrentUser = currentUser?.id === st.id;
            const rankNumber = index + 1;
            return (
              <div
                key={st.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  isCurrentUser 
                    ? 'bg-sky-500/10 hover:bg-sky-500/15' 
                    : 'hover:bg-[#141923]/60'
                }`}
              >
                {/* Left: Rank & Student Identity */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 text-center font-mono font-extrabold text-sm sm:text-base text-slate-400 shrink-0">
                    {rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : `#${rankNumber}`}
                  </div>

                  <div 
                    onClick={() => navigateToProfile(st.id)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 group"
                  >
                    <img
                      src={st.profilePhoto}
                      alt={st.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-white group-hover:text-sky-400 transition-colors flex items-center gap-2 truncate">
                        <span>{st.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {st.branch} · {st.year}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Academic stats, score, CTA */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {st.cgpa.toFixed(2)} CGPA
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {st.projects.length} Projs · {st.internships.length} Intern
                    </div>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <div className="text-sm sm:text-base font-mono font-extrabold text-sky-400">
                      {st.leaderboardScore}
                    </div>
                    <button
                      onClick={() => setInspectStudent(st)}
                      className="text-[10px] text-slate-400 hover:text-white underline"
                    >
                      Formula
                    </button>
                  </div>

                  <button
                    onClick={() => navigateToProfile(st.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-sky-500/40 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {rankedStudents.length > visibleLimit && (
          <div className="p-4 border-t border-[#1E293B] bg-[#0A0D15] flex items-center justify-center gap-3">
            <button
              onClick={() => setVisibleLimit(v => v + 35)}
              className="px-4 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-sky-500/40 text-xs font-semibold text-sky-400 transition-all"
            >
              Load Next 35 Students ({rankedStudents.length - visibleLimit} remaining)
            </button>
            <button
              onClick={() => setVisibleLimit(rankedStudents.length)}
              className="px-4 py-2 rounded-xl bg-[#0F131C] hover:bg-[#141923] border border-[#1E293B] text-xs font-medium text-slate-300 transition-all"
            >
              Show All {rankedStudents.length}
            </button>
          </div>
        )}
      </div>

      {/* Score Inspection Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">{inspectStudent.name}'s Score Breakdown</h3>
                <p className="text-xs text-slate-400">{inspectStudent.branch} · {inspectStudent.year}</p>
              </div>
              <button onClick={() => setInspectStudent(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {(() => {
              const { total, breakdown } = calculateStudentScore(inspectStudent);
              return (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]">
                    <div>
                      <span className="font-semibold text-white">CGPA Weight (40%)</span>
                      <p className="text-[10px] text-slate-400">{inspectStudent.cgpa.toFixed(2)} out of 10.0</p>
                    </div>
                    <span className="font-mono font-bold text-sky-400">{breakdown.cgpaScore} / 40 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]">
                    <div>
                      <span className="font-semibold text-white">Projects (20%)</span>
                      <p className="text-[10px] text-slate-400">{inspectStudent.projects.length} verified projects</p>
                    </div>
                    <span className="font-mono font-bold text-teal-400">{breakdown.projectsScore} / 20 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]">
                    <div>
                      <span className="font-semibold text-white">Internships (20%)</span>
                      <p className="text-[10px] text-slate-400">{inspectStudent.internships.length} industry experiences</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">{breakdown.internshipsScore} / 20 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]">
                    <div>
                      <span className="font-semibold text-white">Skills & Certifications (10%)</span>
                      <p className="text-[10px] text-slate-400">{inspectStudent.skills.length} skills, {inspectStudent.certifications.length} certs</p>
                    </div>
                    <span className="font-mono font-bold text-purple-400">{breakdown.skillsAndCertsScore} / 10 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]">
                    <div>
                      <span className="font-semibold text-white">Competitive Programming (10%)</span>
                      <p className="text-[10px] text-slate-400">LeetCode, Codeforces presence</p>
                    </div>
                    <span className="font-mono font-bold text-amber-400">{breakdown.competitiveProgrammingScore} / 10 pts</span>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between font-bold text-sm">
                    <span className="text-white">Aggregate Score</span>
                    <span className="font-mono text-sky-400">{total} / 100</span>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => setInspectStudent(null)}
              className="w-full py-2 bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-xs font-semibold text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
