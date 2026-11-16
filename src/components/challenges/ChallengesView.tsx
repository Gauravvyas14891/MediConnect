import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Flame, 
  Calendar, 
  Users, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Send, 
  ExternalLink, 
  Sparkles,
  Clock,
  Code2
} from 'lucide-react';
import { Challenge, ChallengeStatus } from '../../types';

export const ChallengesView: React.FC = () => {
  const { 
    challenges, 
    currentUser, 
    joinChallenge, 
    submitChallengeEntry, 
    activeChallengeDetail, 
    setActiveChallengeDetail,
    navigateToProfile 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | ChallengeStatus>('All');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(activeChallengeDetail);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [failedBanners, setFailedBanners] = useState<Record<string, boolean>>({});

  // Submit modal form
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Sync if activeChallengeDetail was set by another component
  React.useEffect(() => {
    if (activeChallengeDetail) {
      setSelectedChallenge(activeChallengeDetail);
    }
  }, [activeChallengeDetail]);

  // Keep open challenge modal synced when challenges list updates (e.g. join/submit)
  React.useEffect(() => {
    if (selectedChallenge) {
      const latest = challenges.find(c => c.id === selectedChallenge.id);
      if (latest && latest !== selectedChallenge) {
        setSelectedChallenge(latest);
      }
    }
  }, [challenges, selectedChallenge]);

  const filteredChallenges = challenges.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !submissionTitle.trim() || !submissionLink.trim()) return;

    submitChallengeEntry(
      selectedChallenge.id,
      submissionTitle.trim(),
      submissionLink.trim(),
      submissionNotes.trim()
    );

    // Refresh selected challenge locally
    const updated = challenges.find(c => c.id === selectedChallenge.id);
    if (updated) {
      setSelectedChallenge(updated);
    }

    setSubmissionTitle('');
    setSubmissionLink('');
    setSubmissionNotes('');
    setIsSubmitModalOpen(false);
  };

  const isUserJoined = currentUser && selectedChallenge?.participants.includes(currentUser.id);
  const hasUserSubmitted = currentUser && selectedChallenge?.submissions.some(s => s.studentId === currentUser.id);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
              Student Challenges & Hackathons
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build projects, sharpen competitive coding streaks, and earn official MediConnect badges and cash prizes.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0F131C] border border-[#1E293B] rounded-xl self-start sm:self-auto text-xs">
          {(['All', 'Active', 'Upcoming', 'Completed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                statusFilter === st
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
          <Flame className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No challenges matching filter</h3>
          <p className="text-xs text-slate-500">Check back soon for new coding and design sprints!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map(ch => {
            const joined = currentUser && ch.participants.includes(currentUser.id);
            return (
              <div
                key={ch.id}
                className="rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/40 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                {/* Banner Header */}
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#131C2E] to-[#0B2538]">
                  {ch.bannerImage && !failedBanners[ch.id] ? (
                    <img
                      src={ch.bannerImage}
                      alt={ch.title}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedBanners(prev => ({ ...prev, [ch.id]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-sky-400/70">
                      <Code2 className="w-9 h-9" />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                        {ch.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-transparent to-black/30" />
                  
                  {/* Category & Status Tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#080B12]/80 backdrop-blur-md text-sky-400 border border-sky-500/30">
                      {ch.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                      ch.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ch.status === 'Upcoming'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {ch.status}
                    </span>
                  </div>
                </div>

                {/* Challenge Info */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base text-[#F8FAFC] group-hover:text-sky-400 transition-colors leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ch.tagline}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{ch.startDate} – {ch.endDate}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-300 font-mono">
                        <Users className="w-3.5 h-3.5 text-teal-400" />
                        <span>{ch.participantCount}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-400 font-semibold truncate max-w-[170px]">
                        🏆 {ch.prize.split('+')[0]}
                      </span>
                      <span className="text-purple-400 font-mono text-[11px]">
                        +{ch.pointsReward} Points
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedChallenge(ch);
                        setActiveChallengeDetail(ch);
                      }}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <span>Challenge Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {joined ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </span>
                    ) : ch.status === 'Active' ? (
                      <button
                        onClick={() => joinChallenge(ch.id)}
                        className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                      >
                        Join Now
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHALLENGE DETAIL MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="h-44 relative bg-gradient-to-br from-[#0F172A] via-[#131C2E] to-[#0B2538] shrink-0">
              {selectedChallenge.bannerImage && !failedBanners[selectedChallenge.id] ? (
                <img
                  src={selectedChallenge.bannerImage}
                  alt={selectedChallenge.title}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedBanners(prev => ({ ...prev, [selectedChallenge.id]: true }))}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sky-400/60">
                  <Code2 className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-transparent to-black/30" />
              <button
                onClick={() => {
                  setSelectedChallenge(null);
                  setActiveChallengeDetail(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/90"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950">
                  {selectedChallenge.category}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {selectedChallenge.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Prize & Timeline summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#141923] border border-[#1E293B] text-xs">
                <div>
                  <div className="text-slate-400">Prize Pool</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{selectedChallenge.prize}</div>
                </div>
                <div>
                  <div className="text-slate-400">Timeline</div>
                  <div className="font-semibold text-white mt-0.5">{selectedChallenge.startDate} – {selectedChallenge.endDate}</div>
                </div>
                <div>
                  <div className="text-slate-400">Campus Participation</div>
                  <div className="font-semibold text-sky-400 mt-0.5">{selectedChallenge.participantCount} Students Enrolled</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Overview</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Rules */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rules & Guidelines</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedChallenge.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submission requirements */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Submission Criteria</h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedChallenge.submissionRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submissions Showcase */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Student Submissions ({selectedChallenge.submissions.length})
                </h4>

                {selectedChallenge.submissions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No submissions uploaded yet. Be the first to deploy your solution!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedChallenge.submissions.map(sub => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-bold text-xs text-white">{sub.title}</div>
                            <div className="text-[11px] text-slate-400">
                              by {sub.studentName} · {sub.submittedAt}
                            </div>
                          </div>
                        </div>

                        <a
                          href={sub.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium shrink-0"
                        >
                          <span>View Code</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedChallenge(null);
                  setActiveChallengeDetail(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {!isUserJoined ? (
                  <button
                    onClick={() => {
                      joinChallenge(selectedChallenge.id);
                      setSelectedChallenge({
                        ...selectedChallenge,
                        participantCount: selectedChallenge.participantCount + 1,
                        participants: currentUser ? [...selectedChallenge.participants, currentUser.id] : selectedChallenge.participants
                      });
                    }}
                    className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20"
                  >
                    Join Challenge
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-5 py-2 bg-gradient-to-r from-teal-400 to-sky-500 hover:from-teal-300 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Your Work</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {isSubmitModalOpen && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="font-bold text-sm text-white">Upload Challenge Solution</h3>
                <p className="text-xs text-slate-400">{selectedChallenge.title}</p>
              </div>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project / Solution Title</label>
                <input
                  type="text"
                  required
                  value={submissionTitle}
                  onChange={e => setSubmissionTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue in Go"
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repo or Live Prototype Link</label>
                <input
                  type="url"
                  required
                  value={submissionLink}
                  onChange={e => setSubmissionLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Benchmark Results</label>
                <textarea
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  rows={3}
                  placeholder="Briefly describe what you built, architecture choices, and test results..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  Submit Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
