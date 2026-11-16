import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, 
  Post, 
  Challenge, 
  NotificationItem, 
  ReportedItem, 
  SystemAnnouncement,
  Project,
  Internship,
  Certification,
  PostCategory,
  ChallengeSubmission,
  RegisterStudentData,
  AdminAuditLog
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_POSTS, 
  INITIAL_CHALLENGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_REPORTS,
  INITIAL_BADGES,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { calculateStudentScore, calculateProfileCompletion } from '../utils/scoring';
import { parseCollegeEmail } from '../utils/collegeEmail';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'discover' 
  | 'community' 
  | 'leaderboard' 
  | 'challenges' 
  | 'profile' 
  | 'notifications' 
  | 'settings' 
  | 'admin';

export const ADMIN_STUDENT_EMAIL = 'en24cs3040061@medicaps.ac.in';

export const isAdminCapableStudent = (student?: Student | null): boolean =>
  Boolean(student && (student.canAccessAdmin || student.email.toLowerCase() === ADMIN_STUDENT_EMAIL));

interface AppContextType {
  currentUser: Student | null;
  isAdmin: boolean;
  canAccessAdmin: boolean;
  activeTab: NavTab;
  viewingStudentId: string | null;
  students: Student[];
  posts: Post[];
  challenges: Challenge[];
  notifications: NotificationItem[];
  announcements: SystemAnnouncement[];
  reports: ReportedItem[];
  toasts: Toast[];
  isSearchOpen: boolean;
  activePostDetail: Post | null;
  activeChallengeDetail: Challenge | null;
  showOnboarding: boolean;
  
  // Actions
  setActiveTab: (tab: NavTab) => void;
  navigateToProfile: (studentId?: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setActivePostDetail: (post: Post | null) => void;
  setActiveChallengeDetail: (challenge: Challenge | null) => void;
  setShowOnboarding: (show: boolean) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Auth
  loginAsStudent: (studentId: string) => void;
  loginWithCredentials: (collegeEmail: string, password: string) => { success: boolean; message?: string };
  registerStudent: (data: RegisterStudentData) => { success: boolean; message?: string };
  logout: () => void;
  switchToAdmin: () => void;
  switchToStudent: () => void;

  // Student Profile Updates
  updateProfile: (updates: Partial<Student>) => void;
  addProject: (project: Omit<Project, 'id' | 'studentId'>) => void;
  deleteProject: (projectId: string) => void;
  addInternship: (internship: Omit<Internship, 'id' | 'studentId'>) => void;
  deleteInternship: (internshipId: string) => void;
  addCertification: (cert: Omit<Certification, 'id' | 'studentId'>) => void;
  attachCertificationFile: (certId: string, fileDataUrl: string, fileName: string, fileType: string) => void;
  deleteCertification: (certId: string) => void;
  endorseSkill: (studentId: string, skillId: string) => void;
  toggleFollow: (studentId: string) => void;

  // Community
  createPost: (content: string, category: PostCategory, mediaUrl?: string, tags?: string[]) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  toggleSavePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  deletePost: (postId: string) => void; // Admin or author

  // Challenges
  joinChallenge: (challengeId: string) => void;
  submitChallengeEntry: (challengeId: string, title: string, link: string, notes: string) => void;
  createChallenge: (challenge: Omit<Challenge, 'id' | 'participants' | 'participantCount' | 'submissions'>) => void;
  deleteChallenge: (challengeId: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Admin Features & Governance
  auditLogs: AdminAuditLog[];
  adminVerifyStudent: (studentId: string, verify: boolean) => void;
  adminEditStudent: (studentId: string, updates: Partial<Student>) => void;
  adminWarnStudent: (studentId: string, reason: string) => void;
  adminDeleteStudent: (studentId: string) => void;
  adminResetAvatar: (studentId: string) => void;
  suspendStudent: (studentId: string, reason?: string) => void;
  restoreStudent: (studentId: string) => void;

  adminEditPost: (postId: string, newContent: string, newCategory?: PostCategory, newTags?: string[]) => void;
  adminTogglePinPost: (postId: string) => void;
  adminToggleLockPost: (postId: string) => void;
  adminDeleteComment: (postId: string, commentId: string, reason?: string) => void;

  adminVerifyProject: (studentId: string, projectId: string, verified: boolean) => void;
  adminDeleteProject: (studentId: string, projectId: string, reason?: string) => void;

  adminUpdateChallenge: (challengeId: string, updates: Partial<Challenge>) => void;
  adminDisqualifySubmission: (challengeId: string, submissionId: string, reason: string) => void;
  adminMarkSubmissionWinner: (challengeId: string, submissionId: string) => void;

  dismissReport: (reportId: string) => void;
  resolveReport: (reportId: string, removeContent?: boolean) => void;
  createAnnouncement: (title: string, content: string, priority?: 'normal' | 'important') => void;
  deleteAnnouncement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_STUDENTS = 'mediconnect_students_v3';
const STORAGE_KEY_POSTS = 'mediconnect_posts_v3';
const STORAGE_KEY_CHALLENGES = 'mediconnect_challenges_v3';
const STORAGE_KEY_NOTIFS = 'mediconnect_notifs_v2';
const STORAGE_KEY_USER_ID = 'mediconnect_current_user_v2';
const STORAGE_KEY_IS_ADMIN = 'mediconnect_is_admin_v2';
const STORAGE_KEY_AUDIT_LOGS = 'mediconnect_audit_logs_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available (and keep Gourav Vyas admin+student credentials synced)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((st: Student) =>
            st.id === 'student-1' || st.email?.toLowerCase() === ADMIN_STUDENT_EMAIL
              ? {
                  ...st,
                  name: st.id === 'student-1' ? 'Gourav Vyas' : st.name,
                  email: ADMIN_STUDENT_EMAIL,
                  rollNumber: 'EN24CS3040061',
                  password: '123456789',
                  canAccessAdmin: true,
                  isVerified: true
                }
              : st
          );
        }
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_USER_ID) || null;
  });

  const [isAdminState, setIsAdminState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_IS_ADMIN) === 'true';
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHALLENGES);
      return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [reports, setReports] = useState<ReportedItem[]>(INITIAL_REPORTS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [activeTab, setActiveTabState] = useState<NavTab>(() => {
    const savedAdmin = localStorage.getItem(STORAGE_KEY_IS_ADMIN) === 'true';
    const savedUser = localStorage.getItem(STORAGE_KEY_USER_ID);
    return savedAdmin && savedUser === 'student-1' ? 'admin' : 'dashboard';
  });
  const [viewingStudentId, setViewingStudentId] = useState<string | null>('student-1');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [activeChallengeDetail, setActiveChallengeDetail] = useState<Challenge | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
    } catch (e) {
      console.error(e);
    }
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEY_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER_ID);
    }
  }, [currentUserId]);

  const currentUser = students.find(s => s.id === currentUserId) || null;
  const canAccessAdmin = isAdminCapableStudent(currentUser);
  const isAdmin = Boolean(isAdminState && canAccessAdmin);

  useEffect(() => {
    if (!canAccessAdmin && isAdminState) {
      setIsAdminState(false);
    }
  }, [canAccessAdmin, isAdminState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IS_ADMIN, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  const addAuditLog = (actionType: AdminAuditLog['actionType'], targetTitle: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: 'log-' + Date.now() + Math.random().toString(36).substring(2, 6),
      actionType,
      targetTitle,
      details,
      adminName: currentUser ? `${currentUser.name} (${currentUser.rollNumber})` : 'Platform Administrator',
      timestamp: 'Just now'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProfile = (studentId?: string) => {
    const targetId = studentId || currentUserId || students[0]?.id;
    setViewingStudentId(targetId);
    setActiveTab('profile');
  };

  // Recalculates leaderboard rankings after changes
  const refreshRankings = (updatedList: Student[]): Student[] => {
    const scored = updatedList.map(s => {
      const { total } = calculateStudentScore(s);
      const { percentage } = calculateProfileCompletion(s);
      return {
        ...s,
        leaderboardScore: total,
        profileCompletion: percentage
      };
    });

    scored.sort((a, b) => b.leaderboardScore - a.leaderboardScore);
    return scored.map((s, idx) => ({
      ...s,
      leaderboardRank: idx + 1
    }));
  };

  // Auth actions
  const loginAsStudent = (studentId: string) => {
    setCurrentUserId(studentId);
    setIsAdminState(false);
    setViewingStudentId(studentId);
    setActiveTab('dashboard');
    addToast('Signed in successfully as student');
  };

  const loginWithCredentials = (collegeEmail: string, password: string): { success: boolean; message?: string } => {
    const parsed = parseCollegeEmail(collegeEmail);

    if (!parsed.isValid) {
      return {
        success: false,
        message: parsed.errorReason || 'College mail ID must follow enxxxxxxxxxxx@medicaps.ac.in (e.g. en24cs3040061@medicaps.ac.in).'
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        message: 'Please enter your password (minimum 6 characters).'
      };
    }

    // Find matching student strictly by college mail ID
    const matched = students.find(s => s.email.toLowerCase() === parsed.email);

    if (!matched) {
      return {
        success: false,
        message: 'No student is registered with this college mail ID. Please register first using your @medicaps.ac.in mail ID and password.'
      };
    }

    if (matched.password && matched.password !== password) {
      return {
        success: false,
        message: 'Incorrect password for this college mail ID. Please try again.'
      };
    }

    if (matched.status === 'suspended') {
      return {
        success: false,
        message: 'This student account has been suspended by campus administration.'
      };
    }

    setCurrentUserId(matched.id);
    setViewingStudentId(matched.id);
    setIsAdminState(false);
    if (isAdminCapableStudent(matched)) {
      setActiveTabState('profile');
      addToast(`Welcome back, ${matched.name}! Profile & Admin controls ready.`, 'success');
    } else {
      setActiveTabState('dashboard');
      addToast(`Welcome back, ${matched.name}!`, 'success');
    }
    return { success: true };
  };

  const registerStudent = (data: RegisterStudentData): { success: boolean; message?: string } => {
    const parsed = parseCollegeEmail(data.email);

    if (!parsed.isValid) {
      return {
        success: false,
        message:
          parsed.errorReason ||
          'Registration requires college mail ID in format en<2 digits><branch code e.g. cs, ce, me><6-7 digits>@medicaps.ac.in.'
      };
    }

    if (!data.password || data.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long.'
      };
    }

    const email = parsed.email;
    const enrollment = parsed.enrollmentNumber;

    // Check duplicate
    const existing = students.find(s =>
      s.email.toLowerCase() === email ||
      s.rollNumber.toUpperCase() === enrollment
    );

    if (existing) {
      return {
        success: false,
        message: `An account with ${email} is already registered. Please sign in with your password.`
      };
    }

    const resolvedBranch = parsed.detectedBranch || data.branch || 'Computer Science (CSE)';

    const newStudent: Student = {
      id: 'student-' + Date.now(),
      name: data.name.trim(),
      email,
      rollNumber: enrollment,
      password: data.password,
      gender: data.gender || 'male',
      profilePhoto: data.gender === 'female'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces&q=80',
      course: data.course || 'B.Tech',
      branch: resolvedBranch,
      year: data.year || '3rd Year',
      semester: data.semester || 6,
      cgpa: 8.5,
      bio: `${data.year || '3rd Year'} ${data.course || 'B.Tech'} student in ${resolvedBranch} at Medi-Caps University.`,
      collegeName: 'Medi-Caps University',
      location: 'Indore, MP',
      skills: [
        { id: 'sk-new-1', name: 'Python', category: 'Languages', endorsements: 1 },
        { id: 'sk-new-2', name: 'Data Structures & Algorithms', category: 'Core CS', endorsements: 1 },
        { id: 'sk-new-3', name: 'Web Development', category: 'Frameworks', endorsements: 1 }
      ],
      projects: [],
      internships: [],
      certifications: [],
      achievements: ['Registered on MediConnect Campus Platform'],
      externalProfiles: {},
      badges: [INITIAL_BADGES[6]],
      followersCount: 0,
      followingCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      leaderboardScore: 34.0,
      leaderboardRank: students.length + 1,
      profileCompletion: 45
    };

    const updatedStudents = refreshRankings([newStudent, ...students]);
    setStudents(updatedStudents);
    setCurrentUserId(newStudent.id);
    setViewingStudentId(newStudent.id);
    setIsAdminState(false);
    setActiveTab('dashboard');
    addToast(`Registration successful! Welcome to MediConnect, ${data.name}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    setIsAdminState(false);
    setActiveTabState('dashboard');
    addToast('Logged out of MediConnect', 'info');
  };

  const switchToAdmin = () => {
    if (!canAccessAdmin) {
      addToast('Administrator mode is restricted to authorized campus accounts.', 'error');
      return;
    }
    setIsAdminState(true);
    setActiveTab('admin');
    addToast('Switched to Admin Mode', 'info');
  };

  const switchToStudent = () => {
    setIsAdminState(false);
    if (currentUser) {
      setViewingStudentId(currentUser.id);
      setActiveTab('profile');
    } else {
      setActiveTab('dashboard');
    }
    addToast('Switched to Normal Student Access');
  };

  // Profile actions
  const updateProfile = (updates: Partial<Student>) => {
    if (!currentUserId) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          const merged = { ...s, ...updates };
          return merged;
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Profile updated successfully');
  };

  const addProject = (projectData: Omit<Project, 'id' | 'studentId'>) => {
    if (!currentUserId) return;
    const newProj: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      studentId: currentUserId
    };

    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          const projs = [newProj, ...s.projects];
          // Check for Project Builder badge
          let badges = [...s.badges];
          if (projs.length >= 3 && !badges.some(b => b.id === 'badge-3')) {
            badges.push(INITIAL_BADGES[2]);
            addToast('🎉 Unlocked "Project Builder" badge!', 'info');
          }
          return {
            ...s,
            projects: projs,
            badges
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });

    addToast('Project added to your portfolio!');
  };

  const deleteProject = (projectId: string) => {
    if (!currentUserId) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          return {
            ...s,
            projects: s.projects.filter(p => p.id !== projectId)
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Project removed', 'info');
  };

  const addInternship = (internData: Omit<Internship, 'id' | 'studentId'>) => {
    if (!currentUserId) return;
    const newIntern: Internship = {
      ...internData,
      id: 'intern-' + Date.now(),
      studentId: currentUserId
    };
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          return {
            ...s,
            internships: [newIntern, ...s.internships]
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Internship experience recorded!');
  };

  const deleteInternship = (internshipId: string) => {
    if (!currentUserId) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          return {
            ...s,
            internships: s.internships.filter(i => i.id !== internshipId)
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Internship removed', 'info');
  };

  const addCertification = (certData: Omit<Certification, 'id' | 'studentId'>) => {
    if (!currentUserId) return;
    const newCert: Certification = {
      ...certData,
      id: 'cert-' + Date.now(),
      studentId: currentUserId
    };
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          return {
            ...s,
            certifications: [newCert, ...s.certifications]
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Certification added to profile!');
  };

  const attachCertificationFile = (certId: string, fileDataUrl: string, fileName: string, fileType: string) => {
    if (!currentUserId) return;
    setStudents(prev => prev.map(s => {
      if (s.id === currentUserId) {
        return {
          ...s,
          certifications: s.certifications.map(c =>
            c.id === certId ? { ...c, fileDataUrl, fileName, fileType } : c
          )
        };
      }
      return s;
    }));
    addToast(`Certificate file "${fileName}" attached!`);
  };

  const deleteCertification = (certId: string) => {
    if (!currentUserId) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === currentUserId) {
          return {
            ...s,
            certifications: s.certifications.filter(c => c.id !== certId)
          };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addToast('Certification removed', 'info');
  };

  const endorseSkill = (studentId: string, skillId: string) => {
    if (!currentUserId) return;
    if (studentId === currentUserId) {
      addToast("You cannot endorse your own skills", 'info');
      return;
    }

    setStudents(prev => {
      return prev.map(s => {
        if (s.id === studentId) {
          const updatedSkills = s.skills.map(sk => {
            if (sk.id === skillId) {
              const endorsedBy = sk.endorsedBy || [];
              const hasEndorsed = endorsedBy.includes(currentUserId);
              return {
                ...sk,
                endorsements: hasEndorsed ? sk.endorsements - 1 : sk.endorsements + 1,
                endorsedBy: hasEndorsed 
                  ? endorsedBy.filter(id => id !== currentUserId)
                  : [...endorsedBy, currentUserId]
              };
            }
            return sk;
          });
          return { ...s, skills: updatedSkills };
        }
        return s;
      });
    });

    addToast('Skill endorsement updated');
  };

  const toggleFollow = (studentId: string) => {
    if (!currentUserId || studentId === currentUserId) return;
    
    setStudents(prev => {
      return prev.map(s => {
        if (s.id === studentId) {
          const isCurrentlyFollowing = s.isFollowing;
          return {
            ...s,
            isFollowing: !isCurrentlyFollowing,
            followersCount: isCurrentlyFollowing ? s.followersCount - 1 : s.followersCount + 1
          };
        }
        if (s.id === currentUserId) {
          const target = prev.find(p => p.id === studentId);
          const isCurrentlyFollowing = target?.isFollowing;
          return {
            ...s,
            followingCount: isCurrentlyFollowing ? s.followingCount - 1 : s.followingCount + 1
          };
        }
        return s;
      });
    });

    addToast('Peer network updated');
  };

  // Community actions
  const createPost = (content: string, category: PostCategory, mediaUrl?: string, tags?: string[]) => {
    const author = currentUser;
    if (!author && !isAdmin) {
      addToast('Please sign in to create a post.', 'error');
      return;
    }

    const newPost: Post = {
      id: 'post-' + Date.now(),
      studentId: author ? author.id : 'admin',
      studentName: author ? author.name : 'Campus Platform Administration',
      studentAvatar: author
        ? author.profilePhoto
        : 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="#0F172A"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#38BDF8" font-family="system-ui,sans-serif" font-weight="700" font-size="38">MC</text></svg>'),
      studentBranchYear: author ? `${author.branch.split(' ')[0]} · ${author.year}` : 'Administration · Official',
      studentRoll: author ? author.rollNumber : 'ADMIN',
      category,
      content,
      mediaUrl,
      tags: tags || [],
      likes: 0,
      hasLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      saved: false,
      createdAt: 'Just now'
    };

    setPosts(prev => [newPost, ...prev]);

    // Check Community Contributor badge
    if (author && !author.badges.some(b => b.id === 'badge-5')) {
      const userPostCount = posts.filter(p => p.studentId === author.id).length + 1;
      if (userPostCount >= 2) {
        setStudents(prev => prev.map(s => {
          if (s.id === author.id) {
            return {
              ...s,
              badges: [...s.badges, INITIAL_BADGES[4]]
            };
          }
          return s;
        }));
        addToast('🎉 Unlocked "Community Contributor" badge!', 'info');
      }
    }

    addToast('Post published to campus community!');
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.hasLiked;
        return {
          ...p,
          hasLiked: liked,
          likes: liked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    const newComment = {
      id: 'c-' + Date.now(),
      postId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.profilePhoto,
      studentBranchYear: `${currentUser.branch.split(' ')[0]} · ${currentUser.year}`,
      content,
      createdAt: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedComments = [...p.comments, newComment];
        return {
          ...p,
          commentsCount: updatedComments.length,
          comments: updatedComments
        };
      }
      return p;
    }));

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail(prev => prev ? {
        ...prev,
        commentsCount: prev.commentsCount + 1,
        comments: [...prev.comments, newComment]
      } : null);
    }

    addToast('Comment added');
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updated = p.comments.filter(c => c.id !== commentId);
        return {
          ...p,
          comments: updated,
          commentsCount: updated.length
        };
      }
      return p;
    }));

    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail(prev => prev ? {
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
        commentsCount: prev.commentsCount - 1
      } : null);
    }
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const saved = !p.saved;
        addToast(saved ? 'Post saved to bookmarks' : 'Post removed from bookmarks', 'info');
        return { ...p, saved };
      }
      return p;
    }));
  };

  const reportPost = (postId: string, reason: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const report: ReportedItem = {
      id: 'rep-' + Date.now(),
      reporterId: currentUserId || 'anonymous',
      reporterName: currentUser?.name || 'Student Reporter',
      contentType: 'post',
      contentId: postId,
      contentSnippet: post.content.substring(0, 75) + '...',
      authorName: post.studentName,
      reason,
      status: 'pending',
      reportedAt: 'Just now'
    };

    setReports(prev => [report, ...prev]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isReported: true } : p));
    addToast('Report submitted for campus moderation', 'info');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (activePostDetail?.id === postId) {
      setActivePostDetail(null);
    }
    addToast('Post removed', 'info');
  };

  // Challenges
  const joinChallenge = (challengeId: string) => {
    if (!currentUser) return;
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        if (ch.participants.includes(currentUser.id)) {
          addToast('You are already registered in this challenge', 'info');
          return ch;
        }
        addToast(`Registered for "${ch.title}"! Good luck! 🎉`);
        return {
          ...ch,
          participants: [...ch.participants, currentUser.id],
          participantCount: ch.participantCount + 1
        };
      }
      return ch;
    }));
  };

  const submitChallengeEntry = (challengeId: string, title: string, link: string, notes: string) => {
    if (!currentUser) return;
    const submission: ChallengeSubmission = {
      id: 'sub-' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.profilePhoto,
      submittedAt: 'Just now',
      title,
      link,
      notes,
      upvotes: 0
    };

    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        const existingParticipants = ch.participants.includes(currentUser.id) 
          ? ch.participants 
          : [...ch.participants, currentUser.id];
        return {
          ...ch,
          participants: existingParticipants,
          participantCount: existingParticipants.length,
          submissions: [submission, ...ch.submissions]
        };
      }
      return ch;
    }));

    addToast('Challenge submission uploaded successfully!');
  };

  const createChallenge = (data: Omit<Challenge, 'id' | 'participants' | 'participantCount' | 'submissions'>) => {
    const newChallenge: Challenge = {
      ...data,
      id: 'ch-' + Date.now(),
      participants: [],
      participantCount: 0,
      submissions: []
    };
    setChallenges(prev => [newChallenge, ...prev]);
    addToast('New campus challenge created!');
  };

  const deleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.filter(ch => ch.id !== challengeId));
    addToast('Challenge deleted', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  // Admin moderation & governance
  const adminVerifyStudent = (studentId: string, verify: boolean) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isVerified: verify } : s));
    addAuditLog(
      verify ? 'student_verified' : 'student_unverified',
      `${student.name} (${student.rollNumber})`,
      verify ? 'Granted official verified student status badge.' : 'Revoked verified enrollment badge.'
    );
    if (verify) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        studentId,
        type: 'badge',
        title: 'Institutional Verification Complete',
        message: 'Your official Medi-Caps University enrollment identity has been verified by platform administration.',
        read: false,
        createdAt: 'Just now'
      };
      setNotifications(prev => [notif, ...prev]);
    }
    addToast(verify ? `Verified enrollment for ${student.name}` : `Unverified ${student.name}`, 'success');
  };

  const adminEditStudent = (studentId: string, updates: Partial<Student>) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          return { ...s, ...updates };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addAuditLog(
      'student_edited',
      `${student.name} (${student.rollNumber})`,
      `Administrative edit made: modified fields [${Object.keys(updates).join(', ')}].`
    );
    addToast(`Student profile for ${student.name} updated by admin`, 'success');
  };

  const adminWarnStudent = (studentId: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const currentWarnings = student.warningsCount || 0;
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, warningsCount: currentWarnings + 1 } : s));
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      studentId,
      type: 'announcement',
      title: 'Formal Platform Warning',
      message: `Official Code of Conduct Notice (Warning #${currentWarnings + 1}): ${reason}. Continued infractions may result in account suspension.`,
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
    addAuditLog(
      'student_warned',
      `${student.name} (${student.rollNumber})`,
      `Issued formal ethics warning #${currentWarnings + 1}: ${reason}`
    );
    addToast(`Formal warning issued to ${student.name}`, 'info');
  };

  const adminDeleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setPosts(prev => prev.filter(p => p.studentId !== studentId));
    addAuditLog(
      'student_deleted',
      `${student.name} (${student.rollNumber})`,
      `Permanently purged student account, projects, and posts from the platform.`
    );
    addToast(`Account for ${student.name} removed`, 'info');
  };

  const adminResetAvatar = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80';
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      profilePhoto: defaultAvatar,
      coverImage: undefined
    } : s));
    addAuditLog(
      'student_edited',
      `${student.name} (${student.rollNumber})`,
      'Reset non-compliant profile photo and cover banner to standard defaults.'
    );
    addToast(`Reset avatar for ${student.name}`, 'info');
  };

  const suspendStudent = (studentId: string, reason?: string) => {
    const student = students.find(s => s.id === studentId);
    const suspensionReason = reason || 'Violation of campus community code of conduct and academic ethics';
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'suspended', suspensionReason } : s));
    addAuditLog(
      'student_suspended',
      student ? `${student.name} (${student.rollNumber})` : studentId,
      `Account suspended. Reason: ${suspensionReason}`
    );
    addToast('Student account suspended', 'info');
  };

  const restoreStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'active', suspensionReason: undefined } : s));
    addAuditLog(
      'student_restored',
      student ? `${student.name} (${student.rollNumber})` : studentId,
      'Restored student account to active standing.'
    );
    addToast('Student account restored', 'success');
  };

  const adminEditPost = (postId: string, newContent: string, newCategory?: PostCategory, newTags?: string[]) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          content: newContent,
          category: newCategory || p.category,
          tags: newTags || p.tags,
          moderatedByAdmin: true
        };
      }
      return p;
    }));
    addAuditLog(
      'post_edited',
      `Post #${postId} by ${post.studentName}`,
      `Moderated post content for authenticity & professional campus standards. Preview: "${newContent.slice(0, 60)}..."`
    );
    addToast('Post updated by platform administration', 'success');
  };

  const adminTogglePinPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const pinned = !post.isPinned;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: pinned } : p));
    addAuditLog(
      'post_pinned',
      `Post #${postId} by ${post.studentName}`,
      pinned ? 'Pinned to top of campus community feed.' : 'Unpinned from campus community feed.'
    );
    addToast(pinned ? 'Post pinned to top of campus feed' : 'Post unpinned', 'info');
  };

  const adminToggleLockPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const locked = !post.isLocked;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLocked: locked } : p));
    addAuditLog(
      'post_locked',
      `Post #${postId} by ${post.studentName}`,
      locked ? 'Locked discussion thread to maintain professional conduct.' : 'Unlocked discussion thread.'
    );
    addToast(locked ? 'Post comments locked' : 'Post comments unlocked', 'info');
  };

  const adminDeleteComment = (postId: string, commentId: string, reason?: string) => {
    deleteComment(postId, commentId);
    addAuditLog(
      'comment_removed',
      `Comment on Post #${postId}`,
      `Removed inappropriate comment: ${reason || 'Code of conduct violation'}`
    );
  };

  const adminVerifyProject = (studentId: string, projectId: string, verified: boolean) => {
    const student = students.find(s => s.id === studentId);
    const project = student?.projects.find(pr => pr.id === projectId);
    if (!student || !project) return;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          const updatedProjects = s.projects.map(pr => pr.id === projectId ? { ...pr, isVerified: verified } : pr);
          return { ...s, projects: updatedProjects };
        }
        return s;
      });
      return refreshRankings(updated);
    });
    addAuditLog(
      'project_verified',
      `Project "${project.title}" by ${student.name}`,
      verified ? 'Audited source code architecture and awarded official verified project mark.' : 'Revoked project verification status.'
    );
    if (verified) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        studentId,
        type: 'badge',
        title: 'Project Verified by Faculty/Admin',
        message: `Your project "${project.title}" has been verified for technical authenticity!`,
        read: false,
        createdAt: 'Just now'
      };
      setNotifications(prev => [notif, ...prev]);
    }
    addToast(verified ? `Project "${project.title}" verified!` : `Project verification removed`, 'success');
  };

  const adminDeleteProject = (studentId: string, projectId: string, reason?: string) => {
    const student = students.find(s => s.id === studentId);
    const project = student?.projects.find(pr => pr.id === projectId);
    if (!student) return;
    deleteProject(projectId);
    addAuditLog(
      'project_removed',
      `Project "${project?.title || projectId}" by ${student.name}`,
      `Removed fraudulent or unoriginal project. Reason: ${reason || 'Plagiarism / fabricated credentials'}`
    );
    addToast('Project removed for policy violation', 'info');
  };

  const adminUpdateChallenge = (challengeId: string, updates: Partial<Challenge>) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, ...updates } : c));
    addAuditLog(
      'challenge_updated',
      challenge.title,
      `Updated challenge details [${Object.keys(updates).join(', ')}]`
    );
    addToast('Challenge updated successfully');
  };

  const adminDisqualifySubmission = (challengeId: string, submissionId: string, reason: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    const sub = challenge.submissions.find(s => s.id === submissionId);
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          submissions: c.submissions.map(s => s.id === submissionId ? {
            ...s,
            isDisqualified: true,
            disqualificationReason: reason
          } : s)
        };
      }
      return c;
    }));
    addAuditLog(
      'submission_disqualified',
      `Submission "${sub?.title || submissionId}" in ${challenge.title}`,
      `Disqualified submission: ${reason}`
    );
    addToast('Submission disqualified', 'info');
  };

  const adminMarkSubmissionWinner = (challengeId: string, submissionId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    const sub = challenge.submissions.find(s => s.id === submissionId);
    if (!sub) return;
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'Completed',
          submissions: c.submissions.map(s => s.id === submissionId ? {
            ...s,
            isWinner: true
          } : s)
        };
      }
      return c;
    }));

    const winnerBadge = INITIAL_BADGES.find(b => b.id === 'badge-6') || {
      id: 'badge-6',
      name: 'Challenge Champion',
      description: `Winner of ${challenge.title}`,
      iconName: 'Award',
      category: 'competition' as const,
      earnedAt: 'Oct 2026'
    };

    setStudents(prev => prev.map(s => {
      if (s.id === sub.studentId) {
        const alreadyHas = s.badges.some(b => b.id === winnerBadge.id);
        const updatedBadges = alreadyHas ? s.badges : [...s.badges, { ...winnerBadge, earnedAt: 'Oct 2026' }];
        const achievements = [...s.achievements, `Winner - ${challenge.title}`];
        return {
          ...s,
          badges: updatedBadges,
          achievements,
          leaderboardScore: s.leaderboardScore + challenge.pointsReward
        };
      }
      return s;
    }));

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      studentId: sub.studentId,
      type: 'badge',
      title: '🏆 Challenge Winner Declared!',
      message: `Congratulations! Your entry "${sub.title}" won 1st Place in ${challenge.title}! +${challenge.pointsReward} leaderboard pts awarded.`,
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog(
      'submission_winner',
      `Submission "${sub.title}" by ${sub.studentName}`,
      `Declared 1st place winner of ${challenge.title}. Awarded +${challenge.pointsReward} pts & Challenge Champion badge.`
    );
    addToast(`🏆 Winner declared: ${sub.studentName}!`, 'success');
  };

  const dismissReport = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'dismissed' } : r));
    addToast('Report dismissed', 'info');
  };

  const resolveReport = (reportId: string, removeContent: boolean = true) => {
    const target = reports.find(r => r.id === reportId);
    if (target && removeContent && target.contentType === 'post') {
      deletePost(target.contentId);
    }
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
    addAuditLog(
      'report_resolved',
      target ? `Report on ${target.contentType} by ${target.authorName}` : reportId,
      `Resolved report. Action taken: ${removeContent ? 'Removed offensive content' : 'Dismissed after review'}. Reason: ${target?.reason}`
    );
    addToast('Report resolved and actions logged', 'success');
  };

  const createAnnouncement = (title: string, content: string, priority: 'normal' | 'important' = 'normal') => {
    const newAnn: SystemAnnouncement = {
      id: 'ann-' + Date.now(),
      title,
      content,
      publishedAt: 'Today',
      author: 'Campus Platform Administration',
      priority
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditLog(
      'announcement_published',
      title,
      `Broadcasted campus announcement with ${priority} priority.`
    );
    addToast('Platform announcement broadcasted!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addToast('Announcement removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        canAccessAdmin,
        activeTab,
        viewingStudentId,
        students,
        posts,
        challenges,
        notifications,
        announcements,
        reports,
        toasts,
        isSearchOpen,
        activePostDetail,
        activeChallengeDetail,
        showOnboarding,
        setActiveTab,
        navigateToProfile,
        setIsSearchOpen,
        setActivePostDetail,
        setActiveChallengeDetail,
        setShowOnboarding,
        addToast,
        loginAsStudent,
        loginWithCredentials,
        registerStudent,
        logout,
        switchToAdmin,
        switchToStudent,
        updateProfile,
        addProject,
        deleteProject,
        addInternship,
        deleteInternship,
        addCertification,
        attachCertificationFile,
        deleteCertification,
        endorseSkill,
        toggleFollow,
        createPost,
        toggleLikePost,
        addComment,
        deleteComment,
        toggleSavePost,
        reportPost,
        deletePost,
        joinChallenge,
        submitChallengeEntry,
        createChallenge,
        deleteChallenge,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        suspendStudent,
        restoreStudent,
        dismissReport,
        resolveReport,
        createAnnouncement,
        deleteAnnouncement,
        auditLogs,
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
        adminMarkSubmissionWinner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
