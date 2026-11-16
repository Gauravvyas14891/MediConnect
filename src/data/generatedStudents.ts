import {
  Student,
  StudentCourse,
  StudentBranch,
  AcademicYear,
  SkillItem,
  Project,
  Internship,
  Certification,
  Badge,
  ExternalProfiles
} from '../types';

type RawStudent = Omit<Student, 'leaderboardScore' | 'leaderboardRank' | 'profileCompletion'>;

const BADGES_POOL: Badge[] = [
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
    id: 'badge-7',
    name: 'Profile Builder',
    description: 'Achieved 100% verified profile completion with credentials',
    iconName: 'CheckCircle2',
    category: 'profile'
  }
];

function createSvgAvatar(name: string, bg1: string, bg2: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] || 'M') + (parts[1]?.[0] || '')).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
    </defs>
    <rect width="240" height="240" rx="36" fill="url(#g)"/>
    <circle cx="195" cy="45" r="38" fill="rgba(255,255,255,0.08)"/>
    <circle cx="42" cy="200" r="52" fill="rgba(0,0,0,0.14)"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#F8FAFC" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="84" letter-spacing="2">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const AVATAR_PALETTES: [string, string][] = [
  ['#0284C7', '#0F172A'],
  ['#0D9488', '#134E4A'],
  ['#7C3AED', '#1E1B4B'],
  ['#2563EB', '#172554'],
  ['#059669', '#064E3B'],
  ['#DB2777', '#500724'],
  ['#D97706', '#451A03'],
  ['#4F46E5', '#1E1B4B'],
  ['#0891B2', '#083344'],
  ['#9333EA', '#3B0764']
];

const STUDENT_IDENTITIES: { name: string; gender: 'male' | 'female' }[] = [
  { name: 'Aarav Kulkarni', gender: 'male' },
  { name: 'Ishita Deshmukh', gender: 'female' },
  { name: 'Vivaan Joshi', gender: 'male' },
  { name: 'Meera Rathore', gender: 'female' },
  { name: 'Kabir Malhotra', gender: 'male' },
  { name: 'Sanya Tiwari', gender: 'female' },
  { name: 'Aditya Chouhan', gender: 'male' },
  { name: 'Nandini Dubey', gender: 'female' },
  { name: 'Pranav Agrawal', gender: 'male' },
  { name: 'Riya Sharma', gender: 'female' },
  { name: 'Siddharth Patidar', gender: 'male' },
  { name: 'Tanvi Saxena', gender: 'female' },
  { name: 'Harshvardhan Jain', gender: 'male' },
  { name: 'Aditi Mishra', gender: 'female' },
  { name: 'Yashwant Solanki', gender: 'male' },
  { name: 'Kriti Bansal', gender: 'female' },
  { name: 'Nikhil Shrivastava', gender: 'male' },
  { name: 'Shruti Mandloi', gender: 'female' },
  { name: 'Arjun Purohit', gender: 'male' },
  { name: 'Pooja Bhandari', gender: 'female' },
  { name: 'Manav Chaturvedi', gender: 'male' },
  { name: 'Divya Yadav', gender: 'female' },
  { name: 'Karanveer Tomar', gender: 'male' },
  { name: 'Sneha Gokhale', gender: 'female' },
  { name: 'Raghavendra Gupta', gender: 'male' },
  { name: 'Aastha Khandelwal', gender: 'female' },
  { name: 'Utkarsh Tripathi', gender: 'male' },
  { name: 'Niharika Sisodia', gender: 'female' },
  { name: 'Devbrat Choudhary', gender: 'male' },
  { name: 'Palak Garg', gender: 'female' },
  { name: 'Tushar Paliwal', gender: 'male' },
  { name: 'Muskan Gehlot', gender: 'female' },
  { name: 'Shubham Baghel', gender: 'male' },
  { name: 'Anushka Bhargava', gender: 'female' },
  { name: 'Omkar Rajpoot', gender: 'male' },
  { name: 'Bhavya Nema', gender: 'female' },
  { name: 'Chirag Maheshwari', gender: 'male' },
  { name: 'Jhanvi Mahajan', gender: 'female' },
  { name: 'Kushagra Soni', gender: 'male' },
  { name: 'Vidhi Porwal', gender: 'female' },
  { name: 'Mayank Vishwakarma', gender: 'male' },
  { name: 'Garima Tiwari', gender: 'female' },
  { name: 'Ayushman Dixit', gender: 'male' },
  { name: 'Mansi Upadhyay', gender: 'female' },
  { name: 'Samarth Dubey', gender: 'male' },
  { name: 'Aakanksha Shukla', gender: 'female' },
  { name: 'Varun Kothari', gender: 'male' },
  { name: 'Nidhi Rawat', gender: 'female' },
  { name: 'Lakshya Bhadoriya', gender: 'male' },
  { name: 'Simran Kaur', gender: 'female' },
  { name: 'Parthasarathi Rao', gender: 'male' },
  { name: 'Vanshika Goyal', gender: 'female' },
  { name: 'Deepanshu Parmar', gender: 'male' },
  { name: 'Charvi Bhatnagar', gender: 'female' },
  { name: 'Saurabh Patwardhan', gender: 'male' },
  { name: 'Ishika Nigam', gender: 'female' },
  { name: 'Pratham Jain', gender: 'male' },
  { name: 'Ritika Sen', gender: 'female' },
  { name: 'Harshit Khare', gender: 'male' },
  { name: 'Diksha Pawar', gender: 'female' },
  { name: 'Abhinav Bajpai', gender: 'male' },
  { name: 'Shreya Chhabra', gender: 'female' },
  { name: 'Gautam Ahirwar', gender: 'male' },
  { name: 'Khushi Agrawal', gender: 'female' },
  { name: 'Neelansh Vyas', gender: 'male' },
  { name: 'Saloni Barve', gender: 'female' },
  { name: 'Tejaswi Malviya', gender: 'male' },
  { name: 'Parijat Joshi', gender: 'female' },
  { name: 'Anirudh Kashyap', gender: 'male' },
  { name: 'Zoya Khan', gender: 'female' },
  { name: 'Rishabh Pandey', gender: 'male' },
  { name: 'Suhani Neema', gender: 'female' },
  { name: 'Hemant Rathod', gender: 'male' },
  { name: 'Avani Muley', gender: 'female' },
  { name: 'Kunal Wadhwani', gender: 'male' },
  { name: 'Pranjal Sahu', gender: 'female' },
  { name: 'Mohit Bundela', gender: 'male' },
  { name: 'Trisha Sengupta', gender: 'female' },
  { name: 'Yuvraj Dangi', gender: 'male' },
  { name: 'Chahat Mittal', gender: 'female' },
  { name: 'Sanket Kulkarni', gender: 'male' },
  { name: 'Vaishnavi Sharma', gender: 'female' },
  { name: 'Arpit Chaturvedi', gender: 'male' },
  { name: 'Esha Kasliwal', gender: 'female' },
  { name: 'Piyush Verma', gender: 'male' },
  { name: 'Nupur Patni', gender: 'female' },
  { name: 'Kartikeya Tiwari', gender: 'male' },
  { name: 'Arundhati Bose', gender: 'female' },
  { name: 'Akshat Shinde', gender: 'male' },
  { name: 'Rashi Mandhana', gender: 'female' },
  { name: 'Vikramaditya Singh', gender: 'male' },
  { name: 'Pragya Holkar', gender: 'female' },
  { name: 'Tanmay Deshpande', gender: 'male' },
  { name: 'Swati Panwar', gender: 'female' }
]; // 94 distinct students -> total 100 with students 1..6

interface BranchSpec {
  code: 'cs' | 'ai' | 'it' | 'ec' | 'ds' | 'me' | 'ce' | 'ee';
  branch: StudentBranch;
  courses: StudentCourse[];
}

const BRANCH_SPECS: BranchSpec[] = [
  { code: 'cs', branch: 'Computer Science (CSE)', courses: ['B.Tech', 'B.Tech', 'M.Tech', 'MCA', 'BCA'] },
  { code: 'ai', branch: 'CSE - AI & ML', courses: ['B.Tech', 'B.Tech', 'M.Tech'] },
  { code: 'it', branch: 'Information Technology (IT)', courses: ['B.Tech', 'B.Tech', 'BCA', 'MCA'] },
  { code: 'ec', branch: 'Electronics & Comm (ECE)', courses: ['B.Tech', 'B.Tech', 'M.Tech'] },
  { code: 'ds', branch: 'Data Science', courses: ['B.Sc Data Science', 'B.Tech', 'MBA'] },
  { code: 'me', branch: 'Mechanical', courses: ['B.Tech', 'B.Tech', 'M.Tech'] },
  { code: 'ce', branch: 'Civil Engineering (CE)', courses: ['B.Tech', 'B.Tech'] },
  { code: 'ee', branch: 'Electrical Engineering (EE)', courses: ['B.Tech', 'B.Tech'] }
];

interface SkillTemplate {
  name: string;
  category: SkillItem['category'];
}

const TRACKS: Record<
  string,
  {
    skills: SkillTemplate[];
    bios: string[];
    projects: { title: string; desc: string; tech: string[]; cat: Project['category'] }[];
    certs: { name: string; issuer: string }[];
  }
> = {
  cs_web: {
    skills: [
      { name: 'React & Tailwind', category: 'Frameworks' },
      { name: 'Node.js & Express', category: 'Frameworks' },
      { name: 'TypeScript', category: 'Languages' },
      { name: 'MongoDB', category: 'Cloud & DevOps' },
      { name: 'SQL & DBMS', category: 'Core CS' }
    ],
    bios: [
      'Full-stack web developer building practical campus tools with React, Express, and PostgreSQL.',
      'Exploring TypeScript backend APIs, clean UI architecture, and open-source web apps.'
    ],
    projects: [
      {
        title: 'HostelMess Poll & Menu Portal',
        desc: 'Weekly student meal rating and menu suggestion dashboard with role-based hostel committee moderation.',
        tech: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
        cat: 'Web App'
      },
      {
        title: 'CampusBook Exchange Platform',
        desc: 'Peer-to-peer textbook and lab manual swap marketplace exclusively for college mail accounts.',
        tech: ['Next.js', 'PostgreSQL', 'Prisma'],
        cat: 'Web App'
      },
      {
        title: 'Placement Prep Tracker',
        desc: 'Company-wise DSA sheet progress tracker and mock test analytics dashboard for 3rd-year peers.',
        tech: ['TypeScript', 'React', 'Firebase'],
        cat: 'Web App'
      }
    ],
    certs: [
      { name: 'Meta Front-End Developer Certificate', issuer: 'Coursera' },
      { name: 'Full Stack Web Development', issuer: 'Udemy / Angela Yu' }
    ]
  },
  cs_java: {
    skills: [
      { name: 'Java', category: 'Languages' },
      { name: 'Spring Boot', category: 'Frameworks' },
      { name: 'Data Structures & Algorithms', category: 'Core CS' },
      { name: 'MySQL', category: 'Cloud & DevOps' },
      { name: 'Docker', category: 'Cloud & DevOps' }
    ],
    bios: [
      'Java & Spring Boot enthusiast focused on clean REST APIs, DBMS internals, and DSA problem solving.',
      'Solving daily graph and DP problems in Java while building scalable backend microservices.'
    ],
    projects: [
      {
        title: 'Campus Library Seat & Book API',
        desc: 'Spring Boot service handling concurrent book reservations, overdue alerts, and QR issue logs.',
        tech: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
        cat: 'Systems / Cloud'
      },
      {
        title: 'Exam Timetable Conflict Solver',
        desc: 'Graph-coloring scheduler in Java to generate clash-free elective exam schedules across branches.',
        tech: ['Java', 'Graph Algorithms', 'REST'],
        cat: 'Systems / Cloud'
      }
    ],
    certs: [
      { name: 'Programming in Java (Elite + Silver)', issuer: 'NPTEL / IIT Kharagpur' },
      { name: 'Oracle Certified Foundations Associate', issuer: 'Oracle' }
    ]
  },
  ai: {
    skills: [
      { name: 'Python', category: 'Languages' },
      { name: 'PyTorch', category: 'AI & ML' },
      { name: 'Scikit-Learn', category: 'AI & ML' },
      { name: 'OpenCV', category: 'AI & ML' },
      { name: 'FastAPI', category: 'Frameworks' }
    ],
    bios: [
      'AI & ML undergrad experimenting with computer vision, RAG pipelines, and lightweight edge inference.',
      'Passionate about applied machine learning, Kaggle competitions, and interpretable neural nets.'
    ],
    projects: [
      {
        title: 'CropLeaf Disease Classifier',
        desc: 'MobileNetV3 vision classifier identifying 14 common MP crop leaf diseases with offline ONNX inference.',
        tech: ['Python', 'PyTorch', 'ONNX', 'FastAPI'],
        cat: 'AI / ML'
      },
      {
        title: 'SyllabusQA PDF Study Assistant',
        desc: 'Local document chunking and semantic search helper for quickly navigating university past papers.',
        tech: ['Python', 'FAISS', 'Hugging Face', 'React'],
        cat: 'AI / ML'
      }
    ],
    certs: [
      { name: 'Machine Learning Specialization', issuer: 'DeepLearning.AI' },
      { name: 'Introduction to Machine Learning', issuer: 'NPTEL / IIT Madras' }
    ]
  },
  it_mobile: {
    skills: [
      { name: 'Flutter & Dart', category: 'Frameworks' },
      { name: 'Kotlin', category: 'Languages' },
      { name: 'Firebase', category: 'Cloud & DevOps' },
      { name: 'UI / UX Design (Figma)', category: 'Design & Soft Skills' },
      { name: 'Git & GitHub', category: 'Cloud & DevOps' }
    ],
    bios: [
      'Cross-platform mobile developer shipping smooth Android & Flutter apps for student communities.',
      'Focused on mobile ergonomics, offline-first local storage, and clean product design.'
    ],
    projects: [
      {
        title: 'MediBus Live Route Companion',
        desc: 'Flutter app displaying college bus stop timings, morning pickup reminders, and route updates.',
        tech: ['Flutter', 'Dart', 'Firebase'],
        cat: 'Mobile App'
      },
      {
        title: 'ClubEvents QR Check-In App',
        desc: 'Android scanner app built for tech fest coordinators to verify student registrations offline.',
        tech: ['Kotlin', 'Room DB', 'Material 3'],
        cat: 'Mobile App'
      }
    ],
    certs: [
      { name: 'Android Basics with Compose', issuer: 'Google Developers' },
      { name: 'Google UX Design Foundations', issuer: 'Coursera' }
    ]
  },
  ds: {
    skills: [
      { name: 'Python', category: 'Languages' },
      { name: 'SQL & PostgreSQL', category: 'Cloud & DevOps' },
      { name: 'Power BI & Tableau', category: 'Design & Soft Skills' },
      { name: 'Pandas & NumPy', category: 'AI & ML' },
      { name: 'Statistical Modeling', category: 'Core CS' }
    ],
    bios: [
      'Data Science undergrad turning messy real-world datasets into clear dashboards and predictive models.',
      'Interested in financial analytics, SQL optimization, and reproducible Jupyter notebooks.'
    ],
    projects: [
      {
        title: 'Indore AQI & Traffic Trend Explorer',
        desc: 'Time-series exploratory analysis comparing seasonal air quality and junction congestion across Indore.',
        tech: ['Python', 'Pandas', 'Plotly', 'SQL'],
        cat: 'AI / ML'
      },
      {
        title: 'Campus Placement Trend Analyzer',
        desc: 'Interactive dashboard summarizing branch-wise package distributions and required skill frequencies.',
        tech: ['Power BI', 'Python', 'PostgreSQL'],
        cat: 'Web App'
      }
    ],
    certs: [
      { name: 'Google Data Analytics Certificate', issuer: 'Google / Coursera' },
      { name: 'Data Science for Engineers', issuer: 'NPTEL / IIT Madras' }
    ]
  },
  ec: {
    skills: [
      { name: 'Embedded C / C++', category: 'Languages' },
      { name: 'ESP32 & Arduino', category: 'Core CS' },
      { name: 'Verilog HDL', category: 'Core CS' },
      { name: 'MATLAB', category: 'Frameworks' },
      { name: 'KiCad PCB', category: 'Design & Soft Skills' }
    ],
    bios: [
      'ECE student exploring embedded IoT firmware, sensor telemetry, and FPGA digital design.',
      'Working on low-power microcontroller nodes and Verilog hardware synthesis projects.'
    ],
    projects: [
      {
        title: 'Smart Lab Energy Monitor (ESP32)',
        desc: 'Current-sensor node streaming lab AC & lighting power draw via MQTT to a live web dashboard.',
        tech: ['ESP32', 'Embedded C', 'MQTT', 'React'],
        cat: 'Hardware / IoT'
      },
      {
        title: 'RISC-V 5-Stage Pipeline Core',
        desc: 'Simulated 32-bit RV32I processor in Verilog with hazard forwarding unit and testbench waveforms.',
        tech: ['Verilog', 'GTKWave', 'Digital Logic'],
        cat: 'Hardware / IoT'
      }
    ],
    certs: [
      { name: 'Embedded Systems Design', issuer: 'NPTEL / IIT Delhi' },
      { name: 'VLSI Physical Design Basics', issuer: 'Maven Silicon' }
    ]
  },
  me: {
    skills: [
      { name: 'SolidWorks CAD', category: 'Design & Soft Skills' },
      { name: 'AutoCAD', category: 'Design & Soft Skills' },
      { name: 'ANSYS FEA', category: 'Frameworks' },
      { name: 'Python', category: 'Languages' },
      { name: 'Manufacturing Processes', category: 'Core CS' }
    ],
    bios: [
      'Mechanical engineering undergrad passionate about CAD modeling, EV chassis design, and FEA simulation.',
      'Active member of the campus SAE Baja / Robotics fabrication team.'
    ],
    projects: [
      {
        title: 'SAE Baja Tubular Roll Cage Analysis',
        desc: 'Structural impact & torsional rigidity finite-element analysis in ANSYS with 14% weight reduction.',
        tech: ['SolidWorks', 'ANSYS', 'CAD'],
        cat: 'Hardware / IoT'
      },
      {
        title: '3-DOF Robotic Arm Kinematics',
        desc: '3D-printed desktop manipulator with inverse kinematics controller in Python and Arduino.',
        tech: ['SolidWorks', 'Arduino', 'Python'],
        cat: 'Hardware / IoT'
      }
    ],
    certs: [
      { name: 'Certified SolidWorks Associate (CSWA)', issuer: 'Dassault Systèmes' },
      { name: 'Fundamentals of Fluid Mechanics', issuer: 'NPTEL' }
    ]
  },
  ce: {
    skills: [
      { name: 'AutoCAD Civil', category: 'Design & Soft Skills' },
      { name: 'STAAD.Pro', category: 'Frameworks' },
      { name: 'Revit BIM', category: 'Design & Soft Skills' },
      { name: 'Surveying & GIS', category: 'Core CS' },
      { name: 'Concrete Mix Design', category: 'Core CS' }
    ],
    bios: [
      'Civil Engineering student working on sustainable concrete mixes, BIM workflows, and structural analysis.',
      'Interested in urban drainage planning, smart city infrastructure, and GIS mapping.'
    ],
    projects: [
      {
        title: 'G+4 Academic Block Seismic Frame Design',
        desc: 'IS 1893 compliant seismic load modeling and reinforcement detailing using STAAD.Pro & AutoCAD.',
        tech: ['STAAD.Pro', 'AutoCAD', 'IS 456'],
        cat: 'Hardware / IoT'
      },
      {
        title: 'Campus Rainwater Harvesting GIS Map',
        desc: 'Roof-catchment runoff estimation and recharge pit layout modeled in QGIS for Rau campus.',
        tech: ['QGIS', 'AutoCAD', 'Excel'],
        cat: 'Systems / Cloud'
      }
    ],
    certs: [
      { name: 'Autodesk Certified User: AutoCAD', issuer: 'Autodesk' },
      { name: 'Design of Reinforced Concrete Structures', issuer: 'NPTEL / IIT Kharagpur' }
    ]
  },
  ee: {
    skills: [
      { name: 'MATLAB & Simulink', category: 'Frameworks' },
      { name: 'Power Electronics', category: 'Core CS' },
      { name: 'PLC & SCADA', category: 'Core CS' },
      { name: 'Embedded C', category: 'Languages' },
      { name: 'ETAP', category: 'Frameworks' }
    ],
    bios: [
      'Electrical Engineering student focused on EV battery management, solar microgrids, and PLC automation.',
      'Simulating power converters and protection relays using MATLAB Simulink and ETAP.'
    ],
    projects: [
      {
        title: 'MPPT Solar Charge Controller Sim',
        desc: 'Perturb & Observe MPPT DC-DC boost converter modeled in Simulink under variable irradiance.',
        tech: ['MATLAB', 'Simulink', 'Power Electronics'],
        cat: 'Hardware / IoT'
      },
      {
        title: 'EV Cell Balancing Telemetry Prototype',
        desc: '4S Li-ion voltage & thermal monitoring rig with automatic cutoff protection relay.',
        tech: ['Arduino', 'Embedded C', 'Proteus'],
        cat: 'Hardware / IoT'
      }
    ],
    certs: [
      { name: 'Electric Vehicles & Mobility', issuer: 'NPTEL / IIT Madras' },
      { name: 'Industrial Automation with PLC', issuer: 'Siemens COE' }
    ]
  }
};

const REGIONAL_COMPANIES = [
  { org: 'InfoBeans Technologies', loc: 'Indore, MP', roles: ['Web Developer Intern', 'QA Automation Intern', 'Software Trainee'] },
  { org: 'Yash Technologies', loc: 'Indore, MP', roles: ['Java Backend Intern', 'Cloud Support Intern', 'Data Analyst Intern'] },
  { org: 'Impetus Technologies', loc: 'Indore, MP', roles: ['Data Engineering Intern', 'Python Dev Intern'] },
  { org: 'Persistent Systems', loc: 'Pune / Remote', roles: ['Martian Summer Intern', 'Software Intern'] },
  { org: 'Diaspark Inc.', loc: 'Indore, MP', roles: ['Full-Stack Intern', 'React Native Intern'] },
  { org: 'Technorizen Software', loc: 'Indore, MP', roles: ['Frontend Developer Intern', 'Flutter App Intern'] },
  { org: 'Bharat Heavy Electricals (BHEL)', loc: 'Bhopal, MP', roles: ['Industrial Vocational Trainee', 'Power Systems Intern'] },
  { org: 'L&T Construction', loc: 'Indore Metro Site', roles: ['Site Structural Trainee', 'BIM Modeling Intern'] },
  { org: 'Eicher Motors (VECV)', loc: 'Pithampur, MP', roles: ['CAD & Manufacturing Intern', 'Quality Engineering Trainee'] }
];

// Deterministic PRNG so data stays consistent across builds while remaining varied
function seededFloat(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function generateAdditionalStudents(): RawStudent[] {
  const years: { year: AcademicYear; prefix: string; sems: [number, number] }[] = [
    { year: '1st Year', prefix: 'en25', sems: [1, 2] },
    { year: '2nd Year', prefix: 'en24', sems: [3, 4] },
    { year: '3rd Year', prefix: 'en23', sems: [5, 6] },
    { year: '4th Year', prefix: 'en22', sems: [7, 8] }
  ];

  return STUDENT_IDENTITIES.map((person, idx) => {
    const num = idx + 7; // student-7 .. student-100
    const r1 = seededFloat(num * 3 + 1);
    const r2 = seededFloat(num * 7 + 5);
    const r3 = seededFloat(num * 11 + 9);
    const r4 = seededFloat(num * 13 + 3);

    // Pick branch with realistic college distribution (more CS/AI/IT, solid representation of EC/DS/ME/CE/EE)
    const branchWeights = [0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7];
    const branchSpec = BRANCH_SPECS[branchWeights[idx % branchWeights.length]];
    const yearInfo = years[idx % years.length];
    const semester = r1 > 0.5 ? yearInfo.sems[1] : yearInfo.sems[0];
    const course = branchSpec.courses[Math.floor(r2 * branchSpec.courses.length)];

    // Valid enrollment: en[2 digits][branch code][6 digits]@medicaps.ac.in
    const serial = (301100 + idx * 17 + Math.floor(r3 * 9)).toString();
    const email = `${yearInfo.prefix}${branchSpec.code}${serial}@medicaps.ac.in`;
    const rollNumber = `${yearInfo.prefix}${branchSpec.code}${serial}`.toUpperCase();

    // CGPA spread naturally between 6.38 and 9.74
    const cgpaRaw = 6.38 + r1 * 2.45 + (yearInfo.year === '4th Year' ? 0.35 : 0) + (r2 > 0.72 ? 0.55 : 0);
    const cgpa = Number(Math.min(9.76, Math.max(6.35, cgpaRaw)).toFixed(2));

    // Pick track matching branch
    let trackKey = 'cs_web';
    if (branchSpec.code === 'cs') {
      trackKey = r3 > 0.5 ? 'cs_web' : 'cs_java';
    } else if (branchSpec.code === 'ai') {
      trackKey = 'ai';
    } else if (branchSpec.code === 'it') {
      trackKey = r3 > 0.45 ? 'it_mobile' : 'cs_web';
    } else if (branchSpec.code === 'ds') {
      trackKey = 'ds';
    } else if (branchSpec.code === 'ec') {
      trackKey = 'ec';
    } else if (branchSpec.code === 'me') {
      trackKey = 'me';
    } else if (branchSpec.code === 'ce') {
      trackKey = 'ce';
    } else if (branchSpec.code === 'ee') {
      trackKey = 'ee';
    }

    const track = TRACKS[trackKey];
    const palette = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
    const slug = person.name.toLowerCase().replace(/[^a-z]+/g, '-');

    // Skills (3 to 5 skills with varied endorsement counts)
    const skillCount = 3 + (idx % 3);
    const skills: SkillItem[] = track.skills.slice(0, skillCount).map((sk, sIdx) => ({
      id: `sk-gen-${num}-${sIdx}`,
      name: sk.name,
      category: sk.category,
      endorsements: Math.max(1, Math.floor(r2 * 18) + (4 - sIdx) * 2)
    }));

    // Projects (0 to 3 depending on year & variance)
    const maxProj = yearInfo.year === '1st Year' ? (r1 > 0.4 ? 1 : 0) : yearInfo.year === '2nd Year' ? 2 : 3;
    const projCount = Math.min(track.projects.length, Math.floor(r3 * (maxProj + 0.99)));
    const projects: Project[] = track.projects.slice(0, projCount).map((p, pIdx) => ({
      id: `proj-gen-${num}-${pIdx}`,
      studentId: `student-${num}`,
      title: p.title,
      description: p.desc,
      technologies: p.tech,
      githubUrl: `https://github.com/${slug}/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 22)}`,
      category: p.cat,
      starsCount: Math.floor(r4 * 34) + 2
    }));

    // Internships (realistic: 1st year mostly 0; 2nd year rare; 3rd/4th year 0-2)
    const internships: Internship[] = [];
    const internEligible =
      yearInfo.year === '4th Year' ? r1 > 0.32 :
      yearInfo.year === '3rd Year' ? r1 > 0.55 :
      yearInfo.year === '2nd Year' ? r1 > 0.84 : false;

    if (internEligible) {
      const compPool =
        branchSpec.code === 'me' ? REGIONAL_COMPANIES[8] :
        branchSpec.code === 'ce' ? REGIONAL_COMPANIES[7] :
        branchSpec.code === 'ee' ? REGIONAL_COMPANIES[6] :
        REGIONAL_COMPANIES[idx % 6];
      const role = compPool.roles[idx % compPool.roles.length];
      internships.push({
        id: `intern-gen-${num}-1`,
        studentId: `student-${num}`,
        organization: compPool.org,
        role,
        startDate: yearInfo.year === '4th Year' ? 'May 2025' : 'May 2026',
        endDate: yearInfo.year === '4th Year' ? 'July 2025' : 'July 2026',
        location: compPool.loc,
        description: `Worked on production workflows, testing, and documentation alongside senior engineers at ${compPool.org}.`
      });
      if (yearInfo.year === '4th Year' && r4 > 0.72) {
        const comp2 = REGIONAL_COMPANIES[(idx + 2) % 6];
        internships.push({
          id: `intern-gen-${num}-2`,
          studentId: `student-${num}`,
          organization: comp2.org,
          role: comp2.roles[0],
          startDate: 'Jan 2026',
          endDate: 'Apr 2026',
          location: comp2.loc,
          description: `Contributed to sprint deliverables, API integrations, and peer code reviews.`
        });
      }
    }

    // Certifications (0 to 2)
    const certCount = r2 > 0.75 ? 2 : r2 > 0.35 ? 1 : 0;
    const certifications: Certification[] = track.certs.slice(0, certCount).map((c, cIdx) => ({
      id: `cert-gen-${num}-${cIdx}`,
      studentId: `student-${num}`,
      name: c.name,
      issuer: c.issuer,
      issueDate: yearInfo.year === '1st Year' ? 'Jan 2026' : 'Aug 2025'
    }));

    // External coding profiles
    const externalProfiles: ExternalProfiles = {
      github: `https://github.com/${slug}`,
      linkedin: `https://linkedin.com/in/${slug}-medicaps`
    };
    if (['cs', 'ai', 'it', 'ds'].includes(branchSpec.code) && r3 > 0.25) {
      externalProfiles.leetcode = `https://leetcode.com/u/${slug.replace(/-/g, '_')}`;
    }
    if (r4 > 0.68 && ['cs', 'ai', 'it'].includes(branchSpec.code)) {
      externalProfiles.codeforces = `https://codeforces.com/profile/${slug.replace(/-/g, '')}`;
    }

    // Achievements
    const achievements: string[] = [];
    if (cgpa >= 9.0) achievements.push(`Top 10% Academic Standing (${cgpa.toFixed(2)} CGPA)`);
    if (projects.length >= 2) achievements.push('Built & demoed multi-module campus engineering project');
    if (r4 > 0.6) achievements.push('Participant — Medi-Caps Annual TechFest');

    // Badges
    const badges: Badge[] = [];
    if (cgpa >= 9.2) badges.push(BADGES_POOL[0]);
    if (projects.length >= 3) badges.push(BADGES_POOL[2]);
    if (r4 > 0.65) badges.push(BADGES_POOL[3]);
    if (badges.length === 0) badges.push(BADGES_POOL[5]);

    const bio = `${yearInfo.year} ${course} (${branchSpec.branch}) student at Medi-Caps University. ${track.bios[idx % track.bios.length]}`;

    return {
      id: `student-${num}`,
      name: person.name,
      email,
      rollNumber,
      gender: person.gender,
      profilePhoto: createSvgAvatar(person.name, palette[0], palette[1]),
      course,
      branch: branchSpec.branch,
      year: yearInfo.year,
      semester,
      cgpa,
      collegeName: 'Medi-Caps University',
      location: 'Indore, MP',
      bio,
      followersCount: Math.floor(r1 * 120) + (yearInfo.year === '4th Year' ? 40 : 12),
      followingCount: Math.floor(r2 * 85) + 10,
      status: 'active',
      isVerified: r3 > 0.2,
      createdAt: '2025-08-18T10:00:00Z',
      externalProfiles,
      skills,
      projects,
      internships,
      certifications,
      achievements,
      badges
    };
  });
}
