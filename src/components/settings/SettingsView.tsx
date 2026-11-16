import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  LogOut, 
  Check, 
  Building2, 
  Lock, 
  Eye, 
  EyeOff,
  GraduationCap
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, updateProfile, logout, addToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'account' | 'privacy' | 'notifications' | 'about'>('account');

  // Account
  const [name, setName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [roll] = useState(currentUser?.rollNumber || '');

  // Privacy toggles
  const [publicProfile, setPublicProfile] = useState(true);
  const [showCgpa, setShowCgpa] = useState(true);
  const [showExternalLinks, setShowExternalLinks] = useState(true);

  // Notification toggles
  const [notifyCommunity, setNotifyCommunity] = useState(true);
  const [notifyChallenges, setNotifyChallenges] = useState(true);
  const [notifyLeaderboard, setNotifyLeaderboard] = useState(true);
  const [notifyEndorsements, setNotifyEndorsements] = useState(true);

  if (!currentUser) return null;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name });
    addToast('Account settings updated');
  };

  const handleSavePrivacy = () => {
    addToast('Privacy preferences saved');
  };

  const handleSaveNotifications = () => {
    addToast('Notification preferences updated');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Settings & Preferences
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your student credentials, visibility on the campus directory, and notification channels.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full sm:w-48 shrink-0 space-y-1">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'about', label: 'About MediConnect', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#141923]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#1E293B]">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-[#0F131C] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
          {/* ACCOUNT TAB */}
          {activeSubTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Account Credentials</h2>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full sm:w-2/3 px-3 py-2 bg-[#141923] border border-[#1E293B] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">University Roll Number</label>
                  <input
                    type="text"
                    disabled
                    value={roll}
                    className="w-full sm:w-2/3 px-3 py-2 bg-[#0A0D15] border border-[#1E293B] rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Verified with institutional registry.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full sm:w-2/3 px-3 py-2 bg-[#0A0D15] border border-[#1E293B] rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* PRIVACY TAB */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Privacy & Visibility</h2>
                <p className="text-xs text-slate-400 mt-1">Control who can discover and view components of your student profile.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Public Campus Profile</div>
                    <p className="text-[11px] text-slate-400">Allow peer students to discover you in student search.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={e => {
                      setPublicProfile(e.target.checked);
                      handleSavePrivacy();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Show Cumulative CGPA</div>
                    <p className="text-[11px] text-slate-400">Display your GPA on your profile card (rank will still be computed).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCgpa}
                    onChange={e => {
                      setShowCgpa(e.target.checked);
                      handleSavePrivacy();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Display External Profiles</div>
                    <p className="text-[11px] text-slate-400">Show links to your GitHub, LeetCode, and LinkedIn.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showExternalLinks}
                    onChange={e => {
                      setShowExternalLinks(e.target.checked);
                      handleSavePrivacy();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Campus Activity Alerts</h2>
                <p className="text-xs text-slate-400 mt-1">Configure in-app and browser notifications for student activity.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Community Comments & Likes</div>
                    <p className="text-[11px] text-slate-400">Notify when peers interact with your discussions and opportunities.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyCommunity}
                    onChange={e => {
                      setNotifyCommunity(e.target.checked);
                      handleSaveNotifications();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Challenge Reminders</div>
                    <p className="text-[11px] text-slate-400">Updates on active coding sprints and submission deadlines.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyChallenges}
                    onChange={e => {
                      setNotifyChallenges(e.target.checked);
                      handleSaveNotifications();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Leaderboard Position Changes</div>
                    <p className="text-[11px] text-slate-400">Receive alerts when your score updates or you climb ranks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyLeaderboard}
                    onChange={e => {
                      setNotifyLeaderboard(e.target.checked);
                      handleSaveNotifications();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <div>
                    <div className="text-xs font-bold text-white">Skill Endorsements</div>
                    <p className="text-[11px] text-slate-400">Notify when fellow students endorse your technical skills.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyEndorsements}
                    onChange={e => {
                      setNotifyEndorsements(e.target.checked);
                      handleSaveNotifications();
                    }}
                    className="w-4 h-4 rounded text-sky-500 bg-[#0F131C] border-[#1E293B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeSubTab === 'about' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">About MediConnect</h2>
                <p className="text-xs text-slate-400 mt-1">Platform vision & campus verification status.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141923] border border-[#1E293B] space-y-2 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-white">
                  "Your campus. Your profile. Your achievements. Your network."
                </p>
                <p>
                  MediConnect is built exclusively for college and university students. It combines the professional polish of LinkedIn with the open showcase style of GitHub and healthy campus competitive leaderboards.
                </p>
                <p className="text-slate-400 pt-1">
                  Built without faculty management, grading portals, or corporate bureaucracy — strictly for student empowerment and collaboration.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <span className="text-slate-500">Partner Campus</span>
                  <div className="font-semibold text-white mt-0.5">Medi-Caps University</div>
                </div>
                <div className="p-3 rounded-xl bg-[#141923] border border-[#1E293B]">
                  <span className="text-slate-500">Version</span>
                  <div className="font-semibold text-teal-400 font-mono mt-0.5">v2.4.0 (Autumn 2026)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
