import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  FileText, 
  FolderGit2, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Plus, 
  Trash2, 
  Search, 
  Megaphone, 
  Trophy, 
  GraduationCap, 
  Lock, 
  Unlock, 
  ArrowRight,
  Edit3,
  Pin,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Filter,
  Check,
  Award,
  Ban,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  FileCheck2,
  UserX,
  History
} from 'lucide-react';
import { 
  Student, 
  Post, 
  Challenge, 
  Project, 
  StudentCourse, 
  StudentBranch, 
  AcademicYear, 
  PostCategory,
  AdminAuditLog 
} from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    students, 
    posts, 
    challenges, 
    reports, 
    announcements, 
    auditLogs,
    suspendStudent, 
    restoreStudent, 
    adminVerifyStudent,
    adminEditStudent,
    adminWarnStudent,
    adminDeleteStudent,
    adminResetAvatar,
    adminEditPost,
    adminTogglePinPost,
    adminToggleLockPost,
    adminDeleteComment,
    adminVerifyProject,
    adminDeleteProject,
    adminUpdateChallenge,
    adminDisqualifySubmission,
    adminMarkSubmissionWinner,
    dismissReport, 
    resolveReport, 
    deletePost,
    createChallenge, 
    deleteChallenge, 
    createAnnouncement, 
    deleteAnnouncement, 
    switchToStudent, 
    navigateToProfile,
    addToast 
  } = useApp();

  type AdminTab = 
    | 'overview' 
    | 'students' 
    | 'moderation' 
    | 'content' 
    | 'projects' 
    | 'challenges' 
    | 'announcements' 
    | 'audit';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'active' | 'suspended' | 'verified' | 'unverified' | 'warned'>('all');
  const [postSearch, setPostSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  // MODAL STATES
  // 1. Edit Student Modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRoll, setEditRoll] = useState('');
  const [editCourse, setEditCourse] = useState<StudentCourse>('B.Tech');
  const [editBranch, setEditBranch] = useState<StudentBranch>('Computer Science (CSE)');
  const [editYear, setEditYear] = useState<AcademicYear>('3rd Year');
  const [editSemester, setEditSemester] = useState<number>(6);
  const [editCgpa, setEditCgpa] = useState<number>(8.5);
  const [editBio, setEditBio] = useState('');
  const [editIsVerified, setEditIsVerified] = useState(false);

  // 2. Warn Student Modal
  const [warningStudent, setWarningStudent] = useState<Student | null>(null);
  const [warningReason, setWarningReason] = useState('');

  // 3. Suspend Student Modal
  const [suspendingStudent, setSuspendingStudent] = useState<Student | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  // 4. Delete Student Modal
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // 5. Edit Post Modal
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostCategory, setEditPostCategory] = useState<PostCategory>('Discussion');

  // 6. Inspect Comments Modal
  const [viewingCommentsPost, setViewingCommentsPost] = useState<Post | null>(null);

  // 7. Delete Project Modal
  const [deletingProject, setDeletingProject] = useState<{ studentId: string; project: Project } | null>(null);
  const [projectDeleteReason, setProjectDeleteReason] = useState('');

  // 8. Disqualify Submission Modal
  const [disqualifyingSub, setDisqualifyingSub] = useState<{ challengeId: string; submissionId: string; subTitle: string } | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');

  // 9. New Challenge Modal
  const [isNewChallengeModal, setIsNewChallengeModal] = useState(false);
  const [chTitle, setChTitle] = useState('');
  const [chTagline, setChTagline] = useState('');
  const [chDesc, setChDesc] = useState('');
  const [chCategory, setChCategory] = useState<any>('Coding');
  const [chStart, setChStart] = useState('');
  const [chEnd, setChEnd] = useState('');
  const [chPrize, setChPrize] = useState('');
  const [chBanner, setChBanner] = useState('https://images.unsplash.com/photo-1516116211227-bbc14188f615?w=1000&h=400&fit=crop&q=80');

  // 10. New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important'>('normal');

  const pendingReports = reports.filter(r => r.status === 'pending');

  // Collect all projects across students
  const allProjects = students.flatMap(s => 
    s.projects.map(p => ({
      ...p,
      studentName: s.name,
      studentRoll: s.rollNumber,
      studentAvatar: s.profilePhoto,
      studentBranch: s.branch
    }))
  );

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = !studentSearch.trim() || 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.branch.toLowerCase().includes(studentSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (studentStatusFilter === 'active') return s.status === 'active';
    if (studentStatusFilter === 'suspended') return s.status === 'suspended';
    if (studentStatusFilter === 'verified') return !!s.isVerified;
    if (studentStatusFilter === 'unverified') return !s.isVerified;
    if (studentStatusFilter === 'warned') return (s.warningsCount || 0) > 0;
    return true;
  });

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (!postSearch.trim()) return true;
    const q = postSearch.toLowerCase();
    return p.content.toLowerCase().includes(q) || 
      p.studentName.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
  });

  // Filter projects
  const filteredProjects = allProjects.filter(p => {
    if (!projectSearch.trim()) return true;
    const q = projectSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.studentName.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q));
  });

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditFilter === 'all') return true;
    return log.actionType.startsWith(auditFilter);
  });

  // Handlers
  const handleOpenEditStudent = (st: Student) => {
    setEditingStudent(st);
    setEditName(st.name);
    setEditEmail(st.email);
    setEditRoll(st.rollNumber);
    setEditCourse(st.course);
    setEditBranch(st.branch);
    setEditYear(st.year);
    setEditSemester(st.semester);
    setEditCgpa(st.cgpa);
    setEditBio(st.bio);
    setEditIsVerified(!!st.isVerified);
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    adminEditStudent(editingStudent.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      rollNumber: editRoll.trim(),
      course: editCourse,
      branch: editBranch,
      year: editYear,
      semester: Number(editSemester),
      cgpa: Number(editCgpa),
      bio: editBio.trim(),
      isVerified: editIsVerified
    });
    setEditingStudent(null);
  };

  const handleIssueWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningStudent || !warningReason.trim()) return;
    adminWarnStudent(warningStudent.id, warningReason.trim());
    setWarningStudent(null);
    setWarningReason('');
  };

  const handleConfirmSuspension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendingStudent) return;
    suspendStudent(suspendingStudent.id, suspensionReason.trim() || 'Academic integrity or code of conduct violation');
    setSuspendingStudent(null);
    setSuspensionReason('');
  };

  const handleConfirmDeleteStudent = () => {
    if (!deletingStudent) return;
    adminDeleteStudent(deletingStudent.id);
    setDeletingStudent(null);
  };

  const handleOpenEditPost = (p: Post) => {
    setEditingPost(p);
    setEditPostContent(p.content);
    setEditPostCategory(p.category);
  };

  const handleSavePostEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editPostContent.trim()) return;
    adminEditPost(editingPost.id, editPostContent.trim(), editPostCategory);
    setEditingPost(null);
  };

  const handleConfirmDeleteProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingProject) return;
    adminDeleteProject(deletingProject.studentId, deletingProject.project.id, projectDeleteReason.trim());
    setDeletingProject(null);
    setProjectDeleteReason('');
  };

  const handleConfirmDisqualify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disqualifyingSub || !disqualifyReason.trim()) return;
    adminDisqualifySubmission(disqualifyingSub.challengeId, disqualifyingSub.submissionId, disqualifyReason.trim());
    setDisqualifyingSub(null);
    setDisqualifyReason('');
  };

  const handleCreateChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle.trim() || !chDesc.trim()) return;

    createChallenge({
      title: chTitle.trim(),
      tagline: chTagline.trim() || 'Campus Student Challenge',
      description: chDesc.trim(),
      category: chCategory,
      startDate: chStart || 'Oct 2026',
      endDate: chEnd || 'Nov 2026',
      status: 'Active',
      bannerImage: chBanner.trim(),
      prize: chPrize || '₹10,000 + MediConnect Badges',
      pointsReward: 40,
      rules: [
        'Must be registered Medi-Caps student.',
        'Solo or pairs allowed.',
        'Original code authored during challenge window.'
      ],
      submissionRequirements: [
        'GitHub repository link',
        'Demonstration video or live deployment link'
      ]
    });

    setChTitle('');
    setChTagline('');
    setChDesc('');
    setIsNewChallengeModal(false);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    createAnnouncement(annTitle.trim(), annContent.trim(), annPriority);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Admin Command Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-[#0F131C] to-slate-900 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                MediConnect Platform Administration
              </h1>
              <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                Ethical Governance & Authenticity Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser ? `Authenticated as ${currentUser.name} (${currentUser.email}) · ` : ''}Authority to edit, moderate, verify student credentials, enforce academic honesty, and audit campus activities.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('announcements')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-[#1E293B] text-slate-300 text-xs font-semibold transition-all"
          >
            <Megaphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Broadcast</span>
          </button>
          <button
            onClick={switchToStudent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Switch to Student Access</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#1E293B]">
        {[
          { id: 'overview', label: 'Platform Overview', icon: SlidersHorizontal },
          { id: 'students', label: `Student Roster (${students.length})`, icon: Users },
          { id: 'moderation', label: `Moderation Queue (${pendingReports.length})`, icon: AlertTriangle, badge: pendingReports.length > 0 },
          { id: 'content', label: `Community Posts (${posts.length})`, icon: MessageSquare },
          { id: 'projects', label: `Academic Projects (${allProjects.length})`, icon: FolderGit2 },
          { id: 'challenges', label: `Competitions (${challenges.length})`, icon: Trophy },
          { id: 'announcements', label: `Broadcasts (${announcements.length})`, icon: Megaphone },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: History }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as AdminTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl whitespace-nowrap font-semibold transition-all border-b-2 ${
                isActive
                  ? 'bg-[#0F131C] text-purple-300 border-purple-500 shadow-sm'
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-[#0F131C]/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
              {t.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Students</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{students.length}</div>
              <div className="text-[10px] text-emerald-400 mt-1">Institutional</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Verified</div>
              <div className="text-xl sm:text-2xl font-extrabold text-teal-400 font-mono mt-1">
                {students.filter(s => s.isVerified).length}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Badge holders</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Today</div>
              <div className="text-xl sm:text-2xl font-extrabold text-sky-400 font-mono mt-1">
                {students.filter(s => s.status === 'active').length}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">In good standing</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Suspended</div>
              <div className="text-xl sm:text-2xl font-extrabold text-red-400 font-mono mt-1">
                {students.filter(s => s.status === 'suspended').length}
              </div>
              <div className="text-[10px] text-red-400/80 mt-1">Under sanction</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Projects Built</div>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-mono mt-1">
                {allProjects.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {allProjects.filter(p => p.isVerified).length} verified
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Feed Posts</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">{posts.length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Community</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Challenges</div>
              <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono mt-1">
                {challenges.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Active sprints</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B]">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Open Reports</div>
              <div className={`text-xl sm:text-2xl font-extrabold font-mono mt-1 ${pendingReports.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pendingReports.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Pending review</div>
            </div>
          </div>

          {/* Ethical Governance Card */}
          <div className="p-5 rounded-2xl bg-[#0F131C] border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Campus Academic Integrity & Ethics Standard</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Every user is authenticated via official Medi-Caps institutional email (<code className="text-purple-300 font-mono">enrollment@medicaps.ac.in</code>). 
                  Administrators actively maintain professionalism by auditing code projects, removing dishonest claims, resolving peer flags, and warning offenders.
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('moderation')}
                className="px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-all shadow-md"
              >
                Review Flagged Reports ({pendingReports.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className="px-3.5 py-2 rounded-xl bg-[#141923] hover:bg-[#1A2230] text-slate-300 text-xs font-semibold transition-all border border-[#1E293B]"
              >
                View Audit Trail
              </button>
            </div>
          </div>

          {/* Two-Column Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moderation Queue Summary */}
            <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Pending Moderation Flags</span>
                </h3>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Manage queue &rarr;
                </button>
              </div>

              {pendingReports.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                  No reports pending. All student content complies with community guidelines!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingReports.slice(0, 3).map(rep => (
                    <div key={rep.id} className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-300">Flagged: {rep.reason}</span>
                        <span className="text-[10px] text-slate-500">{rep.reportedAt}</span>
                      </div>
                      <p className="text-slate-300 italic line-clamp-2">"{rep.contentSnippet}"</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-500 text-[11px]">Author: {rep.authorName}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => dismissReport(rep.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#0F131C] text-slate-300 hover:text-white"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => resolveReport(rep.id, true)}
                            className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold"
                          >
                            Remove Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Governance Audit Log Snippet */}
            <div className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  <span>Recent Administrative Actions</span>
                </h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs text-purple-400 hover:underline"
                >
                  Full audit trail &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{log.targetTitle}</span>
                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1">{log.details}</p>
                    <div className="text-[10px] text-purple-300 font-mono">
                      Action: {log.actionType.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENTS ROSTER TAB */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute inset-y-0 left-3 my-auto" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Search by student name, roll number, or branch..."
                className="w-full pl-9 pr-3 py-2 bg-[#0F131C] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Students' },
                { id: 'active', label: 'Active' },
                { id: 'verified', label: 'Verified Badge' },
                { id: 'unverified', label: 'Unverified' },
                { id: 'warned', label: 'Warned' },
                { id: 'suspended', label: 'Suspended' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStudentStatusFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    studentStatusFilter === f.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-[#0F131C] text-slate-400 hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student List */}
          <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden divide-y divide-[#1E293B]">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No students match your search criteria.
              </div>
            ) : (
              filteredStudents.map(st => (
                <div key={st.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141923]/40 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img 
                      src={st.profilePhoto} 
                      alt={st.name} 
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#1E293B] shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">{st.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{st.rollNumber}</span>
                        
                        {st.isVerified && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                            <CheckCircle2 className="w-3 h-3 text-teal-400" />
                            Verified
                          </span>
                        )}

                        {st.status === 'suspended' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            SUSPENDED
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        )}

                        {st.warningsCount && st.warningsCount > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {st.warningsCount} Warning{st.warningsCount > 1 ? 's' : ''}
                          </span>
                        ) : null}
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5">
                        {st.email} · {st.course} {st.branch} ({st.year}) · CGPA {st.cgpa.toFixed(2)} · Score {st.leaderboardScore} (Rank #{st.leaderboardRank})
                      </div>

                      {st.suspensionReason && (
                        <div className="text-[11px] text-red-300 mt-1 italic">
                          Suspension Reason: {st.suspensionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <button
                      onClick={() => navigateToProfile(st.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#141923] text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-[#1A2230] border border-[#1E293B]"
                      title="Inspect student public profile"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleOpenEditStudent(st)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141923] text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1A2230] border border-[#1E293B]"
                      title="Edit student record"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => adminVerifyStudent(st.id, !st.isVerified)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        st.isVerified
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 hover:bg-teal-500/20'
                          : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-teal-400'
                      }`}
                      title="Toggle Medi-Caps official enrollment verification badge"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{st.isVerified ? 'Unverify' : 'Verify'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setWarningStudent(st);
                        setWarningReason('');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
                      title="Issue official code of conduct ethics warning"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Warn</span>
                    </button>

                    {st.status === 'active' ? (
                      <button
                        onClick={() => {
                          setSuspendingStudent(st);
                          setSuspensionReason('');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-xs font-semibold text-red-400 hover:bg-red-500/20 border border-red-500/30"
                        title="Suspend account for disciplinary breach"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Suspend</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => restoreStudent(st.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                        title="Restore account to good standing"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    )}

                    <button
                      onClick={() => adminResetAvatar(st.id)}
                      className="p-1.5 rounded-lg bg-[#141923] text-slate-400 hover:text-white border border-[#1E293B]"
                      title="Reset non-compliant profile photo to standard default"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingStudent(st)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                      title="Purge student profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODERATION QUEUE TAB */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Peer Incident Reports & Moderation Queue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigate student reports of spam, academic dishonesty, unauthorized material, or harassment.
              </p>
            </div>
            <span className="text-xs text-purple-300 font-mono bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">
              {pendingReports.length} Actionable
            </span>
          </div>

          <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden divide-y divide-[#1E293B]">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No reports in the system.
              </div>
            ) : (
              reports.map(rep => (
                <div key={rep.id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rep.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : rep.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {rep.status}
                      </span>
                      <span className="text-xs font-bold text-white">Reason: {rep.reason}</span>
                    </div>
                    <span className="text-xs text-slate-500">{rep.reportedAt}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141923] text-xs text-slate-300 border border-[#1E293B]">
                    <div className="text-[10px] text-slate-500 mb-1 font-semibold uppercase">Flagged Snippet:</div>
                    "{rep.contentSnippet}"
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-1">
                    <div>
                      Reported by: <span className="text-white font-medium">{rep.reporterName}</span> · Author: <span className="text-white font-medium">{rep.authorName}</span>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dismissReport(rep.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#141923] hover:bg-[#1A2230] text-slate-300 text-xs font-semibold border border-[#1E293B]"
                        >
                          Dismiss False Alarm
                        </button>
                        <button
                          onClick={() => resolveReport(rep.id, true)}
                          className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow"
                        >
                          Remove Flagged Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* COMMUNITY CONTENT TAB */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute inset-y-0 left-3 my-auto" />
              <input
                type="text"
                value={postSearch}
                onChange={e => setPostSearch(e.target.value)}
                placeholder="Search posts by author, keyword, or tag..."
                className="w-full pl-9 pr-3 py-2 bg-[#0F131C] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredPosts.length} community posts
            </span>
          </div>

          <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden divide-y divide-[#1E293B]">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No posts match search criteria.
              </div>
            ) : (
              filteredPosts.map(p => (
                <div key={p.id} className="p-4 sm:p-5 space-y-3 hover:bg-[#141923]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={p.studentAvatar} alt={p.studentName} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white">{p.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.studentRoll}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                            {p.category}
                          </span>
                          {p.isPinned && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          {p.isLocked && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                          {p.moderatedByAdmin && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                              Admin Moderated
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{p.studentBranchYear} · {p.createdAt}</div>
                      </div>
                    </div>

                    {/* Admin actions on post */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => adminTogglePinPost(p.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          p.isPinned
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-sky-400'
                        }`}
                        title={p.isPinned ? 'Unpin from feed' : 'Pin to top of feed'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => adminToggleLockPost(p.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          p.isLocked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-[#141923] text-slate-400 border-[#1E293B] hover:text-amber-400'
                        }`}
                        title={p.isLocked ? 'Unlock comments' : 'Lock discussion comments'}
                      >
                        {p.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditPost(p)}
                        className="p-1.5 rounded-lg bg-[#141923] text-slate-400 hover:text-white border border-[#1E293B]"
                        title="Edit post text"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setViewingCommentsPost(p)}
                        className="px-2 py-1.5 rounded-lg bg-[#141923] text-slate-400 hover:text-white border border-[#1E293B] text-xs font-semibold flex items-center gap-1"
                        title="Inspect and moderate comments"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{p.comments.length}</span>
                      </button>

                      <button
                        onClick={() => deletePost(p.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                        title="Remove post permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{p.content}</p>

                  {p.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {p.tags.map(t => (
                        <span key={t} className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ACADEMIC PROJECTS VERIFICATION TAB */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute inset-y-0 left-3 my-auto" />
              <input
                type="text"
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
                placeholder="Search projects by title, tech stack, or student..."
                className="w-full pl-9 pr-3 py-2 bg-[#0F131C] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Audit code originality, verify GitHub repos, and purge plagiarized submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-500 text-xs">
                No projects match the search query.
              </div>
            ) : (
              filteredProjects.map(pr => (
                <div key={pr.id} className="p-4 sm:p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-teal-400 uppercase">{pr.category}</span>
                          {pr.isVerified ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3 text-teal-400" /> Verified Authentic
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Unverified
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-white mt-1">{pr.title}</h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {pr.githubUrl && (
                          <a 
                            href={pr.githubUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#141923] text-slate-400 hover:text-white border border-[#1E293B]"
                            title="Open repository"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => setDeletingProject({ studentId: pr.studentId, project: pr })}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                          title="Purge plagiarized or fraudulent project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{pr.description}</p>

                    <div className="flex gap-1.5 flex-wrap">
                      {pr.technologies.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#141923] border border-[#1E293B] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={pr.studentAvatar} alt={pr.studentName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-slate-300 font-medium">{pr.studentName}</span>
                      <span className="text-slate-500 text-[10px] font-mono">({pr.studentRoll})</span>
                    </div>

                    <button
                      onClick={() => adminVerifyProject(pr.studentId, pr.id, !pr.isVerified)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        pr.isVerified
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25'
                          : 'bg-purple-500 hover:bg-purple-400 text-white border-transparent shadow'
                      }`}
                    >
                      {pr.isVerified ? 'Revoke Verification' : 'Verify Project'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CHALLENGES ADJUDICATION TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Manage Campus Sprints & Competitions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Create hackathons, audit student submissions, and declare official winners.
              </p>
            </div>
            <button
              onClick={() => setIsNewChallengeModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Challenge</span>
            </button>
          </div>

          <div className="space-y-6">
            {challenges.map(ch => (
              <div key={ch.id} className="p-5 rounded-2xl bg-[#0F131C] border border-[#1E293B] space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase">{ch.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        ch.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ch.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white mt-1">{ch.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ch.tagline}</p>
                  </div>

                  <button
                    onClick={() => deleteChallenge(ch.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                    title="Delete challenge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span>Enrolled: <strong className="text-white">{ch.participantCount}</strong> students</span>
                  <span>Prize: <strong className="text-emerald-400">{ch.prize}</strong></span>
                  <span>Points: <strong className="text-purple-400">+{ch.pointsReward} pts</strong></span>
                </div>

                {/* Submissions Section */}
                <div className="pt-3 border-t border-[#1E293B] space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Student Submissions ({ch.submissions.length})
                  </h4>

                  {ch.submissions.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No submissions uploaded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {ch.submissions.map(sub => (
                        <div key={sub.id} className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{sub.title}</span>
                              {sub.isWinner && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-amber-400" /> Winner
                                </span>
                              )}
                              {sub.isDisqualified && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                  DISQUALIFIED: {sub.disqualificationReason}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              Submitted by <strong className="text-slate-200">{sub.studentName}</strong> · {sub.submittedAt}
                            </div>
                            {sub.notes && <p className="text-slate-300 italic">"{sub.notes}"</p>}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {sub.link && (
                              <a
                                href={sub.link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#0F131C] text-slate-300 hover:text-white border border-[#1E293B] flex items-center gap-1 text-xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Demo / Repo</span>
                              </a>
                            )}

                            {!sub.isWinner && !sub.isDisqualified && (
                              <>
                                <button
                                  onClick={() => adminMarkSubmissionWinner(ch.id, sub.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Declare Winner</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setDisqualifyingSub({
                                      challengeId: ch.id,
                                      submissionId: sub.id,
                                      subTitle: sub.title
                                    });
                                    setDisqualifyReason('');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 font-semibold text-xs"
                                >
                                  Disqualify
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0F131C] border border-[#1E293B]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Broadcast Campus System Announcement
            </h2>
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Code of Conduct: Zero Tolerance for Plagiarism"
                  className="w-full px-3.5 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Body</label>
                <textarea
                  required
                  rows={3}
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Official guidance displayed on student dashboard feed..."
                  className="w-full px-3.5 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annPriority === 'important'}
                    onChange={e => setAnnPriority(e.target.checked ? 'important' : 'normal')}
                    className="w-4 h-4 rounded text-purple-500 bg-[#141923] border-[#1E293B]"
                  />
                  <span>Mark as Urgent High-Priority Circular</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Broadcasts</h3>
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl bg-[#0F131C] border border-[#1E293B] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>{ann.title}</span>
                    {ann.priority === 'important' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        IMPORTANT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                  <div className="text-[10px] text-slate-500">{ann.publishedAt} · by {ann.author}</div>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="text-slate-600 hover:text-red-400 p-1.5 shrink-0"
                  title="Remove announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT TRAIL TAB */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Platform Action & Integrity Audit Trail
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every administrative edit, verification, suspension, and moderation action is recorded.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'All Logs' },
                { id: 'student', label: 'Student Ops' },
                { id: 'post', label: 'Post Moderation' },
                { id: 'project', label: 'Projects' },
                { id: 'submission', label: 'Challenges' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAuditFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    auditFilter === f.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-[#0F131C] text-slate-400 hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#0F131C] border border-[#1E293B] overflow-hidden divide-y divide-[#1E293B]">
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No audit logs found for this filter.
              </div>
            ) : (
              filteredAuditLogs.map(log => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#141923]/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{log.targetTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <div className="text-[10px] text-slate-500">
                      Operator: <span className="text-slate-400">{log.adminName}</span> · {log.timestamp}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Administrative Edit: {editingStudent.name}</h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enrollment / Roll No</label>
                  <input
                    type="text"
                    required
                    value={editRoll}
                    onChange={e => setEditRoll(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Course</label>
                  <select
                    value={editCourse}
                    onChange={e => setEditCourse(e.target.value as StudentCourse)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="B.Sc Data Science">B.Sc Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
                  <select
                    value={editBranch}
                    onChange={e => setEditBranch(e.target.value as StudentBranch)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  >
                    <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                    <option value="CSE - AI & ML">CSE - AI & ML</option>
                    <option value="Information Technology (IT)">Information Technology (IT)</option>
                    <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                    <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                  <select
                    value={editYear}
                    onChange={e => setEditYear(e.target.value as AcademicYear)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={editSemester}
                    onChange={e => setEditSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={editCgpa}
                    onChange={e => setEditCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Profile Description</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsVerified}
                    onChange={e => setEditIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-500 bg-[#141923] border-[#1E293B]"
                  />
                  <span>Official Medi-Caps Institutional Verified Badge</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORMAL WARNING MODAL */}
      {warningStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Issue Official Ethics Warning</h3>
              </div>
              <button onClick={() => setWarningStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              This notice will increment <strong>{warningStudent.name}</strong>'s warning record (currently {warningStudent.warningsCount || 0}) and dispatch an official warning circular to their student notifications.
            </p>

            <form onSubmit={handleIssueWarning} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Warning</label>
                <textarea
                  required
                  rows={3}
                  value={warningReason}
                  onChange={e => setWarningReason(e.target.value)}
                  placeholder="e.g. Inappropriate language in comment / Fabricated internship claim / Plagiarized code..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setWarningStudent(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  Issue Formal Warning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUSPENSION MODAL */}
      {suspendingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm text-white">Suspend Student Account</h3>
              </div>
              <button onClick={() => setSuspendingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Suspending <strong>{suspendingStudent.name}</strong> will revoke access to posting in the community, joining challenges, and participating on the leaderboard until an administrator restores them.
            </p>

            <form onSubmit={handleConfirmSuspension} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suspension Reason</label>
                <textarea
                  required
                  rows={3}
                  value={suspensionReason}
                  onChange={e => setSuspensionReason(e.target.value)}
                  placeholder="e.g. Academic dishonesty / Multiple code of conduct infractions / Spam..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setSuspendingStudent(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Confirm Account Suspension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE STUDENT CONFIRMATION MODAL */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0F131C] border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <UserX className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Purge Student Profile?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingStudent.name}</strong> ({deletingStudent.rollNumber})? This will wipe their profile, projects, and posts from the platform.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Edit Community Post Content</h3>
              </div>
              <button onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePostEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editPostCategory}
                  onChange={e => setEditPostCategory(e.target.value as PostCategory)}
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                >
                  <option value="Discussion">Discussion</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Event">Event</option>
                  <option value="Project">Project</option>
                  <option value="Help">Help</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Content</label>
                <textarea
                  rows={5}
                  required
                  value={editPostContent}
                  onChange={e => setEditPostContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Moderated Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT COMMENTS MODAL */}
      {viewingCommentsPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Moderate Discussion Comments</h3>
              </div>
              <button onClick={() => setViewingCommentsPost(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] text-xs text-slate-300">
              <strong className="text-white">{viewingCommentsPost.studentName}:</strong> "{viewingCommentsPost.content.slice(0, 100)}..."
            </div>

            <div className="space-y-2">
              {viewingCommentsPost.comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No comments on this post.</p>
              ) : (
                viewingCommentsPost.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-[#141923] border border-[#1E293B] flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{c.studentName}</span>
                        <span className="text-[10px] text-slate-500">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-200 mt-1">{c.content}</p>
                    </div>

                    <button
                      onClick={() => {
                        adminDeleteComment(viewingCommentsPost.id, c.id, 'Moderated by campus administration');
                        // Update local modal state
                        setViewingCommentsPost(prev => prev ? {
                          ...prev,
                          comments: prev.comments.filter(cm => cm.id !== c.id)
                        } : null);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 shrink-0"
                      title="Remove inappropriate comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingCommentsPost(null)}
                className="px-4 py-1.5 bg-[#141923] text-slate-300 hover:text-white rounded-xl text-xs border border-[#1E293B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PROJECT MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <FolderGit2 className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Purge Fraudulent Project</h3>
            </div>

            <p className="text-xs text-slate-300">
              Remove project <strong>"{deletingProject.project.title}"</strong>. This will deduct points from the student's leaderboard score and record the reason in the audit trail.
            </p>

            <form onSubmit={handleConfirmDeleteProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Removal</label>
                <textarea
                  required
                  rows={2}
                  value={projectDeleteReason}
                  onChange={e => setProjectDeleteReason(e.target.value)}
                  placeholder="e.g. Plagiarism of another student's repository / Non-functional placeholder..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setDeletingProject(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Purge Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISQUALIFY SUBMISSION MODAL */}
      {disqualifyingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0F131C] border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <Ban className="w-5 h-5" />
              <h3 className="font-bold text-sm text-white">Disqualify Competition Entry</h3>
            </div>

            <p className="text-xs text-slate-300">
              Disqualify submission <strong>"{disqualifyingSub.subTitle}"</strong> from competition adjudication.
            </p>

            <form onSubmit={handleConfirmDisqualify} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Disqualification Reason</label>
                <textarea
                  required
                  rows={2}
                  value={disqualifyReason}
                  onChange={e => setDisqualifyReason(e.target.value)}
                  placeholder="e.g. Plagiarized existing codebase / Violates deadline rules..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setDisqualifyingSub(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Confirm Disqualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CHALLENGE MODAL */}
      {isNewChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-sm text-white">Create Campus Challenge</h3>
              <button onClick={() => setIsNewChallengeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChallengeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={chTitle}
                  onChange={e => setChTitle(e.target.value)}
                  placeholder="e.g. 14-Day Open Source Sprint"
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={chTagline}
                  onChange={e => setChTagline(e.target.value)}
                  placeholder="Build high-performance web tooling or systems..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={chDesc}
                  onChange={e => setChDesc(e.target.value)}
                  placeholder="Rules, timeline, and deliverables required..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={chCategory}
                    onChange={e => setChCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  >
                    <option value="Coding">Coding</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="UI / UX">UI / UX</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={chPrize}
                    onChange={e => setChPrize(e.target.value)}
                    placeholder="₹20,000 + Badges"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsNewChallengeModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-xl shadow"
                >
                  Publish Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
