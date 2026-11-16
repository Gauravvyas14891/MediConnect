import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  GraduationCap, 
  Flame, 
  Plus, 
  CheckCircle2, 
  Users, 
  Compass, 
  ExternalLink,
  MessageSquare,
  Heart,
  Calendar,
  Share2,
  FolderGit2,
  TrendingUp,
  Megaphone
} from 'lucide-react';
import { calculateProfileCompletion } from '../../utils/scoring';

interface DashboardViewProps {
  onOpenCreatePost: () => void;
  onOpenAddProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenCreatePost, onOpenAddProject }) => {
  const { 
    currentUser, 
    students, 
    posts, 
    challenges, 
    announcements, 
    navigateToProfile, 
    setActiveTab, 
    setActivePostDetail,
    setActiveChallengeDetail,
    setShowOnboarding,
    toggleLikePost
  } = useApp();

  if (!currentUser) return null;

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const { percentage, missingItems } = calculateProfileCompletion(currentUser);

  // Recommended students: same branch or shared skills, excluding current user
  const recommendedStudents = students
    .filter(s => s.id !== currentUser.id)
    .slice(0, 3);

  const activeChallenges = challenges.filter(c => c.status === 'Active').slice(0, 2);
  const trendingPosts = posts.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {currentUser.name.split(' ')[0]}</span>
            <span className="text-2xl animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what's happening around your campus community today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </button>
          <button
            onClick={onOpenAddProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] text-slate-200 border border-[#1E293B] hover:border-teal-500/40 font-semibold text-xs transition-all"
          >
            <FolderGit2 className="w-4 h-4 text-teal-400" />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] text-slate-200 border border-[#1E293B] hover:border-purple-500/40 font-semibold text-xs transition-all"
          >
            <Flame className="w-4 h-4 text-purple-400" />
            <span>Challenges</span>
          </button>
        </div>
      </div>

      {/* Campus Announcement Banner (if available) */}
      {announcements.length > 0 && (
        <div className="flex items-center justify-between gap-3 p-3 sm:px-4 rounded-xl bg-gradient-to-r from-sky-500/10 via-[#0F131C] to-purple-500/10 border border-sky-500/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <Megaphone className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-sky-300 mr-2">CAMPUS NOTICE:</span>
              <span className="text-xs text-slate-300">{announcements[0].title}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">{announcements[0].publishedAt}</span>
        </div>
      )}

      {/* Profile Completion Card (if not 100%) */}
      {percentage < 100 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#101726] to-[#0D121D] border border-sky-500/20 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Profile Strength</span>
                <span className="text-xs font-mono font-bold text-white bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {percentage}% Complete
                </span>
              </div>
              <p className="text-xs text-slate-300">
                A completed profile unlocks higher visibility on the campus leaderboard and peer project recruitment.
              </p>
              {missingItems.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400">Recommended:</span>
                  {missingItems.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-[#141923] text-slate-300 border border-[#1E293B]">
                      + {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowOnboarding(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 shrink-0 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Profile</span>
            </button>
          </div>

          <div className="w-full bg-[#1A2230] h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Academic Snapshot Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Leaderboard Position */}
        <div 
          onClick={() => setActiveTab('leaderboard')}
          className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Campus Rank</span>
            <Trophy className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">
            #{currentUser.leaderboardRank}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Score: <strong className="text-sky-400 font-mono">{currentUser.leaderboardScore}</strong></span>
            <span className="text-teal-400 font-medium">Top 5%</span>
          </div>
        </div>

        {/* CGPA */}
        <div 
          onClick={() => navigateToProfile(currentUser.id)}
          className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-teal-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cumulative CGPA</span>
            <GraduationCap className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">
            {currentUser.cgpa.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            40% of ranking weight
          </div>
        </div>

        {/* Projects Count */}
        <div 
          onClick={() => navigateToProfile(currentUser.id)}
          className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Projects Built</span>
            <FolderGit2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">
            {currentUser.projects.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            20% of ranking weight
          </div>
        </div>

        {/* Academic Program */}
        <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Program & Year</span>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
              Sem {currentUser.semester}
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-[#F8FAFC] truncate">
            {currentUser.branch.split(' ')[0]}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currentUser.course} · {currentUser.year}
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trending Campus Posts & Upcoming Challenges (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Challenges Widget */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Campus Challenges</h2>
              </div>
              <button
                onClick={() => setActiveTab('challenges')}
                className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeChallenges.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveChallengeDetail(ch);
                    setActiveTab('challenges');
                  }}
                  className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/30 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="text-sky-400 font-semibold">{ch.category}</span>
                      <span className="font-mono text-emerald-400">{ch.prize.split('+')[0]}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-sky-400 transition-colors line-clamp-1">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {ch.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1E293B] text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      {ch.participantCount} students joined
                    </span>
                    <span className="text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Join Sprint &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Community Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Trending in Student Community</h2>
              </div>
              <button
                onClick={() => setActiveTab('community')}
                className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Full Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {trendingPosts.map(post => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-slate-700/60 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      onClick={() => navigateToProfile(post.studentId)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={post.studentAvatar}
                        alt={post.studentName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-sky-500/20"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#F8FAFC] group-hover:text-sky-400 transition-colors">
                          {post.studentName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {post.studentBranchYear} · {post.createdAt}
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                      {post.category}
                    </span>
                  </div>

                  <p 
                    onClick={() => setActivePostDetail(post)}
                    className="text-xs sm:text-sm text-slate-200 line-clamp-3 cursor-pointer leading-relaxed hover:text-white"
                  >
                    {post.content}
                  </p>

                  {post.mediaUrl && (
                    <div 
                      onClick={() => setActivePostDetail(post)}
                      className="rounded-xl overflow-hidden max-h-48 border border-[#1E293B] cursor-pointer"
                    >
                      <img 
                        src={post.mediaUrl} 
                        alt="Attached media" 
                        className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-200" 
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/60 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.hasLiked ? 'text-red-400 font-semibold' : 'hover:text-slate-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => setActivePostDetail(post)}
                        className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setActivePostDetail(post)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                    >
                      Read full discussion &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Peers & Quick Tools (1 col wide) */}
        <div className="space-y-6">
          {/* Recommended Students */}
          <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Peers You May Know</h2>
              </div>
              <button
                onClick={() => setActiveTab('discover')}
                className="text-[11px] font-medium text-sky-400 hover:text-sky-300"
              >
                Discover more
              </button>
            </div>

            <div className="space-y-3">
              {recommendedStudents.map(student => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-[#141923] border border-[#1E293B]/80 hover:border-sky-500/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      onClick={() => navigateToProfile(student.id)}
                      className="flex items-center gap-2.5 cursor-pointer min-w-0"
                    >
                      <img
                        src={student.profilePhoto}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-sky-500/20"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#F8FAFC] truncate hover:text-sky-400 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {student.branch.split(' ')[0]} · {student.year}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                        Rank #{student.leaderboardRank}
                      </span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 2).map(sk => (
                      <span key={sk.id} className="text-[10px] text-slate-400 bg-[#0F131C] px-2 py-0.5 rounded border border-[#1E293B]">
                        {sk.name}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {student.projects.length} Projects · {student.cgpa.toFixed(2)} CGPA
                    </span>
                    <button
                      onClick={() => navigateToProfile(student.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MediConnect Campus Mission / Identity Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F131C] to-[#121926] border border-[#1E293B] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Campus Platform Note
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              MediConnect is designed strictly student-to-student. No faculty monitoring, no academic attendance logs — just genuine peer networking, project building, and achievements.
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Campus network active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
