import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  CheckCheck,
  ChevronDown,
  Building2,
  GraduationCap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    canAccessAdmin,
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setIsSearchOpen, 
    navigateToProfile, 
    setActiveTab, 
    logout,
    switchToAdmin,
    switchToStudent,
    setShowOnboarding
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#080B12]/80 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-6 flex items-center justify-between">
      {/* Brand logo for mobile / compact */}
      <div className="flex items-center gap-3 lg:hidden">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0EA5E9] via-[#14B8A6] to-[#8B5CF6] p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-[#080B12] rounded-[7px] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight text-white font-sans">
            Medi<span className="text-sky-400">Connect</span>
          </span>
        </button>
      </div>

      {/* Campus Tag - Visible on desktop */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-[#0F131C] px-3 py-1.5 rounded-full border border-[#1E293B]">
        <Building2 className="w-3.5 h-3.5 text-sky-400" />
        <span className="font-medium text-slate-300">Medi-Caps University</span>
        <span className="text-slate-600">·</span>
        <span className="text-teal-400 font-medium">Digital Campus 2026</span>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-3 lg:mx-8">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0F131C] border border-[#1E293B] hover:border-sky-500/40 text-slate-400 hover:text-slate-200 text-xs md:text-sm transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors shrink-0" />
            <span className="truncate">Search students, skills, projects...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#141923] border border-[#1E293B] rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Admin Mode Badge */}
        {isAdmin && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Admin Mode</span>
            <button 
              onClick={switchToStudent}
              className="ml-1 text-[11px] underline text-purple-200 hover:text-white"
            >
              Exit
            </button>
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141923] border border-transparent hover:border-[#1E293B] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full ring-2 ring-[#080B12] animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B] bg-[#0A0D15]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#F8FAFC]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-500/20 text-sky-300 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1E293B]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    You're all caught up! No notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        setShowNotifMenu(false);
                        setActiveTab('notifications');
                      }}
                      className={`p-3.5 hover:bg-[#141923] transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-sky-500/5' : ''
                      }`}
                    >
                      {n.avatar ? (
                        <img 
                          src={n.avatar} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="font-semibold text-slate-200">{n.title}</span>
                          <span className="text-slate-500 text-[10px]">{n.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-[#1E293B] bg-[#0A0D15] text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    setActiveTab('notifications');
                  }}
                  className="text-xs font-medium text-sky-400 hover:text-sky-300"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill / Menu */}
        {currentUser ? (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-[#0F131C] border border-[#1E293B] hover:border-slate-700 transition-all text-left"
            >
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-sky-500/30"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-[#F8FAFC] leading-none truncate max-w-[100px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-teal-400 font-mono mt-0.5">
                  Rank #{currentUser.leaderboardRank}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F131C] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#1E293B] bg-[#0A0D15]">
                  <div className="font-semibold text-sm text-[#F8FAFC]">{currentUser.name}</div>
                  <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{currentUser.branch.split(' ')[0]} · {currentUser.year}</span>
                    <span className="text-sky-400 font-semibold">{currentUser.cgpa.toFixed(2)} CGPA</span>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigateToProfile(currentUser.id);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#141923] text-left transition-colors"
                  >
                    <User className="w-4 h-4 text-sky-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowOnboarding(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#141923] text-left transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Revisit Profile Setup Flow</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#141923] text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Privacy</span>
                  </button>

                  {canAccessAdmin && (
                    <>
                      <div className="h-px bg-[#1E293B] my-1" />

                      {/* Authorized Admin / Student Access Switch */}
                      {!isAdmin ? (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            switchToAdmin();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-purple-300 hover:text-white hover:bg-purple-500/10 text-left transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-400" />
                          <span>Switch to Admin Mode</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            switchToStudent();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/10 text-left transition-colors"
                        >
                          <GraduationCap className="w-4 h-4 text-sky-400" />
                          <span>Switch to Student Access</span>
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-sky-500/20"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
