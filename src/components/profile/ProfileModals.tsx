import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, FolderGit2, Briefcase, Award, Sparkles, Trash2, Upload, FileText } from 'lucide-react';
import { StudentCourse, StudentBranch, AcademicYear } from '../../types';

// ======================== EDIT PROFILE MODAL ========================
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, addToast } = useApp();
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [cgpa, setCgpa] = useState(currentUser.cgpa.toString());
  const [location, setLocation] = useState(currentUser.location || 'Indore, MP');
  const [course, setCourse] = useState<StudentCourse>(currentUser.course);
  const [branch, setBranch] = useState<StudentBranch>(currentUser.branch);
  const [year, setYear] = useState<AcademicYear>(currentUser.year);
  const [semester, setSemester] = useState(currentUser.semester);
  
  // External Profiles
  const [github, setGithub] = useState(currentUser.externalProfiles.github || '');
  const [linkedin, setLinkedin] = useState(currentUser.externalProfiles.linkedin || '');
  const [leetcode, setLeetcode] = useState(currentUser.externalProfiles.leetcode || '');
  const [codeforces, setCodeforces] = useState(currentUser.externalProfiles.codeforces || '');
  const [codechef, setCodechef] = useState(currentUser.externalProfiles.codechef || '');
  const [gfg, setGfg] = useState(currentUser.externalProfiles.geeksforgeeks || '');

  // Achievements
  const [achievements, setAchievements] = useState<string[]>(currentUser.achievements || []);
  const [newAch, setNewAch] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCgpa = parseFloat(cgpa) || currentUser.cgpa;

    updateProfile({
      name,
      bio,
      cgpa: Math.min(10, Math.max(0, parsedCgpa)),
      location,
      course,
      branch,
      year,
      semester: Number(semester),
      achievements,
      externalProfiles: {
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        leetcode: leetcode.trim() || undefined,
        codeforces: codeforces.trim() || undefined,
        codechef: codechef.trim() || undefined,
        geeksforgeeks: gfg.trim() || undefined,
      }
    });

    onClose();
  };

  const addAchievement = () => {
    if (newAch.trim()) {
      setAchievements([...achievements, newAch.trim()]);
      setNewAch('');
    }
  };

  const removeAchievement = (idx: number) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold text-white">Edit Student Profile</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Campus City</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Year & Sem</label>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">CGPA (40% Leaderboard Weight)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={cgpa}
              onChange={e => setCgpa(e.target.value)}
              className="w-full sm:w-1/3 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Student Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          {/* External Profiles */}
          <div className="pt-2 border-t border-[#1E293B]">
            <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">Connected Coding Profiles</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">GitHub URL</label>
                <input
                  type="url"
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">LeetCode URL</label>
                <input
                  type="url"
                  value={leetcode}
                  onChange={e => setLeetcode(e.target.value)}
                  placeholder="https://leetcode.com/u/..."
                  className="w-full px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-0.5">Codeforces URL</label>
                <input
                  type="url"
                  value={codeforces}
                  onChange={e => setCodeforces(e.target.value)}
                  placeholder="https://codeforces.com/profile/..."
                  className="w-full px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="pt-2 border-t border-[#1E293B]">
            <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Verified Achievements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAch}
                onChange={e => setNewAch(e.target.value)}
                placeholder="Add competition or hackathon placement..."
                className="flex-1 px-3 py-1.5 bg-[#141923] border border-[#1E293B] rounded-lg text-xs text-white"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="px-3 py-1.5 bg-[#141923] border border-[#1E293B] hover:border-teal-500/40 text-xs font-medium text-teal-300 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="space-y-1">
              {achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#141923] text-xs">
                  <span className="text-slate-300 truncate">🏆 {ach}</span>
                  <button type="button" onClick={() => removeAchievement(idx)} className="text-slate-500 hover:text-red-400 ml-2">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================== ADD PROJECT MODAL ========================
interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useApp();
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<any>('Web App');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addProject({
      title: title.trim(),
      description: description.trim(),
      technologies: tech.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      image: image.trim() || undefined,
      category,
      starsCount: 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-bold text-white">Add Showcase Project</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Queue"
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="What does it do? What architectural decisions did you make?"
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                required
                value={tech}
                onChange={e => setTech(e.target.value)}
                placeholder="Go, Redis, Docker, gRPC"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Web App">Web App</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Systems / Cloud">Systems / Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Open Source">Open Source</option>
                <option value="Hardware / IoT">Hardware / IoT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repository Link</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo / Deployed Link</label>
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://myproject.app"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================== ADD INTERNSHIP MODAL ========================
interface AddInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddInternshipModal: React.FC<AddInternshipModalProps> = ({ isOpen, onClose }) => {
  const { addInternship } = useApp();
  if (!isOpen) return null;

  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization.trim() || !role.trim()) return;

    addInternship({
      organization: organization.trim(),
      role: role.trim(),
      startDate: startDate.trim() || '2025',
      endDate: endDate.trim() || 'Present',
      location: location.trim() || undefined,
      description: description.trim(),
      certificateUrl: certificateUrl.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold text-white">Add Internship Experience</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="e.g. Razorpay, Google, Startup"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Backend Intern"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="text"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                placeholder="May 2025"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="text"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                placeholder="Aug 2025 or Present"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Remote / Bengaluru"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Responsibilities & Impact</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="What did you build? What systems did you touch?"
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20"
            >
              Save Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================== ADD CERTIFICATION MODAL ========================
interface AddCertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCertificationModal: React.FC<AddCertModalProps> = ({ isOpen, onClose }) => {
  const { addCertification, addToast } = useApp();

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Please upload a PDF, PNG, JPG, or WebP certificate file.', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      addToast('Certificate file size must be under 3 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileDataUrl(reader.result);
        setFileName(file.name);
        setFileType(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) return;

    addCertification({
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim() || '2025',
      credentialUrl: credentialUrl.trim() || undefined,
      fileDataUrl: fileDataUrl || undefined,
      fileName: fileName || undefined,
      fileType: fileType || undefined
    });

    setName('');
    setIssuer('');
    setIssueDate('');
    setCredentialUrl('');
    setFileDataUrl('');
    setFileName('');
    setFileType('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#1E293B] bg-[#0A0D15] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white">Add Professional Certification</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141923]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Certification Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. AWS Solutions Architect Associate"
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issuing Authority / Organization</label>
            <input
              type="text"
              required
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              placeholder="e.g. Amazon Web Services, Google, Coursera, NPTEL"
              className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
              <input
                type="text"
                required
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                placeholder="Jan 2025"
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Verification URL (optional)</label>
              <input
                type="url"
                value={credentialUrl}
                onChange={e => setCredentialUrl(e.target.value)}
                placeholder="https://credly.com/..."
                className="w-full px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Certificate File Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Certificate File (PDF or Image)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileDataUrl ? (
              <div className="p-3 rounded-xl bg-[#141923] border border-purple-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs text-slate-200 truncate">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFileDataUrl('');
                    setFileName('');
                    setFileType('');
                  }}
                  className="text-slate-400 hover:text-red-400 p-1"
                  title="Remove selected file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-[#141923] hover:bg-[#1A2230] border border-dashed border-[#334155] hover:border-purple-500/50 text-xs text-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Add Certificate File (PDF / PNG / JPG)</span>
              </button>
            )}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20"
            >
              Save Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
