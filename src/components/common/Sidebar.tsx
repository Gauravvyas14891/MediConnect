import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { 
  Home, 
  Compass, 
  Users, 
  Trophy, 
  Flame, 
  UserCircle, 
  Bell, 
  Settings, 
  LogOut, 
  GraduationCap, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    navigateToProfile, 
    notifications, 
    logout,
    isAdmin,
    canAccessAdmin,
    switchToAdmin,
    switchToStudent,
    setShowOnboarding
  } = useApp();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const mainNavItems = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: Home },
    { id: 'discover' as NavTab, label: 'Discover', icon: Compass },
    { id: 'community' as NavTab, label: 'Community', icon: Users },
    { id: 'leaderboard' as NavTab, label: 'Leaderboard', icon: Trophy },
    { id: 'challenges' as NavTab, label: 'Challenges', icon: Flame },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0B0F19] border-r border-[#1E293B] shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#1E293B]/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0EA5E9] via-[#14B8A6] to-[#8B5CF6] p-0.5 shadow-lg shadow-sky-500/20">
          <div className="w-full h-full bg-[#080B12] rounded-[10px] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="font-extrabold text-base tracking-tight text-white leading-tight font-sans flex items-center gap-1.5">
            Medi<span className="text-sky-400">Connect</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">DIGITAL CAMPUS</p>
        </div>
      </div>

      {/* Nav body */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Campus Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Campus Hub
          </div>
          <nav className="space-y-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border-l-2 border-sky-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#141923]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-400/80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Personal Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Personal Space
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => navigateToProfile(currentUser?.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border-l-2 border-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141923]'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCircle className={`w-4 h-4 transition-colors ${activeTab === 'profile' ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>My Profile</span>
              </div>
              {currentUser?.profileCompletion && currentUser.profileCompletion < 100 && (
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  {currentUser.profileCompletion}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border-l-2 border-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141923]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 transition-colors ${activeTab === 'notifications' ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500 text-slate-950">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* System & Tools */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Preferences
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-sky-500/15 to-transparent text-sky-400 border-l-2 border-sky-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141923]'
              }`}
            >
              <Settings className={`w-4 h-4 transition-colors ${activeTab === 'settings' ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-[#141923] transition-all group"
            >
              <Sparkles className="w-4 h-4 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span>Profile Setup Guide</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Profile Box / Admin Access */}
      <div className="p-3 border-t border-[#1E293B] bg-[#080B12]/60">
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F131C] border border-[#1E293B]">
            <div 
              onClick={() => navigateToProfile(currentUser.id)}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
            >
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-sky-500/30"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F8FAFC] truncate">{currentUser.name}</div>
                <div className="text-[10px] text-teal-400 font-mono">Rank #{currentUser.leaderboardRank} · Score {currentUser.leaderboardScore}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-[#141923] transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}

        {/* Authorized Admin / Student Access Switch */}
        {canAccessAdmin && (
          <div className="mt-2 text-center">
            {!isAdmin ? (
              <button
                onClick={switchToAdmin}
                className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Switch to Admin Mode</span>
              </button>
            ) : (
              <button
                onClick={switchToStudent}
                className="w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                <span>Switch to Student Access</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
