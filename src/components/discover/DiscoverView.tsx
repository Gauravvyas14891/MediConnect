import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Sparkles, 
  Trophy, 
  FolderGit2, 
  Briefcase, 
  ArrowRight,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { StudentCourse, StudentBranch, AcademicYear } from '../../types';

export const DiscoverView: React.FC = () => {
  const { students, currentUser, navigateToProfile, toggleFollow } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [onlyWithInternship, setOnlyWithInternship] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const trendingSkills = [
    'All',
    'Python',
    'React & Tailwind',
    'Java',
    'PyTorch',
    'TypeScript',
    'Flutter',
    'SQL',
    'Docker',
    'SolidWorks',
    'AutoCAD',
    'UI / UX Design (Figma)'
  ];

  // Filtering
  const filteredStudents = students.filter(student => {
    // Exclude suspended students
    if (student.status === 'suspended') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchRoll = student.rollNumber.toLowerCase().includes(q);
      const matchBranch = student.branch.toLowerCase().includes(q);
      const matchSkills = student.skills.some(sk => sk.name.toLowerCase().includes(q));
      const matchProjects = student.projects.some(p => p.title.toLowerCase().includes(q) || p.technologies.some(t => t.toLowerCase().includes(q)));
      if (!matchName && !matchRoll && !matchBranch && !matchSkills && !matchProjects) {
        return false;
      }
    }

    // Course filter
    if (selectedCourse !== 'All' && student.course !== selectedCourse) {
      return false;
    }

    // Branch filter
    if (selectedBranch !== 'All' && !student.branch.includes(selectedBranch)) {
      return false;
    }

    // Year filter
    if (selectedYear !== 'All' && student.year !== selectedYear) {
      return false;
    }

    // Skill filter
    if (selectedSkill !== 'All') {
      const hasSkill = student.skills.some(sk => sk.name.toLowerCase().includes(selectedSkill.toLowerCase()));
      if (!hasSkill) return false;
    }

    // Internship filter
    if (onlyWithInternship && student.internships.length === 0) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
          Discover Campus Peers
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore fellow students across disciplines by branch, technical skills, open-source projects, and internship experience.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4 text-sky-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search students by name, roll number, project topic, or skill (e.g. Python, Raft, Docker)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#141923] border border-[#1E293B] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Course */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree Course</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="B.Sc Data Science">B.Sc Data Science</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Branch / Stream</label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Branches</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="AI">CSE - AI & ML</option>
              <option value="IT">Information Tech (IT)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="Data Science">Data Science</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil Engineering (CE)</option>
              <option value="Electrical">Electrical Engineering (EE)</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Internship Checkbox */}
          <div className="flex flex-col justify-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={onlyWithInternship}
                onChange={e => setOnlyWithInternship(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141923] border-[#1E293B] text-sky-500 focus:ring-0"
              />
              <span>Has Internship Exp</span>
            </label>
          </div>
        </div>

        {/* Trending Skills Quick Filters */}
        <div className="pt-2 border-t border-[#1E293B]/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Filter by In-Demand Campus Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trendingSkills.map(sk => {
              const isSelected = selectedSkill === sk;
              return (
                <button
                  key={sk}
                  onClick={() => setSelectedSkill(sk)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-[#141923] text-slate-300 border border-[#1E293B] hover:border-slate-700'
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredStudents.length}</strong> campus students</span>
        {(searchQuery || selectedCourse !== 'All' || selectedBranch !== 'All' || selectedYear !== 'All' || selectedSkill !== 'All' || onlyWithInternship) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCourse('All');
              setSelectedBranch('All');
              setSelectedYear('All');
              setSelectedSkill('All');
              setOnlyWithInternship(false);
            }}
            className="text-sky-400 hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No students found matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the selected skill and branch filters.
          </p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.slice(0, visibleCount).map(student => {
            const isSelf = currentUser?.id === student.id;
            return (
              <div
                key={student.id}
                className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Header Row */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div 
                      onClick={() => navigateToProfile(student.id)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={student.profilePhoto}
                        alt={student.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-sky-500/20 group-hover:ring-sky-500/50 transition-all"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                          <span>{student.name}</span>
                          {isSelf && (
                            <span className="text-[10px] text-slate-400 font-mono font-normal">(You)</span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {student.course} · {student.branch.split(' ')[0]}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {student.year} · Roll: {student.rollNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        Rank #{student.leaderboardRank}
                      </span>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {student.bio || 'Campus student focusing on core computer science and engineering applications.'}
                  </p>

                  {/* Top Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {student.skills.slice(0, 3).map(sk => (
                      <span
                        key={sk.id}
                        className="text-[11px] text-slate-300 bg-[#141923] px-2 py-0.5 rounded-md border border-[#1E293B]"
                      >
                        {sk.name}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{student.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Metrics & Profile CTA */}
                <div className="pt-4 mt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 space-x-2">
                    <span><strong className="text-white">{student.projects.length}</strong> Projs</span>
                    <span>·</span>
                    <span><strong className="text-sky-400 font-mono">{student.cgpa.toFixed(2)}</strong> CGPA</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isSelf && (
                      <button
                        onClick={() => toggleFollow(student.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          student.isFollowing
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                            : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-white'
                        }`}
                        title={student.isFollowing ? 'Connected' : 'Connect with student'}
                      >
                        {student.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => navigateToProfile(student.id)}
                      className="px-3 py-1.5 bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-sky-500/40 text-xs font-semibold text-sky-400 rounded-xl transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length > visibleCount && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setVisibleCount(v => v + 24)}
              className="px-5 py-2.5 rounded-xl bg-[#0F131C] hover:bg-[#141923] border border-[#1E293B] hover:border-sky-500/40 text-xs font-semibold text-sky-400 transition-all"
            >
              Show More Peers ({filteredStudents.length - visibleCount} remaining)
            </button>
            <button
              onClick={() => setVisibleCount(filteredStudents.length)}
              className="px-4 py-2.5 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-xs font-medium text-slate-300 transition-all"
            >
              Show All ({filteredStudents.length})
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
};
