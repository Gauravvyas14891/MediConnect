import { Student, Post, Challenge, NotificationItem, ReportedItem, SystemAnnouncement, Badge, AdminAuditLog } from '../types';
import { calculateStudentScore, calculateProfileCompletion } from '../utils/scoring';
import { generateAdditionalStudents } from './generatedStudents';

import challengeDsaBanner from '../assets/images/challenge_dsa_leetcode_1794834765183.jpg';
import challengeAiBanner from '../assets/images/challenge_ai_hackathon_1794834766037.jpg';
import challengeWebBanner from '../assets/images/challenge_web_fullstack_1794834767049.jpg';
import challengeHardwareBanner from '../assets/images/challenge_hardware_iot_1794834766069.jpg';
import challengeUiUxBanner from '../assets/images/challenge_uiux_sprint_1794834766731.jpg';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Top Performer',
    description: 'Maintained top 5% overall campus leaderboard standing',
    iconName: 'Trophy',
    category: 'leaderboard'
  },
  {
    id: 'badge-2',
    name: 'Hackathon Hero',
    description: 'Secured podium placement in inter-college hackathons',
    iconName: 'Flame',
    category: 'competition'
  },
  {
    id: 'badge-3',
    name: 'Project Builder',
    description: 'Published 3+ high-impact open source or live deployed projects',
    iconName: 'Code2',
    category: 'projects'
  },
  {
    id: 'badge-4',
    name: 'Rising Star',
    description: 'Demonstrated rapid climb in competitive programming and peer endorsements',
    iconName: 'Sparkles',
    category: 'profile'
  },
  {
    id: 'badge-5',
    name: 'Community Contributor',
    description: 'Shared valuable internship opportunities, write-ups and peer guidance',
    iconName: 'Users',
    category: 'community'
  },
  {
    id: 'badge-6',
    name: 'Challenge Champion',
    description: 'Winner of official MediConnect campus challenges',
    iconName: 'Award',
    category: 'competition'
  },
  {
    id: 'badge-7',
    name: 'Profile Builder',
    description: 'Achieved 100% verified profile completion with credentials',
    iconName: 'CheckCircle2',
    category: 'profile'
  }
];

export const INITIAL_STUDENTS_RAW: Omit<Student, 'leaderboardScore' | 'leaderboardRank' | 'profileCompletion'>[] = [
  {
    id: 'student-1',
    name: 'Gourav Vyas',
    email: 'en24cs3040061@medicaps.ac.in',
    rollNumber: 'EN24CS3040061',
    password: '123456789',
    canAccessAdmin: true,
    isVerified: true,
    gender: 'male',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop&q=80',
    course: 'B.Tech',
    branch: 'Computer Science (CSE)',
    year: '3rd Year',
    semester: 6,
    cgpa: 9.24,
    collegeName: 'Medi-Caps University',
    location: 'Indore, MP',
    bio: '3rd Year B.Tech CSE student at Medi-Caps University. Systems developer, full-stack engineer & competitive programmer. Passionate about distributed systems, cloud computing, and campus hackathons.',
    followersCount: 156,
    followingCount: 92,
    status: 'active',
    createdAt: '2024-08-15T10:00:00Z',
    externalProfiles: {
      github: 'https://github.com/gouravvyas-dev',
      linkedin: 'https://linkedin.com/in/gourav-vyas-cs',
      leetcode: 'https://leetcode.com/u/gourav_codes',
      codeforces: 'https://codeforces.com/profile/gourav_cf',
      geeksforgeeks: 'https://auth.geeksforgeeks.org/user/gouravcs'
    },
    skills: [
      { id: 'sk-1', name: 'Go / Golang', category: 'Languages', endorsements: 21 },
      { id: 'sk-2', name: 'TypeScript', category: 'Languages', endorsements: 26 },
      { id: 'sk-3', name: 'Distributed Systems', category: 'Core CS', endorsements: 19 },
      { id: 'sk-4', name: 'PostgreSQL & Redis', category: 'Cloud & DevOps', endorsements: 24 },
      { id: 'sk-5', name: 'Docker & K8s', category: 'Cloud & DevOps', endorsements: 17 },
      { id: 'sk-6', name: 'Next.js / React', category: 'Frameworks', endorsements: 25 }
    ],
    projects: [
      {
        id: 'proj-1',
        studentId: 'student-1',
        title: 'NexusKV: Distributed In-Memory Key-Value Store',
        description: 'Raft consensus-backed distributed cache in Go with Raft leader election, WAL logs, and sub-millisecond p99 latency.',
        technologies: ['Go', 'Raft Protocol', 'gRPC', 'Protobuf'],
        githubUrl: 'https://github.com/gouravvyas-dev/nexus-kv',
        demoUrl: 'https://nexus-kv.demo.internal',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=350&fit=crop&q=80',
        category: 'Systems / Cloud',
        starsCount: 92,
        featured: true
      },
      {
        id: 'proj-2',
        studentId: 'student-1',
        title: 'SmartCampus IoT Mobility Tracker',
        description: 'Real-time shuttle and campus crowd density analytics engine using MQTT streams, WebSockets, and geospatial indexing.',
        technologies: ['TypeScript', 'Node.js', 'Redis Geo', 'MapLibre'],
        githubUrl: 'https://github.com/gouravvyas-dev/smart-campus-tracker',
        demoUrl: 'https://campus-track.demo.internal',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=350&fit=crop&q=80',
        category: 'Hardware / IoT',
        starsCount: 46
      }
    ],
    internships: [
      {
        id: 'intern-1',
        studentId: 'student-1',
        organization: 'Razorpay',
        role: 'Software Engineering Intern (Payments Core)',
        startDate: 'May 2025',
        endDate: 'July 2025',
        location: 'Bengaluru, Remote',
        description: 'Engineered idempotency deduplication layer handling 12,000 req/sec with Redis clusters, reducing payment reconciliation latency by 38%.',
        certificateUrl: 'https://drive.google.com/internship-razorpay.pdf'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        studentId: 'student-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: 'Jan 2025',
        credentialUrl: 'https://aws.amazon.com/verification/example',
        credentialId: 'AWS-SAA-839210'
      },
      {
        id: 'cert-2',
        studentId: 'student-1',
        name: 'CKA: Certified Kubernetes Administrator',
        issuer: 'The Linux Foundation',
        issueDate: 'Dec 2024',
        credentialUrl: 'https://www.credly.com/org/linux-foundation'
      }
    ],
    achievements: [
      '1st Place — Smart India Hackathon 2024 (College internal round)',
      'Global Rank 342 — LeetCode Weekly Contest 412',
      'Vice President — Google Developer Student Club (GDSC) Campus Chapter'
    ],
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[2], INITIAL_BADGES[4]]
  },
  {
    id: 'student-2',
    name: 'Priya Nair',
    email: 'en21ai301012@medicaps.ac.in',
    rollNumber: 'EN21AI301012',
    gender: 'female',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=400&fit=crop&q=80',
    course: 'B.Tech',
    branch: 'CSE - AI & ML',
    year: '4th Year',
    semester: 8,
    cgpa: 9.82,
    collegeName: 'Medi-Caps University',
    location: 'Indore / Bengaluru',
    bio: 'Research intern at IISc & incoming ML Engineer @ Microsoft. Focused on Large Multimodal Models and Low-Resource NLP.',
    followersCount: 388,
    followingCount: 112,
    status: 'active',
    createdAt: '2023-09-01T10:00:00Z',
    externalProfiles: {
      github: 'https://github.com/priyanair-ai',
      linkedin: 'https://linkedin.com/in/priya-nair-ai',
      leetcode: 'https://leetcode.com/u/priya_ml',
      codeforces: 'https://codeforces.com/profile/pnair_cf',
      codechef: 'https://www.codechef.com/users/priyanair'
    },
    skills: [
      { id: 'sk-10', name: 'PyTorch', category: 'AI & ML', endorsements: 46 },
      { id: 'sk-11', name: 'LLM Fine-tuning (LoRA / QLoRA)', category: 'AI & ML', endorsements: 38 },
      { id: 'sk-12', name: 'Python', category: 'Languages', endorsements: 51 },
      { id: 'sk-13', name: 'C++', category: 'Languages', endorsements: 34 },
      { id: 'sk-14', name: 'Computer Vision', category: 'AI & ML', endorsements: 29 },
      { id: 'sk-15', name: 'Hugging Face & ONNX', category: 'Cloud & DevOps', endorsements: 32 }
    ],
    projects: [
      {
        id: 'proj-3',
        studentId: 'student-2',
        title: 'MedVQA: Multimodal Clinical Diagnostic Co-Pilot',
        description: 'VQA model trained on MIMIC-CXR and NIH chest X-ray scans with explainable grad-CAM heatmaps for pulmonary diagnoses.',
        technologies: ['PyTorch', 'CLIP', 'Transformers', 'FastAPI', 'CUDA'],
        githubUrl: 'https://github.com/priyanair-ai/med-vqa',
        demoUrl: 'https://medvqa-demo.org',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=350&fit=crop&q=80',
        category: 'AI / ML',
        starsCount: 198,
        featured: true
      },
      {
        id: 'proj-4',
        studentId: 'student-2',
        title: 'IndicOCR: Lightweight Edge Document Scanner',
        description: 'Quantized OCR engine for Hindi, Marathi, and Tamil scripts running at 45 FPS on edge mobile hardware.',
        technologies: ['C++', 'ONNX Runtime', 'Python', 'OpenCV'],
        githubUrl: 'https://github.com/priyanair-ai/indic-ocr',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=350&fit=crop&q=80',
        category: 'AI / ML',
        starsCount: 112
      },
      {
        id: 'proj-5',
        studentId: 'student-2',
        title: 'CampusBot: Vector-RAG Student Handbook Assistant',
        description: 'Retrieval augmented generation over 400 pages of university circulars, curriculum syllabi and academic rules.',
        technologies: ['LangChain', 'ChromaDB', 'Next.js', 'Ollama'],
        githubUrl: 'https://github.com/priyanair-ai/campus-bot',
        category: 'AI / ML',
        starsCount: 65
      }
    ],
    internships: [
      {
        id: 'intern-2',
        studentId: 'student-2',
        organization: 'Microsoft Research (MSR India)',
        role: 'Research Intern — Multilingual AI',
        startDate: 'Jan 2025',
        endDate: 'Present',
        location: 'Bengaluru, India',
        description: 'Co-authored paper accepted at ACL 2025 on synthetic training data synthesis for low-resource Indic tokenizers.',
        certificateUrl: 'https://msr.org/cert-example'
      },
      {
        id: 'intern-3',
        studentId: 'student-2',
        organization: 'Indian Institute of Science (IISc)',
        role: 'Deep Learning Fellow',
        startDate: 'May 2024',
        endDate: 'July 2024',
        location: 'Bengaluru',
        description: 'Developed self-supervised video segmentation pipelines for drone imagery.'
      }
    ],
    certifications: [
      {
        id: 'cert-3',
        studentId: 'student-2',
        name: 'Deep Learning Specialization (Andrew Ng)',
        issuer: 'DeepLearning.AI / Coursera',
        issueDate: 'Aug 2023',
        credentialUrl: 'https://coursera.org/verify/example'
      },
      {
        id: 'cert-4',
        studentId: 'student-2',
        name: 'TensorFlow Developer Certificate',
        issuer: 'Google',
        issueDate: 'Nov 2023'
      }
    ],
    achievements: [
      'Published author in ACL 2025 Findings',
      'Winner — Microsoft Imagine Cup 2024 (Regional Finalist)',
      'University Gold Medalist Candidate (Cumulative GPA 9.82)'
    ],
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[1], INITIAL_BADGES[2], INITIAL_BADGES[5], INITIAL_BADGES[6]]
  },
  {
    id: 'student-3',
    name: 'Rohan Verma',
    email: 'en22cs301088@medicaps.ac.in',
    rollNumber: 'EN22CS301088',
    gender: 'male',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=400&fit=crop&q=80',
    course: 'B.Tech',
    branch: 'Computer Science (CSE)',
    year: '3rd Year',
    semester: 6,
    cgpa: 9.35,
    collegeName: 'Medi-Caps University',
    location: 'Indore',
    bio: 'Full-stack craftsman & Web3 security auditor. Loves React, Rust, and writing clean, bulletproof smart contracts.',
    followersCount: 210,
    followingCount: 95,
    status: 'active',
    createdAt: '2024-08-10T12:00:00Z',
    externalProfiles: {
      github: 'https://github.com/rohanverma-dev',
      linkedin: 'https://linkedin.com/in/rohanverma-eng',
      codeforces: 'https://codeforces.com/profile/rohan_cf',
      leetcode: 'https://leetcode.com/u/rohan_dev'
    },
    skills: [
      { id: 'sk-20', name: 'Rust', category: 'Languages', endorsements: 22 },
      { id: 'sk-21', name: 'React & Tailwind', category: 'Frameworks', endorsements: 31 },
      { id: 'sk-22', name: 'Solidity & Security', category: 'Core CS', endorsements: 19 },
      { id: 'sk-23', name: 'PostgreSQL', category: 'Cloud & DevOps', endorsements: 18 }
    ],
    projects: [
      {
        id: 'proj-6',
        studentId: 'student-3',
        title: 'VeriDegree: Decentralized Academic Credential Issuer',
        description: 'Zero-knowledge verification of college marks sheets and degree transcripts preventing document fraud.',
        technologies: ['Solidity', 'Circom', 'Next.js', 'Ethers.js'],
        githubUrl: 'https://github.com/rohanverma-dev/veridegree',
        demoUrl: 'https://veridegree.internal',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=350&fit=crop&q=80',
        category: 'Cybersecurity',
        starsCount: 76
      },
      {
        id: 'proj-7',
        studentId: 'student-3',
        title: 'FastCanvas: Collaborative Whiteboard Engine',
        description: 'WebRTC and Canvas peer-to-peer real-time collaboration canvas with CRDT conflict resolution.',
        technologies: ['TypeScript', 'HTML5 Canvas', 'Yjs', 'WebRTC'],
        githubUrl: 'https://github.com/rohanverma-dev/fast-canvas',
        category: 'Web App',
        starsCount: 54
      }
    ],
    internships: [
      {
        id: 'intern-4',
        studentId: 'student-3',
        organization: 'Polygon Labs',
        role: 'Smart Contract Security Fellow',
        startDate: 'June 2024',
        endDate: 'August 2024',
        description: 'Reviewed 14 protocol contracts, finding 3 critical reentrancy and oracle manipulation bugs.'
      }
    ],
    certifications: [
      {
        id: 'cert-5',
        studentId: 'student-3',
        name: 'Certified Ethereum Developer',
        issuer: 'Blockchain Council',
        issueDate: 'May 2024'
      }
    ],
    achievements: [
      'Winner — ETHIndia 2024 Track Sponsor Prize ($3,500)',
      '1st Place — MediConnect Campus Hack Week'
    ],
    badges: [INITIAL_BADGES[1], INITIAL_BADGES[2], INITIAL_BADGES[5]]
  },
  {
    id: 'student-4',
    name: 'Ananya Iyer',
    email: 'en23ds301019@medicaps.ac.in',
    rollNumber: 'EN23DS301019',
    gender: 'female',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=400&fit=crop&q=80',
    course: 'B.Sc Data Science',
    branch: 'Data Science',
    year: '2nd Year',
    semester: 4,
    cgpa: 9.60,
    collegeName: 'Medi-Caps University',
    location: 'Indore',
    bio: 'Data story teller, Kaggle Expert, and passionate about computational biology & bioinformatics.',
    followersCount: 165,
    followingCount: 78,
    status: 'active',
    createdAt: '2024-09-02T10:00:00Z',
    externalProfiles: {
      github: 'https://github.com/ananyaiyer-ds',
      linkedin: 'https://linkedin.com/in/ananya-iyer-ds',
      leetcode: 'https://leetcode.com/u/ananya_ds'
    },
    skills: [
      { id: 'sk-30', name: 'Python', category: 'Languages', endorsements: 33 },
      { id: 'sk-31', name: 'Data Visualization & Tableau', category: 'Design & Soft Skills', endorsements: 25 },
      { id: 'sk-32', name: 'SQL & BigQuery', category: 'Cloud & DevOps', endorsements: 28 },
      { id: 'sk-33', name: 'Statistical Modeling', category: 'Core CS', endorsements: 21 }
    ],
    projects: [
      {
        id: 'proj-8',
        studentId: 'student-4',
        title: 'BioSeq: DNA Mutation Predictor',
        description: 'Deep sequence modeling to predict drug resistance in microbial genomes using transformer attention maps.',
        technologies: ['Python', 'Biopython', 'PyTorch', 'Plotly'],
        githubUrl: 'https://github.com/ananyaiyer-ds/bioseq',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=350&fit=crop&q=80',
        category: 'AI / ML',
        starsCount: 62
      }
    ],
    internships: [
      {
        id: 'intern-5',
        studentId: 'student-4',
        organization: 'Serum Institute (Summer Trainee)',
        role: 'Data Science Intern',
        startDate: 'May 2025',
        endDate: 'July 2025',
        description: 'Analyzed clinical trial telemetry using Bayesian regression pipelines.'
      }
    ],
    certifications: [
      {
        id: 'cert-6',
        studentId: 'student-4',
        name: 'Google Data Analytics Professional',
        issuer: 'Google',
        issueDate: 'Feb 2024'
      }
    ],
    achievements: [
      'Kaggle Notebooks Master (Top 1.5% globally)',
      'Department Rank 1 — Data Science 2024'
    ],
    badges: [INITIAL_BADGES[0], INITIAL_BADGES[3]]
  },
  {
    id: 'student-5',
    name: 'Devansh Sen',
    email: 'en22ec301034@medicaps.ac.in',
    rollNumber: 'EN22EC301034',
    gender: 'male',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop&q=80',
    course: 'B.Tech',
    branch: 'Electronics & Comm (ECE)',
    year: '3rd Year',
    semester: 6,
    cgpa: 8.92,
    collegeName: 'Medi-Caps University',
    location: 'Indore',
    bio: 'Embedded Systems & Robotics hobbyist. Tinkering with ESP32, ROS2, and autonomous rover telemetry.',
    followersCount: 119,
    followingCount: 64,
    status: 'active',
    createdAt: '2024-08-20T10:00:00Z',
    externalProfiles: {
      github: 'https://github.com/devanshsen-iot',
      linkedin: 'https://linkedin.com/in/devansh-sen-ece'
    },
    skills: [
      { id: 'sk-40', name: 'Embedded C / C++', category: 'Languages', endorsements: 27 },
      { id: 'sk-41', name: 'ROS2 & Gazebo', category: 'Core CS', endorsements: 19 },
      { id: 'sk-42', name: 'PCB Design (KiCad)', category: 'Hardware / IoT' as any, endorsements: 24 }
    ],
    projects: [
      {
        id: 'proj-9',
        studentId: 'student-5',
        title: 'AeroQuad: Autonomous Indoor Survey Drone',
        description: 'Optical flow navigation and obstacle avoidance firmware built from scratch for custom STM32 FCB.',
        technologies: ['C++', 'FreeRTOS', 'KiCad', 'MAVLink'],
        githubUrl: 'https://github.com/devanshsen-iot/aeroquad',
        image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=350&fit=crop&q=80',
        category: 'Hardware / IoT',
        starsCount: 47
      }
    ],
    internships: [],
    certifications: [
      {
        id: 'cert-7',
        studentId: 'student-5',
        name: 'ARM Embedded Systems Specialist',
        issuer: 'ARM University Program',
        issueDate: 'Mar 2024'
      }
    ],
    achievements: [
      'Best Hardware Innovation — Central India Tech Fest',
      'Team Lead — Robocon Medi-Caps chapter'
    ],
    badges: [INITIAL_BADGES[1], INITIAL_BADGES[3]]
  },
  {
    id: 'student-6',
    name: 'Kavya Patel',
    email: 'en22it301008@medicaps.ac.in',
    rollNumber: 'EN22IT301008',
    gender: 'female',profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&h=400&fit=crop&q=80',
    course: 'B.Tech',
    branch: 'Information Technology (IT)',
    year: '2nd Year',
    semester: 4,
    cgpa: 9.45,
    collegeName: 'Medi-Caps University',
    location: 'Indore',
    bio: 'UI/UX Designer who codes. Transforming complex workflows into buttery smooth, accessible interfaces.',
    followersCount: 195,
    followingCount: 140,
    status: 'active',
    createdAt: '2024-09-01T10:00:00Z',
    externalProfiles: {
      github: 'https://github.com/kavyapatel-ui',
      linkedin: 'https://linkedin.com/in/kavya-patel-design'
    },
    skills: [
      { id: 'sk-50', name: 'UI / UX Design (Figma)', category: 'Design & Soft Skills', endorsements: 39 },
      { id: 'sk-51', name: 'Tailwind CSS', category: 'Frameworks', endorsements: 32 },
      { id: 'sk-52', name: 'React / Next.js', category: 'Frameworks', endorsements: 25 },
      { id: 'sk-53', name: 'Framer Motion', category: 'Frameworks', endorsements: 22 }
    ],
    projects: [
      {
        id: 'proj-10',
        studentId: 'student-6',
        title: 'Lumina: Micro-SaaS Design System for Students',
        description: 'Complete open-source accessible component library with 45+ headless primitives and WCAG AAA compliance.',
        technologies: ['Figma', 'TypeScript', 'Tailwind CSS', 'Storybook'],
        githubUrl: 'https://github.com/kavyapatel-ui/lumina-ui',
        demoUrl: 'https://lumina-ui.preview.dev',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=350&fit=crop&q=80',
        category: 'Web App',
        starsCount: 130
      }
    ],
    internships: [
      {
        id: 'intern-6',
        studentId: 'student-6',
        organization: 'Postman (Contractor)',
        role: 'Design Systems Intern',
        startDate: 'Oct 2024',
        endDate: 'Jan 2025',
        description: 'Standardized typography scale and color tokens across Postman desktop clients.'
      }
    ],
    certifications: [
      {
        id: 'cert-8',
        studentId: 'student-6',
        name: 'Google UX Design Professional Certificate',
        issuer: 'Google',
        issueDate: 'Apr 2024'
      }
    ],
    achievements: [
      'Featured on Dribbble Top 50 Student UI showcases',
      'Campus UI Lead for Annual Tech Fest 2025'
    ],
    badges: [INITIAL_BADGES[3], INITIAL_BADGES[4]]
  }
];

const GENERATED_STUDENTS_RAW = generateAdditionalStudents();
const ALL_STUDENTS_RAW = [...INITIAL_STUDENTS_RAW, ...GENERATED_STUDENTS_RAW];

// Helper to compute rankings and completion scores
export function prepareInitialStudents(): Student[] {
  const studentsWithScores = ALL_STUDENTS_RAW.map(s => {
    const { total } = calculateStudentScore(s);
    const { percentage } = calculateProfileCompletion(s);
    return {
      ...s,
      leaderboardScore: total,
      leaderboardRank: 1, // temporary, will sort below
      profileCompletion: percentage
    } as Student;
  });

  // Sort descending by score to assign rank
  studentsWithScores.sort((a, b) => b.leaderboardScore - a.leaderboardScore);

  studentsWithScores.forEach((s, idx) => {
    s.leaderboardRank = idx + 1;
  });

  return studentsWithScores;
}

export const INITIAL_STUDENTS: Student[] = prepareInitialStudents();

const avatarFor = (studentId: string): string => {
  const found = ALL_STUDENTS_RAW.find(s => s.id === studentId);
  return found ? found.profilePhoto : INITIAL_STUDENTS_RAW[0].profilePhoto;
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    studentId: 'student-2',
    studentName: 'Priya Nair',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&q=80',
    studentBranchYear: 'CSE - AI & ML · 4th Year',
    studentRoll: '0827AI211012',
    category: 'Opportunity',
    content: '🚨 Microsoft Research India is opening up off-campus applications for the Research Fellow (RF) batch of 2025-26! If you have strong foundations in PyTorch, algorithms, or systems, feel free to drop me a DM with your GitHub profile and latest paper/project. Happy to refer 3 motivated students from our campus!',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&h=500&fit=crop&q=80',
    tags: ['Research', 'Internship', 'Microsoft', 'AI', 'Referral'],
    likes: 84,
    hasLiked: false,
    commentsCount: 14,
    sharesCount: 31,
    saved: false,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        studentId: 'student-1',
        studentName: 'Gourav Vyas',
        studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces&q=80',
        studentBranchYear: 'CSE · 3rd Year',
        content: 'This is incredible Priya! Sending over my NexusKV distributed system repo and resume. Thank you for opening this up for campus folks!',
        createdAt: '1 hour ago',
        likes: 7
      },
      {
        id: 'c-2',
        postId: 'post-1',
        studentId: 'student-4',
        studentName: 'Ananya Iyer',
        studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces&q=80',
        studentBranchYear: 'Data Science · 2nd Year',
        content: 'Does the RF program take undergraduate students from 2nd/3rd year for summer stints, or only graduating batches?',
        createdAt: '45 mins ago',
        likes: 3
      }
    ]
  },
  {
    id: 'post-2',
    studentId: 'student-1',
    studentName: 'Gourav Vyas',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces&q=80',
    studentBranchYear: 'CSE · 3rd Year',
    studentRoll: 'EN24CS3040061',
    category: 'Project',
    content: 'Just published v1.2 of NexusKV — a lightweight distributed key-value store built in Go from scratch. Implemented the Raft consensus algorithm with term election, log replication, and zero-downtime leader switches. Benchmark results: 14,800 write ops/sec on 3 nodes cluster! Check out the GitHub repo and star if you find it helpful!',
    mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&h=500&fit=crop&q=80',
    tags: ['Go', 'DistributedSystems', 'Raft', 'OpenSource'],
    likes: 56,
    hasLiked: true,
    commentsCount: 8,
    sharesCount: 12,
    saved: true,
    createdAt: '5 hours ago',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        studentId: 'student-3',
        studentName: 'Rohan Verma',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80',
        studentBranchYear: 'CSE · 3rd Year',
        content: 'Insane work on the WAL compaction Aarav! Did you benchmark how it handles network partitions during leader heartbeat timeout?',
        createdAt: '3 hours ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post-3',
    studentId: 'student-3',
    studentName: 'Rohan Verma',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces&q=80',
    studentBranchYear: 'CSE · 3rd Year',
    studentRoll: '0827CS221088',
    category: 'Team Formation',
    content: 'Looking for 1 frontend wizard (Next.js + Tailwind) and 1 AI/ML researcher to team up for the upcoming Central Zone Smart City Hackathon next weekend! We already have the backend and zero-knowledge verification architecture planned. Cash pool is ₹1.5 Lakhs! Reply or shoot a message if interested.',
    tags: ['Hackathon', 'TeamFormation', 'NextJS', 'SmartCity'],
    likes: 38,
    hasLiked: false,
    commentsCount: 6,
    sharesCount: 9,
    saved: false,
    createdAt: '1 day ago',
    comments: []
  },
  {
    id: 'post-4',
    studentId: 'student-6',
    studentName: 'Kavya Patel',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces&q=80',
    studentBranchYear: 'IT · 2nd Year',
    studentRoll: '0827IT221008',
    category: 'Achievement',
    content: 'Super thrilled to share that Lumina UI — the open source student-first design system I created last month — just crossed 130 GitHub stars and got featured on DailyDev! Big thanks to everyone on campus who tested the Figma tokens and gave early feedback.',
    mediaUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&h=500&fit=crop&q=80',
    tags: ['Design', 'UIUX', 'Figma', 'Milestone'],
    likes: 92,
    hasLiked: false,
    commentsCount: 11,
    sharesCount: 15,
    saved: false,
    createdAt: '2 days ago',
    comments: []
  },
  {
    id: 'post-5',
    studentId: 'student-7',
    studentName: 'Aarav Kulkarni',
    studentAvatar: avatarFor('student-7'),
    studentBranchYear: 'CSE · 1st Year',
    studentRoll: 'EN25CS301100',
    category: 'Help',
    content: 'Just started 2nd semester C++ & DSA prep. Quick question for seniors — should we finish Striver A2Z sheet first or jump straight into LeetCode daily challenges? Also is anyone around Central Library around 4 PM to practice basic recursion/arrays together?',
    tags: ['DSA', 'FirstYear', 'LeetCode', 'StudyGroup'],
    likes: 24,
    hasLiked: false,
    commentsCount: 2,
    sharesCount: 3,
    saved: false,
    createdAt: '3 hours ago',
    comments: [
      {
        id: 'c-501',
        postId: 'post-5',
        studentId: 'student-1',
        studentName: 'Gourav Vyas',
        studentAvatar: avatarFor('student-1'),
        studentBranchYear: 'CSE · 3rd Year',
        content: 'Do arrays, recursion, and linked list basics from A2Z first for 3-4 weeks, then start attempting LeetCode Easy + Medium daily. Consistency beats rushing!',
        createdAt: '2 hours ago',
        likes: 9
      },
      {
        id: 'c-502',
        postId: 'post-5',
        studentId: 'student-11',
        studentName: 'Kabir Malhotra',
        studentAvatar: avatarFor('student-11'),
        studentBranchYear: 'CSE · 2nd Year',
        content: 'I usually sit on the 2nd floor reading table after 4:15 PM. Happy to help debug pointers/recursion anytime.',
        createdAt: '1 hour ago',
        likes: 4
      }
    ]
  },
  {
    id: 'post-6',
    studentId: 'student-14',
    studentName: 'Nandini Dubey',
    studentAvatar: avatarFor('student-14'),
    studentBranchYear: 'CSE - AI & ML · 4th Year',
    studentRoll: 'EN22AI301219',
    category: 'Internship',
    content: 'Wrapped up my summer internship interview loop at InfoBeans Indore yesterday! Sharing the topics they focused on for 3rd/4th year folks: SQL joins & window functions, basic REST API status codes, 2 medium array/string questions, and a deep dive into our resume minor project. Revise your own project codebase well!',
    tags: ['IndoreTech', 'InternshipPrep', 'SQL', 'Placement'],
    likes: 47,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 18,
    saved: false,
    createdAt: '6 hours ago',
    comments: [
      {
        id: 'c-601',
        postId: 'post-6',
        studentId: 'student-16',
        studentName: 'Riya Sharma',
        studentAvatar: avatarFor('student-16'),
        studentBranchYear: 'IT · 3rd Year',
        content: 'Thanks for sharing Nandini! Did they ask OS/DBMS theory or mostly SQL queries and project architecture?',
        createdAt: '4 hours ago',
        likes: 3
      }
    ]
  },
  {
    id: 'post-7',
    studentId: 'student-15',
    studentName: 'Pranav Agrawal',
    studentAvatar: avatarFor('student-15'),
    studentBranchYear: 'IT · 3rd Year',
    studentRoll: 'EN23IT301236',
    category: 'Team Formation',
    content: 'Forming a 4-member team for the Smart India Hackathon (SIH) internal college selection round! We have 2 backend/DB folks and 1 UI designer already. Need 1 teammate comfortable with Flutter or React Native (or Python FastAPI) who can commit evenings this week to build the prototype.',
    tags: ['SIH2026', 'HackathonTeam', 'Flutter', 'MediCaps'],
    likes: 31,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 7,
    saved: false,
    createdAt: '8 hours ago',
    comments: [
      {
        id: 'c-701',
        postId: 'post-7',
        studentId: 'student-19',
        studentName: 'Harshvardhan Jain',
        studentAvatar: avatarFor('student-19'),
        studentBranchYear: 'IT · 2nd Year',
        content: 'Count me in if you still need Flutter! Built two Firebase apps last sem — sending my GitHub on profile.',
        createdAt: '6 hours ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post-8',
    studentId: 'student-18',
    studentName: 'Tanvi Saxena',
    studentAvatar: avatarFor('student-18'),
    studentBranchYear: 'CSE · 3rd Year',
    studentRoll: 'EN23CS301287',
    category: 'Discussion',
    content: 'Compiled clean unit-1 to unit-4 revision notes for DBMS (Normal Forms, B+ Trees, Concurrency & 2PL) and OS (CPU Scheduling, Deadlocks, Paging) before mid-sems. Kept diagrams simple with solved numerical examples from past Medi-Caps question papers. Ping me if you want the PDF link.',
    tags: ['DBMS', 'OperatingSystems', 'MidSemNotes', 'CoreCS'],
    likes: 64,
    hasLiked: false,
    commentsCount: 2,
    sharesCount: 29,
    saved: false,
    createdAt: '12 hours ago',
    comments: [
      {
        id: 'c-801',
        postId: 'post-8',
        studentId: 'student-22',
        studentName: 'Kriti Bansal',
        studentAvatar: avatarFor('student-22'),
        studentBranchYear: 'CSE · 2nd Year',
        content: 'Lifesaver before mid-sems! Especially the B+ tree insertion numericals.',
        createdAt: '10 hours ago',
        likes: 6
      },
      {
        id: 'c-802',
        postId: 'post-8',
        studentId: 'student-25',
        studentName: 'Arjun Purohit',
        studentAvatar: avatarFor('student-25'),
        studentBranchYear: 'CSE · 3rd Year',
        content: 'Shared with our section group too, super clean diagrams.',
        createdAt: '9 hours ago',
        likes: 2
      }
    ]
  },
  {
    id: 'post-9',
    studentId: 'student-21',
    studentName: 'Yashwant Solanki',
    studentAvatar: avatarFor('student-21'),
    studentBranchYear: 'ECE · 3rd Year',
    studentRoll: 'EN23EC301338',
    category: 'Help',
    content: 'Anyone in 3rd/4th year ECE or Robotics club worked with ESP32 + MQTT over college Wi-Fi? Our smart lab power meter drops packets whenever it reconnects after 20 mins. Trying to figure out if it is broker keep-alive timeout or captive portal issue. Would appreciate 10 mins of debugging help near Block A lab!',
    tags: ['ESP32', 'IoT', 'ECE', 'MinorProject'],
    likes: 19,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 4,
    saved: false,
    createdAt: '1 day ago',
    comments: [
      {
        id: 'c-901',
        postId: 'post-9',
        studentId: 'student-5',
        studentName: 'Devansh Sen',
        studentAvatar: avatarFor('student-5'),
        studentBranchYear: 'ECE · 3rd Year',
        content: 'Yes! Campus Wi-Fi idle timeout kicks ESP32 if keepAlive is default 15s and no ping is sent. Set mqttClient.setKeepAlive(60) and test on a mobile hotspot first to isolate.',
        createdAt: '20 hours ago',
        likes: 8
      }
    ]
  },
  {
    id: 'post-10',
    studentId: 'student-24',
    studentName: 'Shruti Mandloi',
    studentAvatar: avatarFor('student-24'),
    studentBranchYear: 'CSE · 2nd Year',
    studentRoll: 'EN24CS301389',
    category: 'Achievement',
    content: 'Small personal win: crossed 100 solved problems on LeetCode today (62 Easy, 34 Medium, 4 Hard)! Still get stuck badly on DP state transitions and Graph BFS variations, so if anyone else is around the 100-150 mark and wants an accountability partner for weekend contests, let us connect.',
    tags: ['100DaysOfCode', 'LeetCode', 'Milestone', 'DSA'],
    likes: 53,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 5,
    saved: false,
    createdAt: '1 day ago',
    comments: [
      {
        id: 'c-1001',
        postId: 'post-10',
        studentId: 'student-29',
        studentName: 'Karanveer Tomar',
        studentAvatar: avatarFor('student-29'),
        studentBranchYear: 'CSE · 2nd Year',
        content: 'Congrats Shruti! Count me in for Sunday morning LeetCode Weekly discussion.',
        createdAt: '21 hours ago',
        likes: 4
      }
    ]
  },
  {
    id: 'post-11',
    studentId: 'student-26',
    studentName: 'Pooja Bhandari',
    studentAvatar: avatarFor('student-26'),
    studentBranchYear: 'IT · 4th Year',
    studentRoll: 'EN22IT301423',
    category: 'Event',
    content: 'Hosting an informal Weekend Study Jam this Saturday 11:00 AM – 1:00 PM in Seminar Hall 2 on "Git Branching, Dockerizing Your Minor Project & Deploying Free APIs". Aimed at 2nd & 3rd year students who want live demos for placement resumes instead of localhost screenshots. Bring your laptops!',
    tags: ['StudyJam', 'Docker', 'Git', 'CampusEvent'],
    likes: 44,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 16,
    saved: false,
    createdAt: '1 day ago',
    comments: []
  },
  {
    id: 'post-12',
    studentId: 'student-28',
    studentName: 'Divya Yadav',
    studentAvatar: avatarFor('student-28'),
    studentBranchYear: 'Mechanical · 3rd Year',
    studentRoll: 'EN23ME301457',
    category: 'Event',
    content: 'Heads up for ME & Civil folks — the CAD & Structural Simulation hands-on session (SolidWorks assembly constraints + basic ANSYS meshing) starts tomorrow at 2 PM in Block C CAD Lab. Limited to 40 systems so reach 15 mins early if you want a PC.',
    tags: ['Mechanical', 'SolidWorks', 'ANSYS', 'Workshop'],
    likes: 27,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 9,
    saved: false,
    createdAt: '2 days ago',
    comments: []
  },
  {
    id: 'post-13',
    studentId: 'student-31',
    studentName: 'Raghavendra Gupta',
    studentAvatar: avatarFor('student-31'),
    studentBranchYear: 'Data Science · 3rd Year',
    studentRoll: 'EN23DS301508',
    category: 'Project',
    content: 'Built a tiny Python utility over the weekend that parses our department PDF timetable and converts your specific section slots into a Google Calendar `.ics` file with 15-min class reminders. Open-sourced the parser script — PRs welcome if someone wants to add elective slot detection!',
    tags: ['Python', 'Automation', 'OpenSource', 'StudentLife'],
    likes: 58,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 22,
    saved: false,
    createdAt: '2 days ago',
    comments: [
      {
        id: 'c-1301',
        postId: 'post-13',
        studentId: 'student-34',
        studentName: 'Niharika Sisodia',
        studentAvatar: avatarFor('student-34'),
        studentBranchYear: 'CSE - AI & ML · 2nd Year',
        content: 'Just tested it for Section B and it worked cleanly! Will open a PR for lab batch A/B splitting tonight.',
        createdAt: '1 day ago',
        likes: 6
      }
    ]
  },
  {
    id: 'post-14',
    studentId: 'student-35',
    studentName: 'Devbrat Choudhary',
    studentAvatar: avatarFor('student-35'),
    studentBranchYear: 'Civil · 3rd Year',
    studentRoll: 'EN23CE301576',
    category: 'Project',
    content: 'Finished our 6th-sem Civil mini-project prototype: rainwater harvesting catchment estimation & recharge pit sizing map for the Rau campus hostels using QGIS and AutoCAD. Happy to share the CAD layers and runoff Excel sheet with juniors working on hydrology assignments.',
    tags: ['CivilEngineering', 'QGIS', 'AutoCAD', 'Sustainability'],
    likes: 22,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 6,
    saved: false,
    createdAt: '2 days ago',
    comments: []
  },
  {
    id: 'post-15',
    studentId: 'student-38',
    studentName: 'Muskan Gehlot',
    studentAvatar: avatarFor('student-38'),
    studentBranchYear: 'IT · 2nd Year',
    studentRoll: 'EN24IT301627',
    category: 'Project',
    content: 'Designed and deployed a lightweight Hostel Mess Weekly Menu & Poll app with 5 friends from our hostel wing so students can vote on Sunday breakfast items and report hygiene issues directly. Looking for 10 volunteers to stress-test it before we share with the mess committee.',
    tags: ['React', 'Firebase', 'CampusProject', 'BetaTest'],
    likes: 39,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 8,
    saved: false,
    createdAt: '3 days ago',
    comments: [
      {
        id: 'c-1501',
        postId: 'post-15',
        studentId: 'student-40',
        studentName: 'Anushka Bhargava',
        studentAvatar: avatarFor('student-40'),
        studentBranchYear: 'CSE · 2nd Year',
        content: 'Haha finally a way to vote on Sunday Poha vs Aloo Paratha! Drop the link, happy to test.',
        createdAt: '2 days ago',
        likes: 11
      }
    ]
  },
  {
    id: 'post-16',
    studentId: 'student-41',
    studentName: 'Omkar Rajpoot',
    studentAvatar: avatarFor('student-41'),
    studentBranchYear: 'Electrical · 4th Year',
    studentRoll: 'EN22EE301678',
    category: 'Discussion',
    content: 'For 3rd-year EE/ECE students sitting for core engineering placements & industrial training: brush up on 3-phase induction motor slip calculations, transformer open/short-circuit tests, and basic PLC ladder logic. Most core companies test fundamentals rather than tricky aptitude.',
    tags: ['Electrical', 'CorePlacements', 'PLC', 'InterviewTips'],
    likes: 29,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 12,
    saved: false,
    createdAt: '3 days ago',
    comments: []
  },
  {
    id: 'post-17',
    studentId: 'student-44',
    studentName: 'Jhanvi Mahajan',
    studentAvatar: avatarFor('student-44'),
    studentBranchYear: 'CSE - AI & ML · 3rd Year',
    studentRoll: 'EN23AI301729',
    category: 'Discussion',
    content: 'Honest comparison after building our 5th-sem project API: if your team already knows Python/ML libraries, FastAPI saves so much time with automatic Pydantic validation & Swagger docs compared to setting up Express + TypeScript boilerplate. Though Express still wins for quick MongoDB + Socket.io apps.',
    tags: ['FastAPI', 'ExpressJS', 'Backend', 'MinorProject'],
    likes: 41,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 7,
    saved: false,
    createdAt: '4 days ago',
    comments: [
      {
        id: 'c-1701',
        postId: 'post-17',
        studentId: 'student-47',
        studentName: 'Mayank Vishwakarma',
        studentAvatar: avatarFor('student-47'),
        studentBranchYear: 'CSE · 3rd Year',
        content: 'Agreed! Auto-generated `/docs` in FastAPI made frontend integration 2x faster for our team.',
        createdAt: '3 days ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post-18',
    studentId: 'student-50',
    studentName: 'Mansi Upadhyay',
    studentAvatar: avatarFor('student-50'),
    studentBranchYear: 'IT · 3rd Year',
    studentRoll: 'EN23IT301831',
    category: 'Team Formation',
    content: 'Need 1 UI/UX designer (Figma) for the upcoming 36-Hour Campus FinTech Sprint! Our team has 2 backend devs and 1 frontend dev ready. Theme is student expense splitting + UPI receipt categorization. Even if you are a 2nd-year with clean Figma skills, reach out!',
    tags: ['UIUX', 'Figma', 'Hackathon', 'TeamUp'],
    likes: 26,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 6,
    saved: false,
    createdAt: '4 days ago',
    comments: []
  },
  {
    id: 'post-19',
    studentId: 'student-55',
    studentName: 'Lakshya Bhadoriya',
    studentAvatar: avatarFor('student-55'),
    studentBranchYear: 'CSE · 3rd Year',
    studentRoll: 'EN23CS301916',
    category: 'Discussion',
    content: 'Starting serious GATE 2027 CS preparation alongside 6th semester classes. Looking for 3-4 focused peers who want to solve previous year Discrete Math & TOC questions together twice a week in the library after 5 PM.',
    tags: ['GATE2027', 'CSE', 'StudyGroup', 'TheoryOfComputation'],
    likes: 33,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 5,
    saved: false,
    createdAt: '5 days ago',
    comments: []
  },
  {
    id: 'post-20',
    studentId: 'student-60',
    studentName: 'Charvi Bhatnagar',
    studentAvatar: avatarFor('student-60'),
    studentBranchYear: 'CSE · 4th Year',
    studentRoll: 'EN22CS302001',
    category: 'Opportunity',
    content: 'Quick placement resume tip from reviewing 20+ junior resumes this week: avoid putting "Calculator App" or "Netflix Clone" at the top. Even a simple campus-specific CRUD app with auth, pagination, and a live deployed URL + clear README screenshots stands out way more to interviewers.',
    tags: ['ResumeTips', 'Placements', 'Projects', 'FinalYearAdvice'],
    likes: 76,
    hasLiked: false,
    commentsCount: 1,
    sharesCount: 34,
    saved: false,
    createdAt: '5 days ago',
    comments: [
      {
        id: 'c-2001',
        postId: 'post-20',
        studentId: 'student-63',
        studentName: 'Pratham Jain',
        studentAvatar: avatarFor('student-63'),
        studentBranchYear: 'CSE · 3rd Year',
        content: 'Needed this wake-up call before placement drives start next semester!',
        createdAt: '4 days ago',
        likes: 8
      }
    ]
  },
  {
    id: 'post-21',
    studentId: 'student-68',
    studentName: 'Shreya Chhabra',
    studentAvatar: avatarFor('student-68'),
    studentBranchYear: 'Data Science · 2nd Year',
    studentRoll: 'EN24DS302137',
    category: 'General',
    content: 'Anyone else taking the NPTEL "Data Science for Engineers" 8-week course this semester? Let us share assignment hints (concepts, not direct answers!) and exam center travel plans once hall tickets drop.',
    tags: ['NPTEL', 'DataScience', 'Certification', '2ndYear'],
    likes: 21,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 4,
    saved: false,
    createdAt: '6 days ago',
    comments: []
  },
  {
    id: 'post-22',
    studentId: 'student-75',
    studentName: 'Anirudh Kashyap',
    studentAvatar: avatarFor('student-75'),
    studentBranchYear: 'ECE · 2nd Year',
    studentRoll: 'EN24EC302256',
    category: 'Opportunity',
    content: 'Medi-Caps Robotics & Embedded Club is recruiting 1st and 2nd-year students for our Rover & Drone hardware sub-teams! No prior PCB design experience needed — just curiosity about Arduino/STM32, soldering, or C programming. Orientation next Wednesday 4:30 PM at Workshop Hall.',
    tags: ['RoboticsClub', 'Hardware', 'Recruitment', 'Freshers'],
    likes: 37,
    hasLiked: false,
    commentsCount: 0,
    sharesCount: 14,
    saved: false,
    createdAt: '1 week ago',
    comments: []
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: '7-Day Distributed Systems & Cloud Sprint',
    tagline: 'Build a resilient caching service or distributed worker queue from scratch',
    description: 'Students compete to build a fault-tolerant microservice in Go, Rust, or Node.js. Submissions will be tested against simulated network partitions and high concurrency loads.',
    category: 'Coding',
    startDate: 'Oct 01, 2026',
    endDate: 'Oct 10, 2026',
    status: 'Active',
    bannerImage: challengeWebBanner,
    prize: '₹25,000 Cash Pool + Cloud Credits + "Challenge Champion" Badge',
    pointsReward: 50,
    rules: [
      'Solo or pairs of 2 students maximum.',
      'Must include automated unit tests and Dockerfile.',
      'Public GitHub repository with clean README and architecture diagram.',
      'Code must be authored during the challenge window.'
    ],
    submissionRequirements: [
      'GitHub repository URL',
      'Architecture write-up (max 500 words)',
      'Benchmark results screen recording or logs'
    ],
    participantCount: 48,
    participants: ['student-1', 'student-3', 'student-5'],
    submissions: [
      {
        id: 'sub-1',
        studentId: 'student-1',
        studentName: 'Gourav Vyas',
        studentAvatar: avatarFor('student-1'),
        submittedAt: 'Yesterday at 8:30 PM',
        title: 'NexusKV Raft Cluster v1.2',
        link: 'https://github.com/gouravvyas-dev/nexus-kv',
        notes: 'Handled split-brain scenarios with odd-number quorum voting and snapshotting.',
        upvotes: 19
      }
    ]
  },
  {
    id: 'ch-2',
    title: '30-Day LeetCode & DSA Speed Blitz',
    tagline: 'Solve 1 Medium/Hard problem daily across Graphs, DP and Segment Trees',
    description: 'Level up for technical interview season! Track your daily solve streak on LeetCode with the MediConnect campus cohort.',
    category: 'Coding',
    startDate: 'Oct 01, 2026',
    endDate: 'Oct 30, 2026',
    status: 'Active',
    bannerImage: challengeDsaBanner,
    prize: '₹15,000 + MediConnect Top Coder Trophy + Referral Priority',
    pointsReward: 40,
    rules: [
      'Connect your verified LeetCode handle in MediConnect profile.',
      'Must solve the problem of the day before 11:59 PM IST.',
      'Plagiarism or copy-pasted solutions will disqualify the participant.'
    ],
    submissionRequirements: [
      'LeetCode verified handle',
      'Daily check-in via challenge page'
    ],
    participantCount: 114,
    participants: ['student-1', 'student-2', 'student-3', 'student-4'],
    submissions: []
  },
  {
    id: 'ch-3',
    title: 'Campus Life Clean UI/UX Redesign',
    tagline: 'Re-imagine everyday campus workflows into intuitive, beautiful mobile experiences',
    description: 'Design a high-fidelity prototype in Figma solving a student pain point: library seat booking, canteen token queue, or student society elections.',
    category: 'UI / UX',
    startDate: 'Oct 15, 2026',
    endDate: 'Oct 25, 2026',
    status: 'Upcoming',
    bannerImage: challengeUiUxBanner,
    prize: '₹10,000 + Figma Pro Subscriptions + Design Feature',
    pointsReward: 35,
    rules: [
      'Interactive Figma prototype link required.',
      'Must follow WCAG AA color accessibility guidelines.',
      'Include mobile and tablet viewports.'
    ],
    submissionRequirements: [
      'Figma community/prototype link',
      'Design rationale and user persona document'
    ],
    participantCount: 32,
    participants: ['student-6'],
    submissions: []
  },
  {
    id: 'ch-4',
    title: 'Medi-Caps Smart Campus Hackathon 2026',
    tagline: '36-hour flagship inter-branch hackathon solving real campus & Indore city problems',
    description: 'Form cross-branch teams of 2–4 students to prototype working software or hardware solutions across Smart Mobility, Hostel Utilities, Academic Productivity, and Sustainability.',
    category: 'Hackathon',
    startDate: 'Oct 18, 2026',
    endDate: 'Oct 20, 2026',
    status: 'Active',
    bannerImage: challengeAiBanner,
    prize: '₹50,000 Prize Pool + Incubation Cell Mentorship + SIH Wildcard',
    pointsReward: 60,
    rules: [
      'Teams of 2 to 4 registered Medi-Caps students.',
      'At least one working deployed prototype or hardware demo required at judging.',
      'Open-source libraries allowed; core project code must be written during the 36-hour sprint.'
    ],
    submissionRequirements: [
      'GitHub repository with setup guide',
      '2-minute demo walkthrough video or live URL',
      '5-slide architecture deck'
    ],
    participantCount: 142,
    participants: ['student-1', 'student-3', 'student-6', 'student-7', 'student-15'],
    submissions: []
  },
  {
    id: 'ch-5',
    title: 'GenAI & RAG Campus Copilot Challenge',
    tagline: 'Build a retrieval-augmented study or syllabus assistant with grounded citations',
    description: 'Create an AI tool that answers student questions over university timetables, lab manuals, or PYQs with accurate page citations and low hallucination rates.',
    category: 'AI / ML',
    startDate: 'Oct 05, 2026',
    endDate: 'Oct 19, 2026',
    status: 'Active',
    bannerImage: challengeAiBanner,
    prize: '₹20,000 + API Credits + AI Club Spotlight',
    pointsReward: 45,
    rules: [
      'Solo or teams of up to 3 students.',
      'Must cite exact source document chunks in every answer.',
      'Evaluation includes latency, accuracy on 20 test queries, and UX clarity.'
    ],
    submissionRequirements: [
      'Public GitHub repo with evaluation notebook',
      'Live web demo or Gradio/Streamlit link'
    ],
    participantCount: 67,
    participants: ['student-2', 'student-4', 'student-14'],
    submissions: []
  },
  {
    id: 'ch-6',
    title: '21-Day Open Source Contribution Drive',
    tagline: 'Ship verified Pull Requests to campus tools and global OSS repositories',
    description: 'Hacktober-style campus sprint encouraging students from all branches to learn Git workflows, fix issues, improve docs, and land merged PRs in real repositories.',
    category: 'Open Source',
    startDate: 'Oct 01, 2026',
    endDate: 'Oct 21, 2026',
    status: 'Active',
    bannerImage: challengeWebBanner,
    prize: '₹12,000 + Open Source Maintainer Swag Kit + Verified Badge',
    pointsReward: 35,
    rules: [
      'Minimum 3 meaningful merged PRs (spam/typo-only PRs rejected).',
      'At least 1 PR must include code or test coverage.',
      'Submit GitHub PR links for verification.'
    ],
    submissionRequirements: [
      'GitHub profile URL',
      'List of 3+ merged PR links with short summary'
    ],
    participantCount: 89,
    participants: ['student-1', 'student-3', 'student-31'],
    submissions: []
  },
  {
    id: 'ch-7',
    title: 'Embedded IoT & Smart Lab Automation Sprint',
    tagline: 'Design sensor-driven energy monitoring or automated attendance hardware nodes',
    description: 'Open to ECE, EE, ME, and CSE makers! Build ESP32/STM32/Arduino prototypes with live telemetry dashboards for smart classrooms, solar monitoring, or lab safety.',
    category: 'Hackathon',
    startDate: 'Oct 22, 2026',
    endDate: 'Oct 29, 2026',
    status: 'Upcoming',
    bannerImage: challengeHardwareBanner,
    prize: '₹18,000 + Hardware Component Grants + Lab Showcase',
    pointsReward: 45,
    rules: [
      'Teams of 2 to 4 students (cross-branch teams encouraged).',
      'Circuit schematic (KiCad/Proteus) must accompany firmware.',
      'Live physical hardware demonstration during final evaluation.'
    ],
    submissionRequirements: [
      'Firmware repository & wiring schematic PDF',
      'Demo video showing live sensor telemetry'
    ],
    participantCount: 41,
    participants: ['student-5', 'student-21', 'student-41'],
    submissions: []
  },
  {
    id: 'ch-8',
    title: 'Full-Stack Placement Portal Cloneathon',
    tagline: 'Ship a production-grade campus placement tracker with auth, filters & analytics',
    description: 'Build an end-to-end web application supporting student eligibility filtering, company drive timelines, and interview experience archives within 10 days.',
    category: 'Coding',
    startDate: 'Oct 04, 2026',
    endDate: 'Oct 14, 2026',
    status: 'Active',
    bannerImage: challengeWebBanner,
    prize: '₹15,000 + Resume Review Session with Alumni Engineers',
    pointsReward: 40,
    rules: [
      'Any modern stack allowed (MERN, Next.js, Spring Boot, Django/FastAPI).',
      'Must be deployed on a live URL with seeded sample data.',
      'Clean responsive mobile + desktop UI required.'
    ],
    submissionRequirements: [
      'Live deployed URL',
      'GitHub repository with README screenshots'
    ],
    participantCount: 74,
    participants: ['student-1', 'student-18', 'student-38'],
    submissions: []
  },
  {
    id: 'ch-9',
    title: 'SQL & Data Analytics Case Study Cup',
    tagline: 'Uncover actionable insights from Indore urban mobility & retail datasets',
    description: 'Write optimized PostgreSQL queries and craft an executive dashboard uncovering patterns in transit bottlenecks, weather correlations, and regional demand.',
    category: 'AI / ML',
    startDate: 'Oct 24, 2026',
    endDate: 'Nov 02, 2026',
    status: 'Upcoming',
    bannerImage: challengeDsaBanner,
    prize: '₹12,000 + Analytics Portfolio Feature',
    pointsReward: 30,
    rules: [
      'Solo or pairs.',
      'Submit reproducible SQL scripts or Jupyter notebooks.',
      'Dashboard must clearly answer all 5 case study prompts.'
    ],
    submissionRequirements: [
      'Notebook / SQL repo link',
      'Published Power BI / Tableau / Plotly dashboard link'
    ],
    participantCount: 53,
    participants: ['student-4', 'student-31'],
    submissions: []
  },
  {
    id: 'ch-10',
    title: 'Freshers C/C++ & Problem Solving Bootcamp',
    tagline: 'First-year friendly coding ladder covering loops, arrays, strings & recursion',
    description: 'Specifically designed for 1st-year B.Tech, BCA, and B.Sc students to build confidence in writing clean C/C++ solutions without relying on AI copy-paste.',
    category: 'Campus Life',
    startDate: 'Oct 02, 2026',
    endDate: 'Oct 16, 2026',
    status: 'Active',
    bannerImage: challengeDsaBanner,
    prize: '₹8,000 + Rising Star Badge + Senior 1-on-1 Mentorship',
    pointsReward: 25,
    rules: [
      'Exclusively open to 1st Year and 2nd Year students.',
      'Solve all 25 curated ladder problems in C, C++, Java, or Python.',
      'Short code walkthrough interview for top 10 finishers.'
    ],
    submissionRequirements: [
      'GitHub repo or HackerRank/LeetCode handle',
      'Short reflection on toughest problem solved'
    ],
    participantCount: 96,
    participants: ['student-7'],
    submissions: []
  },
  {
    id: 'ch-11',
    title: 'Web Accessibility & Micro-Interaction Jam',
    tagline: 'Audit & upgrade real student web apps for keyboard navigation & WCAG contrast',
    description: 'Completed sprint where student designers and frontend engineers audited campus portals for keyboard-only accessibility, screen reader labels, and smooth transitions.',
    category: 'UI / UX',
    startDate: 'Sep 12, 2026',
    endDate: 'Sep 22, 2026',
    status: 'Completed',
    bannerImage: challengeUiUxBanner,
    prize: '₹10,000 + Accessibility Champion Certificate',
    pointsReward: 30,
    rules: [
      'Must achieve Lighthouse Accessibility score >= 95.',
      'Document before/after contrast and keyboard focus improvements.'
    ],
    submissionRequirements: [
      'Before/After Lighthouse report',
      'GitHub PR or live prototype link'
    ],
    participantCount: 44,
    participants: ['student-6', 'student-24'],
    submissions: [
      {
        id: 'sub-11-1',
        studentId: 'student-6',
        studentName: 'Kavya Patel',
        studentAvatar: avatarFor('student-6'),
        submittedAt: 'Sep 21, 2026',
        title: 'Lumina Accessible Focus & Contrast Tokens',
        link: 'https://github.com/kavyapatel-ui/lumina-ui',
        notes: 'Upgraded 45 primitives to WCAG AAA contrast and added full keyboard roving tabindex.',
        upvotes: 28,
        isWinner: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    studentId: 'student-1',
    type: 'like',
    title: 'Post Appreciation',
    message: 'Priya Nair and 6 others liked your post about NexusKV.',
    read: false,
    createdAt: '15 mins ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&q=80'
  },
  {
    id: 'notif-2',
    studentId: 'student-1',
    type: 'comment',
    title: 'New Comment',
    message: 'Rohan Verma commented on your project: "Insane work on WAL compaction!"',
    read: false,
    createdAt: '1 hour ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&q=80'
  },
  {
    id: 'notif-3',
    studentId: 'student-1',
    type: 'challenge',
    title: 'Challenge Update',
    message: 'Your submission for "7-Day Distributed Systems Sprint" was approved and upvoted 19 times!',
    read: true,
    createdAt: 'Yesterday'
  },
  {
    id: 'notif-4',
    studentId: 'student-1',
    type: 'leaderboard',
    title: 'Leaderboard Climb',
    message: 'Congratulations! You climbed 2 spots to Rank #2 in B.Tech CSE (3rd Year).',
    read: true,
    createdAt: '2 days ago'
  }
];

export const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to the MediConnect Autumn 2026 Campus Launch',
    content: 'MediConnect is now active for all registered students across B.Tech, M.Tech, BCA, and Data Science streams. Complete your profile, connect your GitHub/LeetCode handles, and discover peer project collaborators.',
    publishedAt: 'Oct 01, 2026',
    author: 'Campus Platform Administration',
    priority: 'important'
  },
  {
    id: 'ann-2',
    title: 'Inter-College Hackathon 2026 Registrations Open',
    content: 'Official team entries are now open in the Challenges section. Check the guidelines and ensure your team members have active profiles on MediConnect.',
    publishedAt: 'Oct 03, 2026',
    author: 'Campus Platform Administration',
    priority: 'normal'
  }
];

export const INITIAL_REPORTS: ReportedItem[] = [
  {
    id: 'rep-1',
    reporterId: 'student-4',
    reporterName: 'Ananya Iyer',
    contentType: 'post',
    contentId: 'post-99',
    contentSnippet: 'Selling past exam answer keys for CSE 6th sem...',
    authorName: 'Anonymous User (Suspended)',
    reason: 'Academic integrity violation / spam content',
    status: 'pending',
    reportedAt: '3 hours ago'
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    actionType: 'student_verified',
    targetTitle: 'Gourav Vyas (EN24CS3040061)',
    details: 'Verified 3rd Year CSE institutional enrollment and authentic credentials.',
    adminName: 'Campus Lead Administrator',
    timestamp: '2 hours ago'
  },
  {
    id: 'log-2',
    actionType: 'project_verified',
    targetTitle: 'NexusKV: Distributed In-Memory Key-Value Store',
    details: 'Audited source code architecture, test suite, and open source repository.',
    adminName: 'Campus Lead Administrator',
    timestamp: '4 hours ago'
  },
  {
    id: 'log-3',
    actionType: 'post_pinned',
    targetTitle: 'Microsoft Research RF Opportunity',
    details: 'Pinned research internship referral opportunity to top of campus community feed.',
    adminName: 'Campus Lead Administrator',
    timestamp: 'Yesterday'
  },
  {
    id: 'log-4',
    actionType: 'student_suspended',
    targetTitle: 'Anonymous User (EN24CS999999)',
    details: 'Suspended account for attempting to distribute commercial spam and unauthorized exam dumps.',
    adminName: 'Campus Lead Administrator',
    timestamp: 'Yesterday'
  }
];
