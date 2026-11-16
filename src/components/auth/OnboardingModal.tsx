import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Globe, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { StudentCourse, StudentBranch, AcademicYear } from '../../types';

const POPULAR_SKILLS = [
  'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go / Golang', 'Rust',
  'React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Docker', 'Kubernetes',
  'PyTorch', 'TensorFlow', 'Machine Learning', 'Data Science', 'SQL & PostgreSQL',
  'Cybersecurity', 'UI / UX (Figma)', 'Computer Vision', 'Distributed Systems'
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, currentUser, updateProfile, addProject, addInternship, addCertification, addToast } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Info
  const [name, setName] = useState(currentUser?.name || '');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '');
  const [course, setCourse] = useState<StudentCourse>(currentUser?.course || 'B.Tech');
  const [branch, setBranch] = useState<StudentBranch>(currentUser?.branch || 'Computer Science (CSE)');
  const [year, setYear] = useState<AcademicYear>(currentUser?.year || '3rd Year');
  const [semester, setSemester] = useState(currentUser?.semester || 6);
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Step 2: Academic
  const [cgpa, setCgpa] = useState(currentUser?.cgpa?.toString() || '9.1');
  const [achievements, setAchievements] = useState<string[]>(currentUser?.achievements || ['1st Place Hackathon 2025']);
  const [newAchievement, setNewAchievement] = useState('');

  // Step 3: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentUser?.skills.map(s => s.name) || ['Python', 'TypeScript', 'React']
  );
  const [customSkill, setCustomSkill] = useState('');

  // Step 4: Initial Project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectCategory, setProjectCategory] = useState<any>('Web App');

  // Step 5: Initial Internship
  const [internOrg, setInternOrg] = useState('');
  const [internRole, setInternRole] = useState('');
  const [internStart, setInternStart] = useState('');
  const [internEnd, setInternEnd] = useState('');
  const [internDesc, setInternDesc] = useState('');

  // Step 6: Initial Certification
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certLink, setCertLink] = useState('');

  // Step 7: External Profiles
  const [github, setGithub] = useState(currentUser?.externalProfiles.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.externalProfiles.linkedin || '');
  const [leetcode, setLeetcode] = useState(currentUser?.externalProfiles.leetcode || '');
  const [codeforces, setCodeforces] = useState(currentUser?.externalProfiles.codeforces || '');
  const [codechef, setCodechef] = useState(currentUser?.externalProfiles.codechef || '');
  const [gfg, setGfg] = useState(currentUser?.externalProfiles.geeksforgeeks || '');

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setRollNumber(currentUser.rollNumber || '');
      setCourse(currentUser.course || 'B.Tech');
      setBranch(currentUser.branch || 'Computer Science (CSE)');
      setYear(currentUser.year || '3rd Year');
      setSemester(currentUser.semester || 6);
      setBio(currentUser.bio || '');
      setCgpa(currentUser.cgpa?.toString() || '9.1');
      setAchievements(currentUser.achievements || []);
      if (currentUser.skills && currentUser.skills.length > 0) {
        setSelectedSkills(currentUser.skills.map(s => s.name));
      }
      setGithub(currentUser.externalProfiles.github || '');
      setLinkedin(currentUser.externalProfiles.linkedin || '');
      setLeetcode(currentUser.externalProfiles.leetcode || '');
      setCodeforces(currentUser.externalProfiles.codeforces || '');
      setCodechef(currentUser.externalProfiles.codechef || '');
      setGfg(currentUser.externalProfiles.geeksforgeeks || '');
    }
  }, [currentUser, showOnboarding]);

  if (!showOnboarding) return null;

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleComplete = () => {
    // 1. Update basic info & external links
    const parsedCgpa = parseFloat(cgpa) || 8.5;
    
    // Map selected skills to SkillItem format
    const formattedSkills = selectedSkills.map((skName, i) => {
      const existing = currentUser?.skills.find(s => s.name === skName);
      return existing || {
        id: 'sk-new-' + i,
        name: skName,
        category: 'Frameworks' as const,
        endorsements: 0
      };
    });

    updateProfile({
      name,
      rollNumber,
      course,
      branch,
      year,
      semester: Number(semester),
      cgpa: Math.min(10, Math.max(0, parsedCgpa)),
      bio,
      achievements,
      skills: formattedSkills,
      externalProfiles: {
        github: github || undefined,
        linkedin: linkedin || undefined,
        leetcode: leetcode || undefined,
        codeforces: codeforces || undefined,
        codechef: codechef || undefined,
        geeksforgeeks: gfg || undefined
      }
    });

    // 2. Add Project if filled
    if (projectTitle.trim() && projectDesc.trim()) {
      addProject({
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        technologies: projectTech.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: projectGithub.trim() || undefined,
        demoUrl: projectDemo.trim() || undefined,
        category: projectCategory
      });
    }

    // 3. Add Internship if filled
    if (internOrg.trim() && internRole.trim()) {
      addInternship({
        organization: internOrg.trim(),
        role: internRole.trim(),
        startDate: internStart || '2025',
        endDate: internEnd || 'Present',
        description: internDesc.trim() || 'Software engineering experience.'
      });
    }

    // 4. Add Certification if filled
    if (certName.trim() && certIssuer.trim()) {
      addCertification({
        name: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: certDate || '2025',
        credentialUrl: certLink.trim() || undefined
      });
    }

    setShowOnboarding(false);
    addToast('🎉 MediConnect Student Profile successfully configured!', 'success');
  };

  const stepTitles = [
    { step: 1, title: 'Basic Information', icon: User },
    { step: 2, title: 'Academic Metrics', icon: GraduationCap },
    { step: 3, title: 'Verified Skills', icon: Code },
    { step: 4, title: 'Featured Project', icon: FolderGit2 },
    { step: 5, title: 'Internship Experience', icon: Briefcase },
    { step: 6, title: 'Certifications', icon: Award },
    { step: 7, title: 'Coding & Social Profiles', icon: Globe },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Student Profile Setup</div>
              <div className="text-xs text-slate-400">Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1].title}</div>
            </div>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#141923] h-1.5">
          <div 
            className="bg-gradient-to-r from-sky-500 to-teal-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Confirm your student identity. In production this is pre-verified against university enrollment records.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. Aarav Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">University Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                    placeholder="e.g. 0827CS221045"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Course</label>
                  <select
                    value={course}
                    onChange={e => setCourse(e.target.value as StudentCourse)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Specialization</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value as StudentBranch)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
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
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value as AcademicYear)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                  placeholder="Tell campus peers about your technical focus, projects, and what you're currently building..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC INFO */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Your CGPA contributes <span className="text-sky-400 font-semibold">40%</span> toward the campus leaderboard ranking.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cumulative GPA (out of 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={e => setCgpa(e.target.value)}
                  className="w-full sm:w-1/2 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-base font-mono text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g. 9.15"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic & Technical Honors</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={e => setNewAchievement(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddAchievement()}
                    placeholder="e.g. Smart India Hackathon Finalist, Dean's Honor List"
                    className="flex-1 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-3 py-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold hover:bg-sky-500/30"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#141923] border border-[#1E293B] text-xs">
                      <span className="text-slate-200">🏆 {ach}</span>
                      <button onClick={() => handleRemoveAchievement(idx)} className="text-slate-500 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Tag your primary technical skills. Peers can endorse skills on your profile!
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Quick Select Popular Skills</label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950 font-semibold shadow-md shadow-sky-500/20'
                            : 'bg-[#141923] text-slate-300 border border-[#1E293B] hover:border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Add Custom Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCustomSkill()}
                    placeholder="e.g. Solidity, GraphQL, ROS2"
                    className="flex-1 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-2 bg-[#141923] text-slate-200 border border-[#1E293B] rounded-xl text-xs font-medium hover:border-sky-500/40"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROJECTS */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Projects account for <span className="text-teal-400 font-semibold">20%</span> of your leaderboard score. Add your first showcase project!
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. Campus Peer Learning Network"
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={projectDesc}
                  onChange={e => setProjectDesc(e.target.value)}
                  rows={2}
                  placeholder="Briefly describe what problem this solves and architecture used..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={projectTech}
                    onChange={e => setProjectTech(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={projectCategory}
                    onChange={e => setProjectCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Web App">Web App</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Systems / Cloud">Systems / Cloud</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Hardware / IoT">Hardware / IoT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Link (optional)</label>
                  <input
                    type="url"
                    value={projectGithub}
                    onChange={e => setProjectGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    value={projectDemo}
                    onChange={e => setProjectDemo(e.target.value)}
                    placeholder="https://myproject.app"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INTERNSHIPS */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Internships account for <span className="text-teal-400 font-semibold">20%</span> of your leaderboard score. Skip if you haven't interned yet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={internOrg}
                    onChange={e => setInternOrg(e.target.value)}
                    placeholder="e.g. Razorpay, Microsoft, Startup"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={internRole}
                    onChange={e => setInternRole(e.target.value)}
                    placeholder="e.g. Software Engineering Intern"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={internStart}
                    onChange={e => setInternStart(e.target.value)}
                    placeholder="e.g. June 2025"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="text"
                    value={internEnd}
                    onChange={e => setInternEnd(e.target.value)}
                    placeholder="e.g. August 2025 or Present"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description of Work</label>
                <textarea
                  value={internDesc}
                  onChange={e => setInternDesc(e.target.value)}
                  rows={2}
                  placeholder="Key contributions, technologies, impact..."
                  className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: CERTIFICATIONS */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Certifications boost your Skills & Certifications score. (Skip if not applicable).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={certName}
                    onChange={e => setCertName(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect Associate"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={e => setCertIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services, Google, Coursera"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={certDate}
                    onChange={e => setCertDate(e.target.value)}
                    placeholder="e.g. Jan 2025"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credential URL (optional)</label>
                  <input
                    type="url"
                    value={certLink}
                    onChange={e => setCertLink(e.target.value)}
                    placeholder="https://credly.com/..."
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: EXTERNAL PROFILES */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Competitive programming handles (LeetCode, Codeforces, CodeChef) contribute <span className="text-sky-400 font-semibold">10%</span> toward your leaderboard score!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LeetCode Profile</label>
                  <input
                    type="url"
                    value={leetcode}
                    onChange={e => setLeetcode(e.target.value)}
                    placeholder="https://leetcode.com/u/username"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Codeforces Profile</label>
                  <input
                    type="url"
                    value={codeforces}
                    onChange={e => setCodeforces(e.target.value)}
                    placeholder="https://codeforces.com/profile/username"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CodeChef Profile</label>
                  <input
                    type="url"
                    value={codechef}
                    onChange={e => setCodechef(e.target.value)}
                    placeholder="https://codechef.com/users/username"
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GeeksforGeeks Profile</label>
                  <input
                    type="url"
                    value={gfg}
                    onChange={e => setGfg(e.target.value)}
                    placeholder="https://auth.geeksforgeeks.org/user/..."
                    className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentStep === 1 
                ? 'opacity-40 cursor-not-allowed text-slate-500' 
                : 'text-slate-300 hover:text-white hover:bg-[#141923]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnboarding(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <span>{currentStep === totalSteps ? 'Save & Finish' : 'Continue'}</span>
              {currentStep === totalSteps ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
