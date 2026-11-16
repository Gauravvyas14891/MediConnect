import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  User,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { StudentCourse, StudentBranch, AcademicYear } from '../../types';
import { parseCollegeEmail } from '../../utils/collegeEmail';

interface LoginViewProps {
  initialMode?: 'login' | 'register';
  onBackToHome?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ initialMode = 'login', onBackToHome }) => {
  const { loginWithCredentials, registerStudent, addToast } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  // Sign In Form State (strictly college mail ID + password)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRollNumber, setRegRollNumber] = useState('');
  const [regGender, setRegGender] = useState<'male' | 'female' | 'other'>('male');
  const [regCourse] = useState<StudentCourse>('B.Tech');
  const [regBranch, setRegBranch] = useState<StudentBranch>('Computer Science (CSE)');
  const [regYear, setRegYear] = useState<AcademicYear>('3rd Year');
  const [regSemester, setRegSemester] = useState<number>(6);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const parsedLoginEmail = parseCollegeEmail(loginEmail);
  const parsedRegEmail = parseCollegeEmail(regEmail);

  const handleRegEmailChange = (val: string) => {
    setRegEmail(val);
    setRegError('');
    const parsed = parseCollegeEmail(val);
    if (parsed.enrollmentNumber) {
      setRegRollNumber(parsed.enrollmentNumber);
    } else if (val.includes('@')) {
      setRegRollNumber(val.split('@')[0].trim().toUpperCase());
    }
    if (parsed.detectedBranch) {
      setRegBranch(parsed.detectedBranch);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!parsedLoginEmail.isValid) {
      setLoginError(
        parsedLoginEmail.errorReason ||
          'Use college mail ID format: en<2 digits><branch code><6-7 digits>@medicaps.ac.in (e.g. en22cs301045@medicaps.ac.in)'
      );
      return;
    }

    const res = loginWithCredentials(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message || 'Authentication failed. Please check your college mail ID and password.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('Please provide your full name.');
      return;
    }

    if (!parsedRegEmail.isValid) {
      setRegError(
        parsedRegEmail.errorReason ||
          'College mail ID must follow en<2 digits><branch code e.g. cs, ce, me><6-7 digits>@medicaps.ac.in.'
      );
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please retype your password.');
      return;
    }

    const res = registerStudent({
      name: regName.trim(),
      email: parsedRegEmail.email,
      enrollmentNumber: parsedRegEmail.enrollmentNumber,
      gender: regGender,
      course: regCourse,
      branch: parsedRegEmail.detectedBranch || regBranch,
      year: regYear,
      semester: regSemester,
      password: regPassword
    });

    if (!res.success) {
      setRegError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-col justify-between px-6 py-10 lg:px-24">
      {/* Top Minimal Header */}
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
        {onBackToHome ? (
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252] hover:text-[#000000] transition-colors duration-500 ease-editorial cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Showcase</span>
          </button>
        ) : (
          <div className="text-[24px] font-bold tracking-tighter lowercase">mc.</div>
        )}

        <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252]">
          Medi-Caps University · Portal Access
        </div>
      </div>

      {/* Main Centered Auth Block */}
      <div className="w-full max-w-lg mx-auto my-10">
        <div className="mb-8">
          <div className="font-mono text-[14px] uppercase tracking-[0.1em] text-[#525252] mb-2">
            @medicaps.ac.in Verification
          </div>
          <h1 className="text-[40px] sm:text-[48px] font-bold tracking-[-0.05em] leading-[0.95] text-[#000000]">
            {authMode === 'login' ? 'student sign in.' : 'create profile.'}
          </h1>
          <p className="text-[16px] text-[#525252] mt-3 tracking-[-0.02em]">
            Access verified campus portfolios, formulaic rankings, and peer engineering communities.
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="grid grid-cols-2 border border-black/10 rounded-xl p-1 bg-[#FAFAFA] mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setLoginError('');
            }}
            className={`py-2.5 font-mono text-[13px] uppercase tracking-[0.08em] rounded-lg transition-all duration-500 ease-editorial cursor-pointer ${
              authMode === 'login'
                ? 'bg-[#000000] text-[#FFFFFF]'
                : 'text-[#525252] hover:text-[#000000]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setRegError('');
            }}
            className={`py-2.5 font-mono text-[13px] uppercase tracking-[0.08em] rounded-lg transition-all duration-500 ease-editorial cursor-pointer ${
              authMode === 'register'
                ? 'bg-[#000000] text-[#FFFFFF]'
                : 'text-[#525252] hover:text-[#000000]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl p-6 sm:p-8">
          {/* ================= MODE: LOGIN ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/20 text-[13px] text-[#000000] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[#525252] mb-2">
                  College Mail ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525252]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="en24cs3040061@medicaps.ac.in"
                    className="w-full pl-10 pr-9 py-3 bg-[#FFFFFF] border border-black/10 rounded-xl text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none focus:border-black transition-colors font-mono"
                  />
                  {parsedLoginEmail.isValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#000000]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {loginEmail && (
                  <p className={`text-[12px] mt-1.5 ${parsedLoginEmail.isValid ? 'text-[#000000]' : 'text-[#525252]'}`}>
                    {parsedLoginEmail.isValid
                      ? `Verified format · ${parsedLoginEmail.enrollmentNumber}${parsedLoginEmail.detectedBranch ? ` (${parsedLoginEmail.detectedBranch})` : ''}`
                      : parsedLoginEmail.errorReason}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#525252]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      addToast(
                        'Sign in using your registered @medicaps.ac.in college mail ID and password, or register a new student account.',
                        'info'
                      )
                    }
                    className="text-[12px] text-[#525252] hover:text-[#000000] underline cursor-pointer"
                  >
                    Need help?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525252]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={loginPassword}
                    onChange={e => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 bg-[#FFFFFF] border border-black/10 rounded-xl text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none focus:border-black transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#525252] hover:text-[#000000] cursor-pointer"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] font-mono text-[13px] uppercase tracking-[0.1em] rounded-full flex items-center justify-center gap-2 transition-all duration-500 ease-editorial cursor-pointer"
              >
                <span>Sign In with College Mail</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[13px] text-[#525252]">Not registered on MediConnect yet? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-[13px] font-semibold text-[#000000] hover:underline cursor-pointer"
                >
                  Register here &rarr;
                </button>
              </div>
            </form>
          )}

          {/* ================= MODE: REGISTER ================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-black/20 text-[13px] text-[#000000] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[#525252] mb-1.5">
                  Full Student Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525252]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Gourav Vyas"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[14px] text-[#000000] placeholder-[#737373] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#525252]">
                    College Mail ID
                  </label>
                  <span className="text-[11px] font-mono text-[#525252]">enxxxxxxxxxxx@medicaps.ac.in</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525252]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => handleRegEmailChange(e.target.value)}
                    placeholder="en22cs301045@medicaps.ac.in"
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] placeholder-[#737373] font-mono focus:outline-none focus:border-black"
                  />
                  {parsedRegEmail.isValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#000000]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {regEmail && (
                  <div className="mt-1 text-[12px] text-[#525252]">
                    {!parsedRegEmail.isValid
                      ? parsedRegEmail.errorReason
                      : `Valid format · Branch "${parsedRegEmail.branchCode.toUpperCase()}"${parsedRegEmail.detectedBranch ? ` (${parsedRegEmail.detectedBranch})` : ''}`}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Enrollment ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={regRollNumber}
                    placeholder="EN22CS301045"
                    className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-black/10 rounded-xl text-[13px] text-[#525252] font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Gender
                  </label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] focus:outline-none focus:border-black"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Academic Year
                  </label>
                  <select
                    value={regYear}
                    onChange={e => {
                      const yr = e.target.value as AcademicYear;
                      setRegYear(yr);
                      if (yr === '3rd Year') setRegSemester(6);
                      else if (yr === '1st Year') setRegSemester(2);
                      else if (yr === '2nd Year') setRegSemester(4);
                      else if (yr === '4th Year') setRegSemester(8);
                    }}
                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] focus:outline-none focus:border-black"
                  >
                    <option value="3rd Year">3rd Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Branch / Dept
                  </label>
                  <select
                    value={regBranch}
                    onChange={e => setRegBranch(e.target.value as StudentBranch)}
                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] focus:outline-none focus:border-black"
                  >
                    <option value="Computer Science (CSE)">CSE (cs)</option>
                    <option value="CSE - AI & ML">CSE - AI &amp; ML (ai)</option>
                    <option value="Information Technology (IT)">IT (it)</option>
                    <option value="Electronics & Comm (ECE)">ECE (ec)</option>
                    <option value="Data Science">Data Science (ds)</option>
                    <option value="Mechanical">Mechanical (me)</option>
                    <option value="Civil Engineering (CE)">Civil Engineering (ce)</option>
                    <option value="Electrical Engineering (EE)">Electrical Engineering (ee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3 pr-8 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] focus:outline-none focus:border-black font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(v => !v)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#525252] hover:text-[#000000] cursor-pointer"
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-[#525252] mb-1.5">
                    Confirm
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2.5 bg-[#FFFFFF] border border-black/10 rounded-xl text-[13px] text-[#000000] focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#000000] hover:bg-[#262626] text-[#FFFFFF] font-mono text-[13px] uppercase tracking-[0.1em] rounded-full flex items-center justify-center gap-2 transition-all duration-500 ease-editorial mt-2 cursor-pointer"
              >
                <span>Complete Registration</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[13px] text-[#525252]">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[13px] font-semibold text-[#000000] hover:underline cursor-pointer"
                >
                  Sign In instead &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Minimal Note */}
      <div className="w-full max-w-[1440px] mx-auto border-t border-black/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px] text-[#525252]">
        <span>© 2026 MediConnect</span>
        <span className="font-mono text-[12px] uppercase tracking-[0.1em]">
          Exclusively for Medi-Caps University Students
        </span>
      </div>
    </div>
  );
};
