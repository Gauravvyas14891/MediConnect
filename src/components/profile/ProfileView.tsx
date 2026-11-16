import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  MapPin, 
  Share2, 
  Edit3, 
  UserPlus, 
  UserCheck, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Trophy, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ThumbsUp, 
  Code2, 
  Users, 
  ArrowUpRight,
  Upload,
  FileText,
  Download,
  Eye,
  X,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { Certification } from '../../types';
import { calculateStudentScore, calculateProfileCompletion } from '../../utils/scoring';
import { 
  EditProfileModal, 
  AddProjectModal, 
  AddInternshipModal, 
  AddCertificationModal 
} from './ProfileModals';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin,
    canAccessAdmin,
    viewingStudentId, 
    students, 
    toggleFollow, 
    endorseSkill, 
    deleteProject, 
    deleteInternship, 
    attachCertificationFile,
    deleteCertification,
    switchToAdmin,
    switchToStudent,
    setActiveTab,
    addToast 
  } = useApp();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [isAddInternOpen, setIsAddInternOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [attachingCertId, setAttachingCertId] = useState<string | null>(null);
  const certFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAttachExistingCertFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !attachingCertId) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Please upload a PDF, PNG, JPG, or WebP certificate file.', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      addToast('Certificate file size must be under 3 MB.', 'error');
      return;
    }

    const targetId = attachingCertId;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        attachCertificationFile(targetId, reader.result, file.name, file.type);
      }
      setAttachingCertId(null);
      if (certFileInputRef.current) certFileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Target student: either viewingStudentId or fallback to currentUser or first student
  const student = students.find(s => s.id === viewingStudentId) || currentUser || students[0];

  if (!student) return null;

  const isOwnProfile = currentUser?.id === student.id;
  const { total, breakdown } = calculateStudentScore(student);
  const { percentage } = calculateProfileCompletion(student);

  const handleShare = () => {
    const url = window.location.origin + '?student=' + student.rollNumber;
    navigator.clipboard?.writeText(url);
    addToast('Profile link copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header & Banner Card */}
      <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden shadow-2xl relative">
        {/* Cover Banner */}
        <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-sky-900/40 via-teal-900/30 to-purple-900/40 overflow-hidden">
          {student.coverImage ? (
            <img 
              src={student.coverImage} 
              alt="Profile Cover" 
              className="w-full h-full object-cover opacity-85" 
            />
          ) : (
            <div className="w-full h-full bg-[#141923]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-transparent to-black/30" />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-8 pb-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative group">
                <img
                  src={student.profilePhoto}
                  alt={student.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-[#0F131C] shadow-2xl bg-[#141923] ring-1 ring-sky-500/30"
                />
                <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0F131C]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
                    {student.name}
                  </h1>
                  <span className="font-mono text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {student.rollNumber}
                  </span>
                  {student.gender && (
                    <span className="text-[11px] capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {student.gender}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    Rank #{student.leaderboardRank}
                  </span>
                  {student.isVerified && (
                    <span className="text-[10px] flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified Enrollment
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {student.course} in {student.branch} · {student.year} (Sem {student.semester})
                </p>

                <div className="text-xs text-slate-400 font-mono">
                  {student.email}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                    <span>{student.collegeName}</span>
                  </span>
                  {student.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{student.location}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <strong className="text-white">{student.followersCount}</strong> peers connected
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              {isOwnProfile ? (
                <>
                  {canAccessAdmin && (
                    isAdmin ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveTab('admin')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Open Admin Access</span>
                        </button>
                        <button
                          type="button"
                          onClick={switchToStudent}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-sky-500/40 text-sky-300 font-semibold text-xs transition-all"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>Normal Student Access</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={switchToAdmin}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-bold text-xs shadow-md transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                        <span>Switch to Admin Mode</span>
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] text-slate-300 border border-[#1E293B] hover:text-white transition-all"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollow(student.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      student.isFollowing
                        ? 'bg-[#141923] border border-sky-500/40 text-sky-400'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
                    }`}
                  >
                    {student.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] text-slate-300 border border-[#1E293B] hover:text-white transition-all"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio statement */}
          {student.bio && (
            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {student.bio}
            </p>
          )}

          {/* Connected External Profiles Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#1E293B]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Profiles:
            </span>

            {student.externalProfiles.github && (
              <a
                href={student.externalProfiles.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            )}

            {student.externalProfiles.linkedin && (
              <a
                href={student.externalProfiles.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-blue-500/40 text-xs text-slate-300 hover:text-sky-400 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            )}

            {student.externalProfiles.leetcode && (
              <a
                href={student.externalProfiles.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-400 transition-colors font-mono"
              >
                <span className="text-amber-400 font-bold">LC</span>
                <span>LeetCode</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            )}

            {student.externalProfiles.codeforces && (
              <a
                href={student.externalProfiles.codeforces}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] hover:border-red-500/40 text-xs text-slate-300 hover:text-red-400 transition-colors font-mono"
              >
                <span className="text-red-400 font-bold">CF</span>
                <span>Codeforces</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            )}

            {student.externalProfiles.codechef && (
              <a
                href={student.externalProfiles.codechef}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-xs text-slate-300 hover:text-amber-300 transition-colors font-mono"
              >
                <span className="text-amber-300 font-bold">CC</span>
                <span>CodeChef</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            )}

            {!student.externalProfiles.github && !student.externalProfiles.linkedin && !student.externalProfiles.leetcode && (
              <span className="text-xs text-slate-500 italic">No external coding profiles connected yet.</span>
            )}
          </div>

          {/* Authorized Role Access Control Bar (only visible on authorized student+admin profile) */}
          {isOwnProfile && canAccessAdmin && (
            <div className="mt-4 p-4 rounded-xl bg-purple-950/25 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      {isAdmin ? 'Administrator Mode Active' : 'Student & Admin Dual Access Account'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {student.email}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Switch between normal student mode and full campus admin governance controls (verify accounts, moderate posts, audit projects, manage challenges).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-all"
                    >
                      Go to Admin Page
                    </button>
                    <button
                      type="button"
                      onClick={switchToStudent}
                      className="px-3.5 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-slate-200 font-semibold text-xs transition-all"
                    >
                      Switch to Student Access
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={switchToAdmin}
                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all"
                  >
                    Switch to Admin Mode
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Academic Performance & Leaderboard Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cumulative CGPA Card */}
        <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Cumulative GPA</div>
            <div className="text-2xl font-mono font-extrabold text-[#F8FAFC] mt-0.5">
              {student.cgpa.toFixed(2)}
            </div>
            <div className="text-[11px] text-teal-400 mt-1">40% Leaderboard Weight</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Calculated Leaderboard Score */}
        <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">MediConnect Score</div>
            <div className="text-2xl font-mono font-extrabold text-sky-400 mt-0.5">
              {total} <span className="text-xs text-slate-500">/ 100</span>
            </div>
            <button
              onClick={() => setShowScoreModal(true)}
              className="text-[11px] text-sky-400 hover:underline mt-1"
            >
              Inspect formula breakdown &rarr;
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Profile Strength */}
        <div className="p-4 rounded-2xl bg-[#0F131C] border border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Profile Completion</div>
            <div className="text-2xl font-mono font-extrabold text-purple-400 mt-0.5">
              {percentage}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {percentage === 100 ? 'Verified profile' : 'Add remaining sections'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Projects, Skills, Internships, Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects & Internships (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects Section */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Featured Projects ({student.projects.length})
                </h2>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setIsAddProjOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>

            {student.projects.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#1E293B] rounded-xl">
                <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No projects added yet.</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsAddProjOpen(true)}
                    className="mt-3 px-3.5 py-1.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow"
                  >
                    Add Your First Project
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {student.projects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-[#141923] border border-[#1E293B] hover:border-teal-500/30 transition-all flex flex-col justify-between group relative"
                  >
                    {isOwnProfile && (
                      <button
                        onClick={() => deleteProject(proj.id)}
                        title="Delete Project"
                        className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-teal-400 font-semibold mb-1 pr-6">
                        <span>{proj.category}</span>
                        {proj.starsCount ? <span>★ {proj.starsCount}</span> : null}
                      </div>

                      <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-teal-400 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-slate-300 bg-[#0F131C] px-2 py-0.5 rounded border border-[#1E293B]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 mt-3 border-t border-[#1E293B]/80 text-xs">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-slate-300 hover:text-white"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Internships Section */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Internships & Work Experience ({student.internships.length})
                </h2>
              </div>
              {isOwnProfile && (
                <button
                  onClick={() => setIsAddInternOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Internship</span>
                </button>
              )}
            </div>

            {student.internships.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#1E293B] rounded-xl text-xs text-slate-400">
                No internships recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {student.internships.map(intern => (
                  <div
                    key={intern.id}
                    className="p-4 rounded-xl bg-[#141923] border border-[#1E293B] flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative"
                  >
                    {isOwnProfile && (
                      <button
                        onClick={() => deleteInternship(intern.id)}
                        title="Delete Internship"
                        className="absolute top-3 right-3 text-slate-600 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="space-y-1 pr-6">
                      <div className="font-bold text-sm text-white">{intern.role}</div>
                      <div className="text-xs text-sky-400 font-medium">
                        {intern.organization} {intern.location && `· ${intern.location}`}
                      </div>
                      <p className="text-xs text-slate-300 pt-1 leading-relaxed">{intern.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {intern.startDate} – {intern.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications Section */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <input
              ref={certFileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleAttachExistingCertFile}
              className="hidden"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Certifications ({student.certifications.length})
                </h2>
              </div>
              {isOwnProfile && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddCertOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold text-purple-300 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add Certificate File</span>
                  </button>
                  <button
                    onClick={() => setIsAddCertOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Cert</span>
                  </button>
                </div>
              )}
            </div>

            {student.certifications.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-[#1E293B] rounded-xl space-y-2.5">
                <p className="text-xs text-slate-400">No certifications added yet.</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsAddCertOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Certificate</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.certifications.map(cert => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-[#141923] border border-[#1E293B] flex flex-col justify-between gap-2 relative"
                  >
                    {isOwnProfile && (
                      <button
                        onClick={() => deleteCertification(cert.id)}
                        title="Delete Certification"
                        className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="space-y-0.5 pr-6">
                      <div className="font-bold text-xs text-white line-clamp-1">{cert.name}</div>
                      <div className="text-[11px] text-slate-400">{cert.issuer} · {cert.issueDate}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-[#1E293B]/60">
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <span>Show credential</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}

                      {cert.fileDataUrl ? (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => setPreviewCert(cert)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] font-semibold text-purple-300"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View File</span>
                          </button>
                          <a
                            href={cert.fileDataUrl}
                            download={cert.fileName || `${cert.name}.pdf`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0F131C] hover:bg-slate-800 border border-[#1E293B] text-[11px] text-slate-300"
                            title={`Download ${cert.fileName || 'certificate'}`}
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      ) : isOwnProfile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAttachingCertId(cert.id);
                            certFileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0F131C] hover:bg-[#1A2230] border border-[#1E293B] hover:border-purple-500/40 text-[11px] font-medium text-slate-300 hover:text-purple-300 ml-auto"
                        >
                          <Upload className="w-3 h-3 text-purple-400" />
                          <span>Attach File</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skills & Peer Endorsements, Achievements, Badges */}
        <div className="space-y-6">
          {/* Skills & Endorsements */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Verified Skills ({student.skills.length})
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {student.skills.map(sk => {
                const hasEndorsed = currentUser && sk.endorsedBy?.includes(currentUser.id);
                return (
                  <div
                    key={sk.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#141923] border border-[#1E293B]"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#F8FAFC]">{sk.name}</div>
                      <div className="text-[10px] text-slate-500">{sk.category}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-300 font-semibold">
                        {sk.endorsements}
                      </span>
                      {!isOwnProfile && (
                        <button
                          onClick={() => endorseSkill(student.id, sk.id)}
                          title={hasEndorsed ? 'Remove endorsement' : 'Endorse skill'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            hasEndorsed
                              ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                              : 'bg-[#0F131C] text-slate-400 border-[#1E293B] hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges & Recognition */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Earned Badges ({student.badges.length})
              </h2>
            </div>

            <div className="space-y-2.5">
              {student.badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#141923] border border-[#1E293B]"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F8FAFC]">{badge.name}</div>
                    <p className="text-[11px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Honors & Achievements */}
          {student.achievements.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Achievements & Awards
                </h2>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {student.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-[#141923]">
                    <span className="text-amber-400 shrink-0 mt-0.5">🏆</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Formula Score Inspector Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="font-bold text-sm text-white">Campus Ranking Formula Breakdown</div>
              <button onClick={() => setShowScoreModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              MediConnect ranks students objectively based on academic and practical capability. Scores are computed automatically:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923]">
                <span>1. Cumulative CGPA (40%)</span>
                <span className="font-mono text-sky-400 font-bold">{breakdown.cgpaScore} / 40.0 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923]">
                <span>2. Projects Published (20%)</span>
                <span className="font-mono text-teal-400 font-bold">{breakdown.projectsScore} / 20.0 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923]">
                <span>3. Internships (20%)</span>
                <span className="font-mono text-emerald-400 font-bold">{breakdown.internshipsScore} / 20.0 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923]">
                <span>4. Skills & Certs (10%)</span>
                <span className="font-mono text-purple-400 font-bold">{breakdown.skillsAndCertsScore} / 10.0 pts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923]">
                <span>5. Competitive Programming (10%)</span>
                <span className="font-mono text-amber-400 font-bold">{breakdown.competitiveProgrammingScore} / 10.0 pts</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between font-bold text-sm">
              <span className="text-white">Total Overall Score</span>
              <span className="font-mono text-sky-400">{total} / 100</span>
            </div>

            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full py-2 bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-xs font-semibold text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Certificate File Preview Modal */}
      {previewCert && previewCert.fileDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{previewCert.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {previewCert.issuer} · {previewCert.fileName || 'Certificate Document'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewCert.fileDataUrl}
                  download={previewCert.fileName || `${previewCert.name}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-[#080B12] flex items-center justify-center min-h-[360px]">
              {previewCert.fileType?.startsWith('image/') ? (
                <img
                  src={previewCert.fileDataUrl}
                  alt={previewCert.name}
                  className="max-w-full max-h-[70vh] rounded-lg border border-[#1E293B] object-contain"
                />
              ) : (
                <iframe
                  src={previewCert.fileDataUrl}
                  title={previewCert.name}
                  className="w-full h-[65vh] rounded-lg border border-[#1E293B] bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <AddProjectModal isOpen={isAddProjOpen} onClose={() => setIsAddProjOpen(false)} />
      <AddInternshipModal isOpen={isAddInternOpen} onClose={() => setIsAddInternOpen(false)} />
      <AddCertificationModal isOpen={isAddCertOpen} onClose={() => setIsAddCertOpen(false)} />
    </div>
  );
};
