import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, User, FileText, FolderGit2, Trophy, ArrowRight, ExternalLink } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    students, 
    posts, 
    challenges, 
    navigateToProfile, 
    setActivePostDetail, 
    setActiveChallengeDetail,
    setActiveTab
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'students' | 'posts' | 'projects' | 'challenges'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Students
  const matchingStudents = students.filter(s => {
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.branch.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(q))
    );
  });

  // Search Posts
  const matchingPosts = posts.filter(p => {
    if (!q) return true;
    return (
      p.content.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Search Projects
  const allProjects = students.flatMap(s => s.projects.map(p => ({ ...p, authorName: s.name })));
  const matchingProjects = allProjects.filter(p => {
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  });

  // Search Challenges
  const matchingChallenges = challenges.filter(c => {
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const handleSelectStudent = (studentId: string) => {
    setIsSearchOpen(false);
    navigateToProfile(studentId);
  };

  const handleSelectPost = (postId: string) => {
    setIsSearchOpen(false);
    const post = posts.find(p => p.id === postId);
    if (post) {
      setActivePostDetail(post);
    }
  };

  const handleSelectChallenge = (challengeId: string) => {
    setIsSearchOpen(false);
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setActiveChallengeDetail(challenge);
      setActiveTab('challenges');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1E293B] gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search students, skills, projects, challenges, posts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#F8FAFC] placeholder-slate-500 text-sm md:text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-mono text-slate-400 bg-[#141923] border border-[#1E293B] rounded-md hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1E293B] overflow-x-auto text-xs bg-[#0A0D15]">
          {(['all', 'students', 'projects', 'posts', 'challenges'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors font-medium ${
                activeCategory === cat
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141923]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Students section */}
          {(activeCategory === 'all' || activeCategory === 'students') && matchingStudents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>Students ({matchingStudents.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingStudents.slice(0, 4).map(st => (
                  <div
                    key={st.id}
                    onClick={() => handleSelectStudent(st.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923]/60 hover:bg-[#141923] border border-transparent hover:border-sky-500/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={st.profilePhoto} 
                        alt={st.name} 
                        className="w-10 h-10 rounded-full object-cover border border-[#1E293B]" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#F8FAFC] group-hover:text-sky-400 transition-colors">
                            {st.name}
                          </span>
                          <span className="text-xs text-slate-500">· {st.rollNumber}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {st.branch} · {st.year} · <span className="text-teal-400 font-medium">Rank #{st.leaderboardRank}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects section */}
          {(activeCategory === 'all' || activeCategory === 'projects') && matchingProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <FolderGit2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Projects ({matchingProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingProjects.slice(0, 3).map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => handleSelectStudent(proj.studentId)}
                    className="p-3 rounded-xl bg-[#141923]/60 hover:bg-[#141923] border border-transparent hover:border-teal-500/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-sm text-[#F8FAFC] group-hover:text-teal-400 transition-colors">
                        {proj.title}
                      </div>
                      <span className="text-xs text-slate-500">by {proj.authorName}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="text-[11px] text-slate-400 bg-[#0F131C] px-2 py-0.5 rounded border border-[#1E293B]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges section */}
          {(activeCategory === 'all' || activeCategory === 'challenges') && matchingChallenges.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                <span>Challenges ({matchingChallenges.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingChallenges.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#141923]/60 hover:bg-[#141923] border border-transparent hover:border-purple-500/30 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#F8FAFC] group-hover:text-purple-400">
                        {ch.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {ch.category} · {ch.participantCount} Participants · {ch.prize}
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {ch.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts section */}
          {(activeCategory === 'all' || activeCategory === 'posts') && matchingPosts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Community Posts ({matchingPosts.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingPosts.slice(0, 3).map(post => (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.id)}
                    className="p-3 rounded-xl bg-[#141923]/60 hover:bg-[#141923] border border-transparent hover:border-sky-500/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{post.studentName} · {post.studentBranchYear}</span>
                      <span className="text-sky-400">{post.category}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {matchingStudents.length === 0 && matchingProjects.length === 0 && matchingChallenges.length === 0 && matchingPosts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">We couldn't find anyone or anything matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by branch, skill name (e.g. Python, Go), or project title.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1E293B] bg-[#0A0D15] text-[11px] text-slate-500">
          <span>Navigate with arrows, press ESC to close</span>
          <span>Tip: Filter by student skills or challenge topics</span>
        </div>
      </div>
    </div>
  );
};
