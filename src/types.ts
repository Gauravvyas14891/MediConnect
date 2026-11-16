export type StudentCourse = 'B.Tech' | 'M.Tech' | 'BCA' | 'MCA' | 'MBA' | 'B.Sc Data Science';
export type StudentBranch =
  | 'Computer Science (CSE)'
  | 'CSE - AI & ML'
  | 'Information Technology (IT)'
  | 'Electronics & Comm (ECE)'
  | 'Data Science'
  | 'Mechanical'
  | 'Civil Engineering (CE)'
  | 'Electrical Engineering (EE)';
export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface ExternalProfiles {
  github?: string;
  linkedin?: string;
  leetcode?: string;
  codechef?: string;
  codeforces?: string;
  geeksforgeeks?: string;
}

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  category: 'Web App' | 'AI / ML' | 'Mobile App' | 'Systems / Cloud' | 'Cybersecurity' | 'Open Source' | 'Hardware / IoT';
  starsCount?: number;
  featured?: boolean;
  isVerified?: boolean; // Verified authentic implementation by Campus Admin
}

export interface Internship {
  id: string;
  studentId: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string; // e.g. "Present" or "Aug 2025"
  description: string;
  certificateUrl?: string;
  location?: string;
}

export interface Certification {
  id: string;
  studentId: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  credentialId?: string;
  fileDataUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Languages' | 'Frameworks' | 'AI & ML' | 'Cloud & DevOps' | 'Core CS' | 'Design & Soft Skills';
  endorsements: number;
  endorsedBy?: string[]; // student IDs
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'profile' | 'projects' | 'community' | 'competition' | 'leaderboard';
  earnedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  password?: string;
  gender?: 'male' | 'female' | 'other';
  profilePhoto: string;
  coverImage?: string;
  course: StudentCourse;
  branch: StudentBranch;
  year: AcademicYear;
  semester: number;
  cgpa: number;
  bio: string;
  location?: string;
  collegeName: string;
  skills: SkillItem[];
  projects: Project[];
  internships: Internship[];
  certifications: Certification[];
  achievements: string[];
  externalProfiles: ExternalProfiles;
  badges: Badge[];
  profileCompletion: number; // percentage 0-100
  leaderboardScore: number;
  leaderboardRank: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  status: 'active' | 'suspended';
  suspensionReason?: string;
  warningsCount?: number;
  isVerified?: boolean; // Verified Medi-Caps Student enrollment
  canAccessAdmin?: boolean; // Authorized dual student + campus admin account
  createdAt: string;
}

export interface RegisterStudentData {
  name: string;
  email: string; // strictly en<2digits><branch><6-7digits>@medicaps.ac.in
  enrollmentNumber: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  course: StudentCourse;
  branch: StudentBranch;
  year: AcademicYear;
  semester: number;
}

export type PostCategory = 
  | 'Opportunity' 
  | 'Achievement' 
  | 'Event' 
  | 'Competition' 
  | 'Hackathon' 
  | 'Team Formation' 
  | 'Project' 
  | 'Internship' 
  | 'Discussion' 
  | 'Help' 
  | 'General';

export interface Comment {
  id: string;
  postId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentBranchYear: string;
  content: string;
  createdAt: string;
  likes: number;
  hasLiked?: boolean;
}

export interface Post {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentBranchYear: string;
  studentRoll: string;
  category: PostCategory;
  content: string;
  mediaUrl?: string;
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments: Comment[];
  saved?: boolean;
  sharesCount: number;
  createdAt: string;
  isReported?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  moderatedByAdmin?: boolean;
}

export type ChallengeStatus = 'Upcoming' | 'Active' | 'Completed';

export interface ChallengeSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
  title: string;
  link: string;
  notes: string;
  upvotes: number;
  isDisqualified?: boolean;
  disqualificationReason?: string;
  isWinner?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Coding' | 'Open Source' | 'AI / ML' | 'UI / UX' | 'Campus Life' | 'Hackathon';
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
  bannerImage: string;
  prize: string;
  rules: string[];
  submissionRequirements: string[];
  participantCount: number;
  participants: string[]; // student IDs
  submissions: ChallengeSubmission[];
  pointsReward: number;
}

export interface NotificationItem {
  id: string;
  studentId: string;
  type: 'like' | 'comment' | 'follow' | 'challenge' | 'badge' | 'leaderboard' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  avatar?: string;
}

export interface ReportedItem {
  id: string;
  reporterId: string;
  reporterName: string;
  contentType: 'post' | 'comment' | 'student';
  contentId: string;
  contentSnippet: string;
  authorName: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  reportedAt: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
  priority: 'normal' | 'important';
}

export interface AdminAuditLog {
  id: string;
  actionType: 
    | 'student_suspended'
    | 'student_restored'
    | 'student_verified'
    | 'student_unverified'
    | 'student_deleted'
    | 'student_edited'
    | 'student_warned'
    | 'post_removed'
    | 'post_edited'
    | 'post_pinned'
    | 'post_locked'
    | 'comment_removed'
    | 'project_verified'
    | 'project_removed'
    | 'submission_disqualified'
    | 'submission_winner'
    | 'challenge_created'
    | 'challenge_updated'
    | 'challenge_deleted'
    | 'announcement_published'
    | 'report_resolved';
  targetTitle: string;
  details: string;
  adminName: string;
  timestamp: string;
}

